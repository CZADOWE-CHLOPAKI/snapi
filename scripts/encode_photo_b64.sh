#!/bin/bash

# Encode a photo to base64 using python (used for sending photos in JSON requests)
# sudo apt install xsel
# ./encode_photo_b64.sh ~/Documents/car.jpg | xsel -ib


if [ $# -ne 1 ]; then
    echo "Usage: ./encode_photo_b64.sh <photo_path>"
    exit 1
fi

photo_path=$1
if [ ! -f $photo_path ]; then
    echo "File not found: $photo_path"
    exit 1
fi

base64_photo=$(python3 -c "import base64; print(base64.b64encode(open('$photo_path', 'rb').read()).decode('utf-8'))")
echo $base64_photo
