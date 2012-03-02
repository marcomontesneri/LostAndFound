<?php

class DataLost extends Axon {
	
	function __construct() {
		$this->sync('lost');
	}

	function listAll() {
		return $this->afind();
	}

	function get($id) {
		return $this->afind(
			array('idlost=:id', array(':id'=>$id))
		);
	}

}