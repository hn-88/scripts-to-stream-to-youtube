# stream to youtube using copy codec for video, to reduce cpu usage
killall ffmpeg >/dev/null 2>&1
#killall ffmpeg >/dev/null 2>&1
#sleep 90
ffmpeg -stream_loop -1 -i /my/path/localfile_360p.mp4 \
  -i http://localhost:8020 -map 0:v:0 -map 1:a:0 \
  -b:a 128k -ar 44100 -acodec aac  -c:v copy \
  -preset superfast -bufsize 960k -crf 28 -threads 2 -f flv \
   rtmp://a.rtmp.youtube.com/live2/the-actual-stream-key >/dev/null 2>&1
