sudo killall node
# This will leak file descriptors in jenkins
#not sure how else to run the server without hanging the build
(sudo npm run start) &