#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  TUSD_BINARY=./bin/tusd_linux

elif [[ "$OSTYPE" == "darwin"* ]]; then
  TUSD_BINARY=./bin/tusd_darwin

elif [[ "$OSTYPE" == "msys" ]]; then
  TUSD_BINARY=./bin/tusd.exe
fi

eval $(cat .env | sed 's/^/export /')

$TUSD_BINARY -behind-proxy -s3-bucket=$TUSD_S3_BUCKET -s3-endpoint=$TUSD_S3_ENDPOINT -s3-object-prefix=$TUSD_S3_OBJECT_PREFIX -hooks-http $HOOKS_HTTP

