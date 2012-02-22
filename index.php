<?php

require __DIR__.'/lib/base.php';

F3::set('CACHE',TRUE);
F3::set('DEBUG',1);
F3::set('UI','ui/');

F3::route('GET /',
	function() {
	}
);

F3::run();

?>