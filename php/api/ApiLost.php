<?php

class ApiLost {

	public function listAll() {
		$dataLost = new DataLost();
		$list = $dataLost->listAll();
		echo json_encode($list);
	}

	/* Prints an item in json
	 */
	public function get() {
		$id = F3::get('PARAMS["id"]');
		$dataLost = new DataLost();
		$lostItem = $dataLost->get($id);
		echo json_encode($lostItem);
	}

	public function post() {

	}

	public function put() {


	}

	public function delete() {

	}
}