/**

	jQuery Retina plugin - adds support for retina images, presented by IMG tag

	Author: Troy Mcilvena (http://troymcilvena.com)
	Twitter: @mcilvena
	Date: 24 November 2011
	Version: 1.3
	
	Revision History:
		1.0 (23/08/2010)	- Initial release.
		1.1 (27/08/2010)	- Made plugin chainable
		1.2 (10/11/2010)	- Fixed broken retina_part setting. Wrapped in self executing function (closure)
		1.3 (29/10/2011)	- Checked if source has already been updated (via mattbilson)
		
		
	Rewritten by Nex 
	http://nex-otaku-en.blogspot.com
	nex@otaku.ru
	18 November 2012
*/

(function( $ ){
	$.fn.retina = function(retina_part) {
		// Set default retina file part to '-2x'
		// Eg. some_image.jpg will become some_image-2x.jpg
		var settings = {'retina_part': '-2x'};
		if(retina_part) jQuery.extend(settings, { 'retina_part': retina_part });

		
		this.each(function(index, element) {
			if (!$(element).attr('src')) return;
			
			// Проверка, что мы уже обработали этот IMG
			if ($(element).parent().hasClass('retina-img-wrapper'))
				return;
			
			var img = $(element);
			var new_image_src = img.attr('src').replace(/(.+)(\.\w{3,4})$/, "$1"+ settings['retina_part'] +"$2");
			// Оборачиваем IMG в DIV
			img.wrap('<div class="retina-img-wrapper"></div>');
			var parentDiv = img.parent();
			// Копируем стили из IMG в DIV
			var propList = ['float', 
							'margin-top', 'margin-bottom', 'margin-right', 'margin-left', 
							'border-top', 'border-bottom', 'border-right', 'border-left', 
							'padding-top', 'padding-bottom', 'padding-right', 'padding-left', 
							'background-color'];
			var imgProp = {};
			var name;
			for(var i = 0, l = propList.length; i < l; i++){
				name = propList[i];
				imgProp[name] = img.css(name);
			}
			parentDiv.css(imgProp);
			// Настраиваем стили DIV и IMG, чтобы DIV был точно по размеру IMG
			parentDiv.css({	'display':'inline-block', 
							'background-image':'url("'+new_image_src+'")',
							'background-size':'100% 100%'});
			img.css({'display':'block', 'margin':'0', 'padding':'0', 'border':'none'});
		});
		return this;
	}
})( jQuery );

(function( $ ){
	$.fn.updateSrcRetina = function(path) {
		// Обновляем картинку внешнего блока, для поддержки Retina-дисплеев
		if (qspScreenHD)
		{
			var p = this.parent();
			if (p.hasClass('retina-img-wrapper'))
				p.css('background-image', 'url("'+qspMakeRetinaPath(path)+'")');
		}
		return;
	}
})( jQuery );