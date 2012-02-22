<?php

class ApiLost {

	public function get() {
		$lostData = new Data/Lost;
		$list = $lostData->listAll();
		echo json_encode($list);
	}
}