<?php use Data

Class Lost extends Axon {
	
	public function __construct() {
		$this->sync('lost');
	}

	public function listAll() {
		return $this->find();
	}
}