#Welcome
Below are steps to install BigBlueButton v2.0 media server :

One single command: 
# wget -qO- https://ubuntu.bigbluebutton.org/bbb-install.sh | bash -s -- -v xenial-200 -s bbb.example.com -e    info@example.com -t -g

All we need are BigBlueButton media server & BigBlueButton HTML5 Client so uninstall BigBlueButton Demo API Client after installed: 
# sudo apt-get purge bbb-demo

Then generate server key and server API Url, put it inside /api/config/bigbluebutton.config.ts 
# sudo bbb-conf --salt

APIs to generate BigBlueButton meeting room, create BigBlueButton room and check BigBlueButton room urls are inside /api/modules/elearning/sessions/

To customize the BBB-HTML5 Client, fork BigBlueButton's repository: https://github.com/bigbluebutton/bigbluebutton
Then clone it to server. Use pm2 to start the Meteor server of BBB-HTML5 folder, replace the BBB-HTML5 package which was automatically installed when we run that one single command.
# pm2 start npm -- run start
Then stop the bbb-html5 service:
# sudo systemctl stop bbb-html5.service
Then remove that default bbb-html5 client :
# sudo apt-get purge bbb-html5