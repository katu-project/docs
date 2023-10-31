#!/bin/bash

node $(dirname "$0")/push.js $1
node $(dirname "$0")/cdn.js $1