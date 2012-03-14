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
		addFieldButton = $('<button class="btn">Add a field</button>'),
		submitButton = addCategoryForm.find('button.submit');

	addCategoryForm.delegate(".removeField", "click", function(event){
		$(this).parent().remove();
	});

	addCategoryForm.find("button.submit").before(addFieldButton);

	addFieldButton.click(function(event) {
		event.preventDefault();
		var field = $('<label class="additionalField">Additional field<a class="btn btn-danger removeField"><i class="icon-remove icon-white"></i></a><input/></label>Ò');

		addFieldButton.before(field);		
	});

	addCategoryForm.submit(function(event){
		event.preventDefault();
		var $form = $(this),
			category = {
				label: $form.find('input.name').val(),
				fields: []
			},
			fieldsInput = $form.find('.additionalField input');

		$.each(fieldsInput, function(index, field) {
			category.fields.push($(field).val());
		});


		$.post($form.attr('action'), {category:category}, function(data){
			modal.modal('show');
			modal.find('.message').text(data.result == 'ok' ? "Category saved" : "Hum, something wrong just happened");
		});
		
	});
})();