#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
payload=${dir}/fixtures/instance.json

curl -v -d "@${payload}" -H 'Content-Type:application/json' http://localhost:8888/api/apps
