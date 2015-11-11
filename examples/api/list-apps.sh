#!/usr/bin/env bash

# Return the list of apps in the docker instance

curl -v \
  -X "GET"\
  http://localhost:8888/api/apps
