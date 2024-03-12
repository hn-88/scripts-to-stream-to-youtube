// https://developers.google.com/apps-script/advanced/youtube
function checklivestreams() {
  
    try {
    // @see https://developers.google.com/youtube/v3/live/docs/liveStreams/list
    const results = YouTube.LiveStreams.list('snippet,cdn,contentDetails,status', {
      mine: true
    });
    
    if (!results || results.items.length === 0) {
      console.log('No Live Streams found.');
      return;
    }
    for (let i = 0; i < results.items.length; i++) {
      if(results.items[i].status.streamStatus=== 'active') {
        console.log(results.items[i].id);
        console.log(results.items[i].cdn.ingestionInfo.streamName);
      }
      
      
    }

    
  } catch (err) {
    // TODO (developer) - Handle exception
    console.log('Failed with err %s', err.message);
  }
}

function checklivebroadcasts() {
  // @see https://developers.google.com/youtube/v3/live/docs/liveBroadcasts/list
    const results2 = YouTube.LiveBroadcasts.list('snippet,contentDetails,status', {
      mine: true
    });
    if (!results2 || results2.items.length === 0) {
      console.log('No Live Broadcasts found.');
      return;
    }
    for (let i = 0; i < results2.items.length; i++) {
    console.log(results2.items[i]);
    }
}

// https://developers.google.com/youtube/v3/live/life-of-a-broadcast
function createbroadcastyt() {
  try {
    // Set up your broadcast
    // from https://developers.google.com/youtube/v3/live/docs/liveBroadcasts#resource
    const lbrresource = 
    {
  "kind": "youtube#liveBroadcast",
  "snippet": {
    "channelId": 'UCddXv1Y0arlYPbr0ahRYsBw',
    "title": 'API test1',
    "description": 'API test1 description',
    // "thumbnails": {
    //   (key): {
    //     "url": string,
    //     "width": unsigned integer,
    //     "height": unsigned integer
    //   }
    // },
    "scheduledStartTime": '2024-03-12T09:30:00.0Z',
    "scheduledEndTime": '2024-03-12T14:00:00.0Z'
    // "actualStartTime": datetime,
    // "actualEndTime": datetime,
    // "isDefaultBroadcast": boolean,
    // "liveChatId": string
  },
  "status": {
    //"lifeCycleStatus: 
    "privacyStatus": "public",
    //"recordingStatus": string,
    //"madeForKids": false,
    "selfDeclaredMadeForKids": "false"
  },
  "contentDetails": {
   // "boundStreamId": 'ddXv1Y0arlYPbr0ahRYsBw1710082827760667',
    //"boundStreamLastUpdateTimeMs": datetime,
    //  "monitorStream": {
    //    "enableMonitorStream": false
    //   "broadcastStreamDelayMs": unsigned integer,
    //   "embedHtml": string
    // },
    "enableEmbed": true,
    "enableDvr": true,
    "recordFromStart": true,
    //"enableClosedCaptions": false,
    // "closedCaptionsType": string,
    // "projection": string,
    // "enableLowLatency": boolean,
    // "latencyPreference": boolean,
    "enableAutoStart": true,
    "enableAutoStop": true
  }
  // "statistics": {
  //   "totalChatCount": unsigned long
  // },
  // "monetizationDetails": {
  //   "cuepointSchedule": {
  //     "enabled": boolean,
  //     "pauseAdsUntil": datetime,
  //     "scheduleStrategy": string,
  //     "repeatIntervalSecs": unsigned integer,
  //   }
  // }
  }

  const brresmin = {"snippet":{"title":"Test broadcast","scheduledStartTime":"2024-03-12T10:30:00.0Z","scheduledEndTime":"2024-03-12T19:30:00.0Z"},"contentDetails":{"enableDvr":true,"enableEmbed":true,"recordFromStart":true,"startWithSlate":true},"status":{"privacyStatus":"unlisted"}};
 

    const brInsertresults = YouTube.LiveBroadcasts.insert(lbrresource,'snippet,contentDetails,status');
    console.log('Insert Broadcast Results:');
    console.log(brInsertresults);
    brId = brInsertresults.id;

//     const livestreamres = {
//   "kind": "youtube#liveStream",
//   // "etag": etag,
//   // "id": string,
//   "snippet": {
//     // "publishedAt": datetime,
//     // "channelId": string,
//     "title": 'API test stream',
//     "description": 'API test stream descr',
//     "isDefaultStream": true
//   },
//   "cdn": {
//      "ingestionType": 'rtmp',
//     // "ingestionInfo": {
//     //   "streamName": string,
//     //   "ingestionAddress": string,
//     //   "backupIngestionAddress": string
//     // },
//      "resolution": 'variable',
//     "frameRate": "variable"
//   },
//   "status": {
//     "streamStatus": string,
//     "healthStatus": {
//       "status": string,
//       "lastUpdateTimeSeconds": unsigned long,
//       "configurationIssues": [
//         {
//           "type": string,
//           "severity": string,
//           "reason": string,
//           "description": string
//         }
//       ]
//     }
//   },
//   "contentDetails": {
//     "closedCaptionsIngestionUrl": string,
//     "isReusable": boolean
//   }
// };

//     const strInsertresults = YouTube.LiveStreams.insert(livestreamres,'id,snippet,cdn,content_details,status');
// We're going to reuse an existing streamId.

// bind
bindresult = YouTube.LiveBroadcasts.bind(brId,'snippet,status',{"streamId":'ddXv1Y0arlYPbr0ahRYsBw1710082827760667'});
console.log('Bind results:');
console.log(bindresult);
// start transmitting video

    

    // Test

    // Broadcast
    // Conclude your broadcast
    

  } catch (err) {
    // TODO (developer) - Handle exception
    console.log('Failed with err %s', err.message);
  }
}

function bindbc() {
  try {
    //result = YouTube.LiveBroadcasts.bind('aFv6gy2uS58','id,snippet,contentDetails,status','ddXv1Y0arlYPbr0ahRYsBw1710082827760667');
    result = YouTube.LiveBroadcasts.bind('aFv6gy2uS58','snippet,status',{"streamId":'ddXv1Y0arlYPbr0ahRYsBw1710082827760667'});
    console.log(result);
       

  } catch (err) {
    // TODO (developer) - Handle exception
    console.log('Failed with err %s', err.message);
  }
  

}

function transitionbc() {
  try {
    result = YouTube.LiveBroadcasts.transition('testing','aFv6gy2uS58','id,status');
    console.log(result);
       

  } catch (err) {
    // TODO (developer) - Handle exception
    console.log('Failed with err %s', err.message);
  }
  

}
/*
From https://stackoverflow.com/questions/35003786/cannot-make-transition-of-my-youtube-broadcast-to-live-using-youtube-api
    1. ensure you have broadcast and livestream created and ready.
    2. and ensure that broadcast lifecycle status is not COMPLETE, otherwise recreate broadcast ... so ensure that your broadcast lifecycle status is ready
    3. bind broadcast to livestream
    4. start publishing video to livestream
    5. wait for livestream status active
    6. transition to testing (yes, you have to do it instead of moving to live)
    7. wait for broadcast lifeCycleStatus to become testing
    8. transition to live
    9. wait for broadcast lifeCycleStatus to become live

    ** You can leave 4-7 steps if: the broadcast's monitor stream was disabled by setting the contentDetails.monitorStream.enableMonitorStream property to false when creating or updating that broadcast.

    java code:
    liveStreamRequest = youtube.liveStreams()
                    .list("id,status")
                    .setId(liveBroadcast.getContentDetails()
                            .getBoundStreamId());
            LiveStreamListResponse returnedList = liveStreamRequest.execute();
            List<LiveStream> liveStreams = returnedList.getItems();
            if (liveStreams != null && liveStreams.size() > 0) {
                LiveStream liveStream = liveStreams.get(0);
                if (liveStream != null)
                    while (!liveStream.getStatus().getStreamStatus()
                            .equals("active")) {
                        Thread.sleep(1000);
                        returnedList = liveStreamRequest.execute();
                        liveStreams = returnedList.getItems();
                        liveStream = liveStreams.get(0);
                    }
            }

    * If we start sending data before the broadcast is created, it seems to fail.

*/
  
