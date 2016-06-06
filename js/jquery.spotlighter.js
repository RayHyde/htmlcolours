/* ----------------------------------------------------------------------
* File name:		jquery.spotlighter.js
* Description:	A jQuery plugin that highlights areas on a webpage and 
								adds explanations
* Website:			generic jQuery plugin
* Version:			0.9
* Date:					20-02-2016
* Author:				Ray Hyde - www.rayhyde.nl
---------------------------------------------------------------------- */

(function ($) {
	$.fn.spotlighter = function (options) {

		// default settings
		var settings = $.extend({
			json: false,
			json_file: '',
			default_spotlight_width: 150,
			showNumbers: true
		}, options);

		$(document).ready(function () {
			
			/*** INITAL VARS ***/
			
			var $tip, $tipText, $tipLink, elem, tipText, tipSize, tipAdjustX, tipAdjustY, qty, $text,
					counter = 1;
			
			/*** FUNCTIONS ***/

			function activateTip() {
				$tipLink = $('[data-splseq=' + counter + ']');
				tipSize = $tipLink.attr('data-splsize');
				tipAdjustX = parseInt($tipLink.attr('data-spladjustx'));
				tipAdjustY = parseInt($tipLink.attr('data-spladjusty'));
				if (tipSize == undefined) {
					tipSize = settings.default_spotlight_width;
				}
				
				if ( settings.showNumbers == true) {
					$tip.find('.spotlighter-seq').text(counter);
				}
				$tipText.html($tipLink.attr('data-spltext'));
					console.log('counter: ' + counter);
					console.log('data-spltext length: ' + $('[data-spltext]').length);
				if (counter == $('[data-spltext]').length) {
					$tip.find('.spotlighter-next').removeClass('active');
					$tip.find('.spotlighter-close').addClass('active');
				}
				if (counter > 1) {
					$tip.find('.spotlighter-prev').addClass('active');
				}
				positionTip($tipLink, tipSize, tipAdjustX,tipAdjustY);
				counter++
			}

			function positionTip($tipLink, tipSize, tipAdjustX,tipAdjustY) {
				var total = tipAdjustX + tipAdjustY;
				var offset = $tipLink.offset(),
					tipW = $tipLink.width(),
					tipH = $tipLink.height(),
//					posY = ((offset.top - $(document).scrollTop()) + (tipH / 2))+ tipAdjustY,
					posX = ((offset.left - $(document).scrollLeft()) + (tipW / 2)) + 0 + tipAdjustX,
						
					posY = offset.top  + tipAdjustY,
					size = parseInt(tipSize),
					marginAdjust = (size / 2) * -1,
					$text = $tip.find('.spotlighter-text'),
					th = $text.height();

				$('html, body').animate({
					scrollTop: posY - size
				}, 1200);

				$tip.find('.spotlight').css({
					left: posX,
					top: posY,
					marginLeft: marginAdjust,
					marginTop: marginAdjust,
					width: size,
					height: size,
				});

				// position the explanatory text
				var ww = parseInt($(document).width()),
						wh = $(document).height(),
						textWidth = $text.width(),
						textHeight = $text.height();

				// switch the explanatory text to the other side if past right window margin
				if ((posX + size + textWidth) <= ww) {
					posX = posX + (size / 2);
				} else {
					posX = posX - ((size / 2) + textWidth);
				}

				// here the text is set back at the top of the page when it is too high
				if (posY - (th / 2) < 0) {
					posY = 0;
				} else {
					posY = posY - (th / 2);
				}
				if ((posY + textHeight) > wh) {
					posY = wh - textHeight;
				}

				$text.css({
					left: posX,
					top: posY,
				});
			}
			
			function populateData() {
				$.getJSON('data/spotlighter-data.json', function(data) {
					qty = data.length;
					for ( var i=0;i< data.length;i++ ) {
						$(document).find(data[i].tipLink).attr({							
							'data-spltext': data[i].tipText,
							'data-splsize': data[i].tipSize,
							'data-splseq': 	data[i].tipSeq,
							'data-spladjustx': 	data[i].adjustX,
							'data-spladjusty': 	data[i].adjustY
						});
					}
					
				});
			}

			/*** DO AT START ***/
			// load json file if applicable
			if ( settings.json == true && settings.json_file != '' ) {
				populateData();
			}
			
			/*** EVENTS ***/
			
			$('.startspotlighter').click(function () {
				
				if ($('#spotlighter-tip').length == 0) {
					
					// add the spotlight's HTML
					$('body').append('<div id="spotlighter-tip"><div class="spotlighter-text"><div class="inner"><a class="spotlighter-seq top" href=""></a><a class="spotlighter-close top" href=""><span class="glyphicon glyphicon-remove"></span></a><div class="spotlighter-tip-text"></div><div class="spotlighter-actions"><a href="" class="spotlighter-prev"><span class="glyphicon glyphicon-menu-left"></span>Previous</a><a class="spotlighter-close" href="">Close <span class="glyphicon glyphicon-remove"></span></a><a class="spotlighter-next active" href="">Next <span class="glyphicon glyphicon-menu-right"></span></a></div></div></div><div class="spotlight"></div></div>');
					$tip = $('#spotlighter-tip');
					$tipText = $tip.find('.spotlighter-tip-text');
				}

				$tip.addClass('active');
				activateTip();
				return false;
			});

			$('body').on('click', '#spotlighter-tip .spotlighter-next', function () {
				activateTip();
				return false;
			});

			$('body').on('click', '#spotlighter-tip .spotlighter-prev', function () {
				$tip.find('.spotlighter-close').removeClass('active');
				$tip.find('.spotlighter-next').addClass('active');
				counter = counter - 2;
				activateTip();
				return false;
			});

			$('body').on('click', '.spotlighter-close', function () {
				$tip.removeClass('active').find('.spotlight').attr('style', '');
				$('.spotlighter-text').attr('style', '');
				$tip.find('.spotlighter-actions a').removeClass('active');
				$tip.find('.spotlighter-actions .spotlighter-next').addClass('active');
				counter = 1;
				return false;
			});

		});

	}
}(jQuery));