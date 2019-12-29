#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  TUSD_BINARY=./bin/tusd_linux

elif [[ "$OSTYPE" == "darwin"* ]]; then
  TUSD_BINARY=./bin/tusd_darwin

elif [[ "$OSTYPE" == "msys" ]]; then
  TUSD_BINARY=./bin/tusd.exe
fi

export $(egrep -v '^#' .env | xargs)

$TUSD_BINARY -behind-proxy -host=$HOST -port=$PORT -s3-bucket=$S3_BUCKET -s3-endpoint=$S3_ENDPOINT -s3-object-prefix=$S3_OBJECT_PREFIX -hooks-http $HOOKS_HTTP
