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
 *                /losts/@id #CRUD
 *				  /losts GET > list
 *				  /losts-search GET > list filtred
 *                /found#CRUD
 *                /contact#CRUD
 *                /storage#CRUD
 *            /tests (not declared here)
 * # KNOWN ISSUES and TODO #
 * - the use of static functions is dirty
 * - auth matters will be added later
 */
class Routing {

	const 
		API_ROOT = "/api",
		SEARCH_EXTENSION = "-search",
		LOSTS = "/losts",
		ID_PARAM = "/@id";


	/**
	 * This function declares all (JSON) api routes.
	 *
	 */
	public static function declareApiRouting() {
		
		// CRUD for single lost items
		F3::route('GET ' . self::API_ROOT . self::LOSTS . self::ID_PARAM,"ApiLost->get");
		F3::route('PUT ' . self::API_ROOT . self::LOSTS . self::ID_PARAM,"ApiLost->update");
		F3::route('DELETE ' . self::API_ROOT . self::LOSTS . self::ID_PARAM,"ApiLost->delete");

		// List & search
		F3::route('POST ' . self::API_ROOT . self::LOSTS,"ApiLost->create");
		F3::route('GET ' . self::API_ROOT . self::LOSTS,"ApiLost->listAll");
		F3::route('GET ' . self::API_ROOT . self::LOSTS . self::SEARCH_EXTENSION,"ApiLost->search");
		
		F3::route('GET ' . self::API_ROOT . self::LOSTS . "/test", function() {
			echo Template::serve('testApi.html');
		});
	}

	public static function declarePagesRouting() {

	}
	
}