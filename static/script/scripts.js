(function(){
	$('.datepicker').datepicker();

	var modal = $('#lossModal');

	modal.modal({
		show: false
	});

	$('#declareLossForm').submit(function(event){
		event.preventDefault();
		var $form = $(this),
			lost = {
				shortDesc: $form.find('input[name="lost[shortDesc]"]').val(),
				where: $form.find('input[name="lost[where]"]').val(),
				lostOn: $form.find('input[name="lost[lostOn]"]').val()
			};
		$.post($form.attr('action'), {lost:lost}, function(data){
			modal.modal('show');
			modal.find('.message').text(data.result == 'ok' ? "Hope we'll find it" : "Hum, something wrong just happened");
		});
		
	});

	$('#addCategoryForm').submit(function(event){
		event.preventDefault();
		var $form = $(this),
			category = {
				label: $form.find('input.name').val(),
				fields: []
			},
			fieldsInput = $form.find('input.additionalField');

		$.each(fieldsInput, function(index, field) {
			category.fields.push($(field).val());
		});


		$.post($form.attr('action'), {category:category}, function(data){
			modal.modal('show');
			modal.find('.message').text(data.result == 'ok' ? "Category saved" : "Hum, something wrong just happened");
		});
		
	});
})();