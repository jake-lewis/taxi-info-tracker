#!/bin/sh
cd ~/node-app-test/node-app
sudo git pull master
sudo npm install
(sudo env PORT=3001 npm run start) &