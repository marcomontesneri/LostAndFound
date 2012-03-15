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

	var addCategoryForm = $('#addCategoryForm'),
		submitButton = addCategoryForm.find('button.submit');
		addCategoryForm.find('.fields').tagit({
			itemName: 'category',
			fieldName: 'fields',
			allowSpaces: true,
			placeHolder: 'Type the fields here...'
		});


	addCategoryForm.submit(function(event){
		event.preventDefault();
		var $form = $(this),
			category = {
				label: $form.find('input[name="label"]').val(),
				fields: $form.find('.fields').tagit("assignedTags")
			};


		$.post($form.attr('action'), {category:category}, function(data){
			modal.modal('show');
			modal.find('.message').text(data.result == 'ok' ? "Category saved" : "Hum, something wrong just happened");
		});
		
	});
})();