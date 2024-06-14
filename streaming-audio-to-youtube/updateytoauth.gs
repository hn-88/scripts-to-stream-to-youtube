// From https://hawksey.info/blog/2017/09/identity-crisis-using-the-youtube-api-with-google-apps-script-and-scheduling-live-broadcasts-from-google-sheets/
// modified for our use.

//we are going to use three libraries:

//    cUseful – a helper library developed by Bruce Mcpherson which contains lots of useful functions. For this project we are going to use the Fiddler class which is used to easily read, manipulate and write data
//    OAuth2 for Apps Script – a library developed by Google for Google Apps Script that provides the ability to create and authorize OAuth2 tokens
//    YouTube – a library I’ve created of YouTube Data API calls (generated from the Google Discovery Service with the Generator-SRC script created by Spencer Easton – read about it)

//Script Editor click on Resources > Libraries… and in the Add a library field add the following libraries selecting the latest version:

//    1EbLSESpiGkI3PYmJqWh3-rmLkYKAtCNPi1L2YCtMgo2Ut8xMThfJ41Ex – cUseful
//    1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF – OAuth2 for Apps Script
//    13FP5EWK7x2DASsiBXETcr0TQ07OCLEVWOoY1jbVR-bqVpFmsydUSXWdR – YouTube Data API

////////////////////////////////////////////////////////////////////////////////////////
// written by Martin Hawksey - https://hawksey.info/blog/author/mhawksey/
/*
To use the authentication service we’ve created we need to provide client credentials. To do this we need to setup a Google Cloud Platform project and create credentials:

    1. In the Script Editor select Resources > Cloud platform project… and click the link to the currently associated project 
    2. In the Google Cloud Platform window click Go to APIs overview
    3. In APIs & services click Enable APIs and Services
    4. In the Library search/click on YouTube Data API and click Enable
    
Enabling YouTube Data API
    5. Still in the APIs & services screen click on Credentials from the side menu
    6. Click the Create credentials, select OAuth Client ID then Web application
    7. Enter a name as required and in the Authorised JavaScript origins enter https://script.google.com
    8. In Script Editor click Run > Run function > logRedirectUri. From the View > Logs copy the url into the Authorised redirect URIs field API console, click Create
    
Create credentials
    9. In the Script Editor open File > Project properties and in the Script properties tab and new rows for client_id and client_secret copying the values from the API console
    
Project properties
    10. In the Script Editor click Run > Run function > setup and then from the View > Logs copy the url in a new browser tab.
    11. Finally select the YouTube account you would like to schedule broadcasts for
    

You can test if you have successfully setup and connect with the YouTube Data API by running the setup function again and checking the Log and to see if channel data is returned.
*/
/////////////////////////////////////////////////////////////////////////////////////////



/**
 * Authorizes and makes a request to the YouTube Data API.
 */
function setup() {
  var service = getYouTubeService();
  YouTube.setTokenService(function() {
    return service.getAccessToken();
  });
  if (service.hasAccess()) {
    var result = YouTube.channelsList("snippet", {
      mine: true
    });
    Logger.log(JSON.stringify(result, null, 2));
    throw "Open View > Logs to see result";
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
      authorizationUrl);
    throw "Open View > Logs to get authentication url";
  }
}
 
/**
 * Configures the service.
 */
function getYouTubeService() {
  return OAuth2.createService('YouTube')
    // Set the endpoint URLs.
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    // Set the client ID and secret.
    .setClientId(getStaticScriptProperty_('client_id'))
    .setClientSecret(getStaticScriptProperty_('client_secret'))
    // Set the name of the callback function that should be invoked to complete
    // the OAuth flow.
    .setCallbackFunction('authCallback')
    // Set the property store where authorized tokens should be persisted
    // you might want to switch to Script Properties if sharing access
    .setPropertyStore(PropertiesService.getUserProperties())
    // Set the scope and additional Google-specific parameters.
    .setScope(["https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtubepartner",
      "https://www.googleapis.com/auth/youtubepartner-channel-audit"
    ])
    .setParam('access_type', 'offline');
}
 
/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  var service = getYouTubeService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}
/**
 * Logs the redirect URI to register in the Google Developers Console.
 */
function logRedirectUri() {
  var service = getYouTubeService();
  Logger.log(service.getRedirectUri());
  throw "Open View > Logs to get redirect url";
}
 
/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  var service = getYouTubeService();
  service.reset();
}
 
/**
 * Gets a static script property, using long term caching.
 * @param {string} key The property key.
 * @returns {string} The property value.
 */
function getStaticScriptProperty_(key) {
  var value = CacheService.getScriptCache().get(key);
  if (!value) {
    value = PropertiesService.getScriptProperties().getProperty(key);
    CacheService.getScriptCache().put(key, value, 21600);
  }
  return value;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @OnlyCurrentDoc
 */
YouTube.setTokenService(function() {
  return getYouTubeService().getAccessToken();
});
 
// Read data from current sheet and create live events returning details back to sheet
function schedule_events() {
  var sheet = SpreadsheetApp.getActiveSheet();
  new cUseful.Fiddler(sheet)
    .mapRows(function(row) {
      if (!row.youtube_url && !row.stream_key) { // if not already scheduled
        // format datetime to ISO 8601 format as per docs https://developers.google.com/youtube/v3/live/docs/liveBroadcasts#snippet.scheduledStartTime
        row.start_time = Utilities.formatDate(row.start_time, Session.getScriptTimeZone(), "YYYY-MM-dd'T'HH:mm:ssZZZZZ");
        row.end_time = Utilities.formatDate(row.end_time, Session.getScriptTimeZone(), "YYYY-MM-dd'T'HH:mm:ssZZZZZ");
        // step 1 - create a broadcast
        var broadcast_resource = insert_broadcast(row);
        // step 2 - create a stream
        var stream_resource = insert_stream(row);
        // step 3 - bind broadcast to stream
        var bind_result = bind_broadcast(broadcast_resource.id, stream_resource.id);
        // step 4 - prep data to add back to the sheet
        row.youtube_url = "https://youtu.be/" + broadcast_resource.id;
        var ingestionInfo = stream_resource.cdn.ingestionInfo;
        row.stream_key = ingestionInfo.streamName;
        row.ingestion_address = ingestionInfo.ingestionAddress;
        row.start_time = new Date(row.start_time);
        row.end_time = new Date(row.end_time);
      }
      return row;
    }).dumpValues();
}
 
// The following is based on
// https://developers.google.com/youtube/v3/live/code_samples/python#create_a_broadcast_and_stream
// LICENCE Copyright Google http://www.apache.org/licenses/LICENSE-2.0
// Create a liveBroadcast resource and set its title, scheduled start time,
// scheduled end time, and privacy status.
function insert_broadcast(options) {
  var insert_broadcast_response = YouTube.liveBroadcastsInsert("snippet,status", {
    "snippet": {
      "title": options.title,
      "description": options.desc,
      "scheduledStartTime": options.start_time,
      "scheduledEndTime": options.end_time,
    },
    "status": {
      "privacyStatus": options.privacy_status,
    }
  }, {});
  Logger.log(insert_broadcast_response);
  return insert_broadcast_response;
}
// Create a liveStream resource and set its title, format, and ingestion type.
// This resource describes the content that you are transmitting to YouTube.
function insert_stream(options) {
  var insert_stream_response = YouTube.liveStreamsInsert("snippet,cdn", {
    "snippet": {
      "title": options.title,
      "description": options.description,
    },
    "cdn": {
      "format": options.format,
      "ingestionType": "rtmp"
    }
  }, {});
  Logger.log(insert_stream_response);
  return insert_stream_response;
}
 
// Bind the broadcast to the video stream. By doing so, you link the video that
// you will transmit to YouTube to the broadcast that the video is for.
function bind_broadcast(broadcast_id, stream_id) {
  var bind_broadcast_response = YouTube.liveBroadcastsBind(broadcast_id, "id,contentDetails", {
    "streamId": stream_id
  });
  Logger.log(bind_broadcast_response);
  return bind_broadcast_response;
}

