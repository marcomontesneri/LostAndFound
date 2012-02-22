<?php

/**
 * All route should be declared by this class
 * Only exception is test related routes ; those routes will be declared
 * separatly to ease integration.
 * It's better to group related routes declaration within a single method
 * The first to group to be added : API and Pages
 *
 * # Target routing #
 * <root_path>/
 *            /logout
 *            /login
 *            /found
 *            /lost
 *            /api
 *                /lost#CRUD
 *                /found#CRUD
 *                /contact#CRUD
 *                /storage#CRUD
 *            /tests (not declared here)
 * # KNOWN ISSUES and TODO #
 * - the use of static functions is dirty
 * - auth matters will be added later
 */
class Routing {
	
	/**
	 * This function declares all (JSON) api routes.
	 *
	 */
	public static function declareApiRouting() {
		
		F3::map('/api/lost',"ApiLost");
		
	}

	public static function declarePagesRouting() {

	}
	
}