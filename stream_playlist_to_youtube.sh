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
#SOURCE="$(yt-dlp -g -f b  https://youtu.be/5BYEAAn8_Ko)"
# ytplaylist.txt consists of one youtube url per line, 
# have to be urls of individual videos, not playlists.

while true

do

  for line in $(cat ytplaylist.txt)
  do
    #echo "Playlist item is $line "
    #read -p "Press Enter to continue" < /dev/tty

  ffmpeg -hide_banner -loglevel error  \
      -i "$(yt-dlp -g -f b  $line)" -deinterlace \
      -vcodec libx264 -pix_fmt yuv420p -preset $QUAL -r $FPS -g $(($FPS * 2)) -b:v $VBR \
      -acodec libmp3lame -ar 44100 -threads 6 -qscale 3 -b:a 712000 -bufsize 512k \
      -f flv "$YOUTUBE_URL/$KEY"

  done

done

