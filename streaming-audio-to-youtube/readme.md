# Stream an audio stream multiplexed with a local video file to youtube

This directory contains scripts to automatically stream an audio stream multiplexed with a local video file to youtube.

Google apps script (.gs file) needs the Youtube "Advanced Service" to be added by clicking on the Services button on the left-hand-side pane of the google apps script editor.

## Logic:
We want the stream to be archived. For this, youtube requires the stream to be less than 12 hours long. So, we will
1. create a stream (already exists by creating from studio.youtube.com)
2. create a broadcast bound to that stream, with a scheduled start time a few minutes in the future, with "auto-start", dvr, etc enabled
3. start the streaming using ffmpeg
4. Before 12 hours are up, stop the streaming from ffmpeg - within 60 sec, the broadcast auto-stops and gets archived.
5. Start again with creating a broadcast.

## Our process:
1. Create two stream ids using studio.youtube.com, schedule them for the future, and delete the scheduled broadcast after getting the stream ids.
2. Use those two created stream ids in our google apps script, using the checklivestreams() to get the streamids and stream names. The stream names are what are used as stream keys for ffmpeg on our source server.
3. Schedule the createbroadcastAM() function for 3am-4am IST slot daily, and similarly createbroadcastPM() for 3pm-4pm IST slot daily using Google Apps Scripts time-based triggers.
4. Create cron jobs on our source server to run two different copies of the str2ytc.sh script, maybe named am and pm respectively, with the two different stream keys, starting at 4.29 am IST and 4.29 pm IST. (In case exactly 12 hours long stream can't be archived by youtube, we need to create another script with <pre>killall ffmpeg</pre> to run a few minutes before.)

## Authentication issues and workaround:
https://stackoverflow.com/questions/46520366/youtube-apps-script-api-only-runnable-by-accounts-without-a-youtube-channel?noredirect=1&lq=1

https://hawksey.info/blog/2017/09/identity-crisis-using-the-youtube-api-with-google-apps-script-and-scheduling-live-broadcasts-from-google-sheets/

Implemented with a Google Sheet to store the refresh token at https://github.com/hn-88/scripts-to-stream-to-youtube/blob/main/streaming-audio-to-youtube/updateytoauth.gs

