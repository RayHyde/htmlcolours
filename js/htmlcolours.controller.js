(function() {
	
	var app = angular.module("HtmlColours", []);
	
	app.controller("ColoursCtrl", function ($scope, $http) {
		$http.get('data/htmlcolours.json').
		success(function (data, status, headers, config) {
			$scope.colours = data;
			

			
			var storedColours = localStorage['mylibrary'];
			$scope.filterLibrary = function (item) {
				if (storedColours.indexOf(item.hexvalue) > -1) {
					return true; // the ID is in the array
				} else {
					return false; // the ID is not in the array
				}
			}

			/* colour the page header */
			var $h1 = $('h1 .header-text');
			var h1 = $h1.text().split('');
			$h1.text('');
			var effe = []

			for ( var i=0;i< h1.length;i++ ) {		
				function addColour() {	
					var nr = 1 + Math.floor(Math.random() * h1.length);

					if ( effe.indexOf(data[nr].hexvalue) == -1) {
						$h1.append('<span data-color="' + data[nr].name + '" style="color: '+data[nr].hexvalue +'">'+ h1[i] + '</span>');
						effe.push(data[nr].hexvalue);
					} else {
						addColour();
					}
				}
				addColour();
			}

		}).
		error(function (data, status, headers, config) {
			// log error if needs be
		});

	});


	$(document).ready(function () {
		var mylibrary = [],
				$myLibrary = $('#mylibrary'),
				$results = $('.results');

		
		$('[type=radio]').on('click', function(){
			$(this).parent().find('[type=radio]').removeClass('active');
		})

		$results.add('#mixer').on('click', '.glyphicon', function () {

			var thisLi = $(this).closest('[class*=col-]');
			var thisValue = thisLi.attr('data-value');
			if (mylibrary.indexOf(thisValue) == -1) {

				thisLi.clone().removeAttr('ng-repeat').removeClass('ng-scope').prependTo('#mylibrary .listing');
				mylibrary.push(thisLi.attr('data-value'));
				localStorage['mylibrary'] = JSON.stringify(mylibrary);
			}
		});

		$('.order-input .btn').click(function() {
			$(this).addClass('btn-success').siblings('.btn').removeClass('btn-success');
			if ( $(this).hasClass('button-list') ) {
				$('.results').addClass('list');
			} else {			
				$('.results').removeClass('list');
			}
			return false;
		});

		$results.on('mouseover', '.glyphicon', function() {
			var tw = $(this).offset().left;
			var tt = $(this).offset().top;
			$('#add').css({
				left: tw -130,
				top: tt + 35,
				visibility: 'visible',
				opacity: 1
			});		
		}).on('mouseout', '.glyphicon', function() {
			$('#add').css({
				visibility: 'hidden',
				opacity: 0
			});
		});

		$myLibrary.on('mouseover', '.glyphicon', function() {
			var tw = $(this).offset().left;
			var tt = $(this).offset().top;
			$('#remove').css({
				left: tw -200,
				top: tt + 35,
				visibility: 'visible',
				opacity: 1
			});		
		}).on('mouseout', '.glyphicon', function() {
			$('#remove').css({
				visibility: 'hidden',
				opacity: 0
			});
		});

		$myLibrary.on('click', '.glyphicon', function () {
			var thisLi = $(this).closest('[class*=col-]');
			var removeItem = thisLi.attr('data-value');
			mylibrary = jQuery.grep(mylibrary, function (value) {
				return value != removeItem;
			});

			localStorage['mylibrary'] = JSON.stringify(mylibrary);
			thisLi.fadeOut(1000, function () {
				thisLi.remove();
			});
		});

		$('.last .glyphicon').click(function() {
			$('html, body').animate({ scrollTop: 0 }, 'slow');
		});

		$(window).scroll(function(){

			if ( $(this).scrollTop() > $(window).height() ){
				$('.last .glyphicon').fadeIn(500);
			} else {
				$('.last .glyphicon').fadeOut(500);
			}
		});

		$('.header-text').on('mouseover', 'span', function() {

			var tw = $(this).offset().left;
			var tt = $(this).offset().top;
			$('#color-number').text($(this).attr('data-color'));
			$('#color-number').css({
				left: tw -30,
				top: tt + 77,
				visibility: 'visible',
				opacity: 1
			});		
		}).on('mouseout', 'span', function() {
			$('#color-number').css({
				visibility: 'hidden',
				opacity: 0
			});
		});

	});
})();