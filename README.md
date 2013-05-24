# LostAndFound
Two goals behind "LostAndFound" project :

- Learn about a bunch of technologies : Node.js, mongodb, express, jade, mongoose, even to learn about git and github (seems to be ok so far)
- Help a music festival with an application they really need

# Requirements	

- [Node.js](http://nodejs.org/), obviously
- [NPM](http://npmjs.org/) in order to install several dependencies
	+ [express](http://expressjs.com) HTTP server routing, configuration and helpers done well
	+ [jade](http://jade-lang.com/) the template engine
	+ [mongoose](http://mongoosejs.com/)MongoDB library
- [MongoDB](http://www.mongodb.org/)

# Optional

- [Foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html) : helps you run the app (Procfile done)
- [Heroku](http://www.heroku.com/) : app hosting (package.json done)

# Installation
After all above required tools are installed, you may want to set the optionnal environment variables

- NODE_ENV [development|prodution] : changes nothing ATM but certainly in the future
- NODE_DB : the mongodb access url (default is mongodb://localhost/laf)
- PORT : listened port, default is 9001

You can also pass NODE_ENV and NODE_DB through command line (in this order), note that it's the only way to specify this under Cloud9.

# Contributors
ArnaudRinquin (the author)  
ipetrovilya
