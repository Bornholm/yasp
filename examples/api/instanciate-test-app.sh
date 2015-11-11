#!/usr/bin/env bash

# Return the list of apps in the docker instance
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REQUEST_PAYLOAD=$DIR/instance-request.json

echo $REQUEST_PAYLOAD

curl -v \
  -X "POST"\
  -H "Content-Type: application/json" \
  --data @$REQUEST_PAYLOAD \
  http://localhost:8888/api/apps
