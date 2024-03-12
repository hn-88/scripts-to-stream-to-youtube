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
