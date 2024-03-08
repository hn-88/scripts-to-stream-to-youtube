# from https://stackoverflow.com/questions/43586435/ffmpeg-to-youtube-live
ffmpeg -stream_loop -1 -i $MYPATH/background/$background \
-i http://localhost:3888 -filter:a "volume=$volume" \
-r 24 -g 48 -pix_fmt yuv420p -x264-params keyint=48:min-keyint=48:scenecut=-1 \
-s $size -b:v $bitrate -b:a 128k -ar 44100 -acodec aac \
-vcodec libx264 -preset superfast -bufsize 960k -crf 28 -threads 2 \
-f flv rtmp://a.rtmp.youtube.com/live2/$key
# we can run a config.sh where all the variables like $background etc are defined,
## Config File
#background=out.mp4
#size=640x360
#bitrate=750k
#key=----KEY----
#volume=0.9
#
