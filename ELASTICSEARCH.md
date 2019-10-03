##### Install ElasticSearch on Ubuntu server: 
- Check java version : (ElasticSearch requires at least Java 8, meanwhile recommend using Oracle JDK version 1.8.0_131^)
# java -version
# echo $JAVA_HOME
Note that $JAVA_HOME is an environment variable and was not set automatically when install Java. We have to set it ourself.

To set the $JAVA_HOME variable, first open /etc/environment
# sudo vim /etc/environment
Add the following lines : 
# JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64
# export JAVA_HOME

Then reload the environment file : 
# . /etc/environment
Then check again :
# echo $JAVA_HOME

Install ElasticSearch:
- First update packages :
# sudo apt-get update
- Then download ElasticSearch latest version, 6.3.2 at the time i write this document.
# wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.3.2.deb
- Then install it:
# sudo dpkg -i elasticsearch-6.3.2.deb
- Start ElasticSearch service :
# sudo systemctl enable elasticsearch.service

- Configuration :
+ Default variables :
# sudo vim /etc/elasticsearch/elasticsearch.yml
Uncomment and change the cluster.name and node.name, network.host to 0.0.0
+ Turn off firewall or set firewall's rules to allow connection from trusted IP to port 9200.
+ Restart ElasticSearch service to apply changes : 
# sudo systemctl restart elasticsearch

- Testing ElasticSearch :
# curl -X GET 'http://127.0.0/1:9200' 
You should see a JSON response contains ElasticSearch information


### ABOUT ELASTICSEARCH
- A search & analyze engine.
- How ElasticSearch works : 
 + ElasticSearch creates indexes ( equal to collections in MongoDB) to store documents.
 + Search effectively with built-in data structures & search methods.
 + What we do is synchronizing our collections in MongoDB into ElasticSearch indexes & queries using ElasticSearch API. This synchronization breaks into 2 big parts : 
    + Synchronize existed documents into ElasticSearch. We use a package named Mongoosastic to automatically do this.
    + Synchronize document when trigger mongoose methods (update, create...) Mongoosastic automatically synchronize documents on these methods : save(), remove(), findOneAndRemove(), findOneAndUpdate(), insertMany()... (basically all mongoose methods that trigger mongoose's built-in middlewares).
    + Other methods Mongoosastic cannot synchronize documents. Therefore we have to create a service to do it for us. This service located in /api/elasticsearch/service . To use it, simply called it after using a mongoose method. It accepts a query parameter which will synchronize all documents in mongodb that matched the query.
 + Search API : At this time we only use ElasticSearch to filter the tutors. The API controller was located at /api/modules/auth/users/repository and was named "searchUsers".
 + To use this API properly, do remember that we need 5 collections in our mongo database : Users, CourseForTutors, Courses, Tuitions & Sessions. All of those collections' schemas were listed inside /api/modules folders. Pay attention to those populated fields : 
    + Users : 'courseForTutor' & 'currency' fields.
    + CourseForTutor : 'course' & 'tuition' fields.
    + Tuitions: 'session' field.

### Clear ElasticSearch Index
- On your terminal / command lines, type : "curl -X DELETE localhost:9200/users" . This will clear the 'users' index, which is our main index in project. (Note that ElasticSearch service run on port 9200).
- If you don't have your Curl installed, try sending a DELETE request via Postman to localhost:9200/users.

### Restart ElasticSearch service :
- On Ubuntu server, type sudo systemctl restart elasticsearch. 

### Security
- Configure Firewall / Nginx to only accept request from trusted IPs / Localhost