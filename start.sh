#!/bin/bash

# You need to install pm2 >> npm install pm2 -g
pm2 start npm --name "wagateway" --watch -- start