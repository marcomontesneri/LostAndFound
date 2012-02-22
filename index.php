<?php

require __DIR__.'/lib/base.php';

F3::set('AUTOLOAD','php/api/; php/core/; php/data/; php/lib/');

// Load config file
F3::config('setup.cfg');

// Set DB ; can't be done in setup file
F3::set('DB',
	new DB(
		'mysql:host=localhost;port=3306;dbname=lostandfound',
		'root',
		'root'
	)
);

// No need to say it's import to set routes
Routing::declareApiRouting();
Routing::declarePagesRouting();

// Run my minions !1!
F3::run();

?>