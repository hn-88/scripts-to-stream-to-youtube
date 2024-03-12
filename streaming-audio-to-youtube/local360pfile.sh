# creates a local file in the format youtube needs, so that we can use the copy codec when streaming and reduce cpu usage
ffmpeg  -i /my/path/input.mp4 \
  -pix_fmt yuv420p -x264-params keyint=48:min-keyint=48:scenecut=-1 \
  -s 640x360 -b:v 1500k -b:a 128k -ar 44100 -acodec aac  -vcodec libx264 \
  -preset superfast -bufsize 960k -crf 28 -threads 2 -f flv \
   /my/path/localfile_360p.mp4
