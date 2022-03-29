#! /bin/bash
#
# Streaming to youtube using ffmpeg

# Configure youtube to use 720p. 

VBR="2500k"                                    # Bitrate 
FPS="30"                                       # FPS 
QUAL="medium"                                  # Quality Preset for FFMPEG
YOUTUBE_URL="rtmp://a.rtmp.youtube.com/live2"  # you get these from your youtube live 
KEY="ga34-v4yg-your-key-here"                  # stream control panel

#SOURCE="/home/sgh/01.mp4"                      # local files can be streamed like this
#SOURCE="udp://239.255.139.0:1234"              # to stream from a local udp stream, 
                                  #in which case the infinite loop would not be needed
SOURCE="$(yt-dlp -g -f b  https://youtu.be/5BYEAAn8_Ko)"
# for the infinite loop test, instead of -i $SOURCE, I'm directly putting the yt-dlp command inside the loop
# or else the youtube url returned would time out after some time.


while true

do

ffmpeg -hide_banner -loglevel error  \
    -i "$(yt-dlp -g -f b  https://youtu.be/5BYEAAn8_Ko)" -deinterlace \
    -vcodec libx264 -pix_fmt yuv420p -preset $QUAL -r $FPS -g $(($FPS * 2)) -b:v $VBR \
    -acodec libmp3lame -ar 44100 -threads 6 -qscale 3 -b:a 712000 -bufsize 512k \
    -f flv "$YOUTUBE_URL/$KEY"

done
