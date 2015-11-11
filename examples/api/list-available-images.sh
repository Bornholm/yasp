#!/usr/bin/env bash

# Return the list of available app images in the docker instance

curl -v \
  -X "GET"\
  http://localhost:8888/api/apps/images
