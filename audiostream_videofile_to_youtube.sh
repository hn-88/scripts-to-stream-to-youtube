# from https://stackoverflow.com/questions/43586435/ffmpeg-to-youtube-live
ffmpeg -stream_loop -1 -i /path/filename.mp4 \
  -i http://localhost:8020 -map 0:v:0 -map 1:a:0 \
  -pix_fmt yuv420p -x264-params keyint=48:min-keyint=48:scenecut=-1 \
  -s 640x360 -b:v 1500k -b:a 128k -ar 44100 -acodec aac  -vcodec libx264 \
  -preset superfast -bufsize 960k -crf 28 -threads 2 -f flv \
   rtmp://a.rtmp.youtube.com/live2/$key
# we can run a config.sh where all the variables like $background etc are defined,
## Config File
#background=out.mp4
#size=640x360
#bitrate=750k
#key=----KEY----
#volume=0.9
#
