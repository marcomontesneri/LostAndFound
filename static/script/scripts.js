(function(){
	$('.datepicker').datepicker();

	var form = $('#declareLossForm'),
		modal = $('#lossModal');

	modal.modal({
		show: false
	});

	form.submit(function(event){
		event.preventDefault();
		var $form = $(this),
			lost = {
				shortDesc: $form.find('input[name="lost[shortDesc]"]').val(),
				where: $form.find('input[name="lost[where]"]').val(),
				lostOn: $form.find('input[name="lost[lostOn]"]').val()
			};
		$.post('/api/lost', {lost:lost}, function(data){
			modal.modal('show');
			modal.find('.message').text(data.result == 'ok' ? "Hope we'll find it" : "Hum, something wrong just happened");
		});
		
	});
})();