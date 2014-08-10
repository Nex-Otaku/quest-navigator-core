/*
*  Bridge:
*           Javascript -> Awesomium QSP Plugin
*
*/

var qspLibMode = "AWESOMIUM";       // "AIR", "PHONEGAP", "AWESOMIUM" - устанавливаем для того, 
                                   // чтобы api.js мог выполнять различный код в зависимости от платформы


var QspLib = QspLibAwesomium;

function onWebDeviceReady() {
	// Самодельный диалог alert, 
	// так как в Awesomium стандартные диалоги не работают.
	// Короткий вариант будет работать только после полной инициализации.
	// До этого, вызываем напрямую через QspLib.
	window.alert = function(text) { QspLib.alert(text) };

	qspIsDesktop = true;
	// Сообщаем API, что нам стал известен тип устройства.
	qspSetDevice();
}

function debug(str) {
	$(document.body).append(str);
}

function qspLibOnInitApi() {
	setTimeout( function() { // Delay for Mozilla
		onWebDeviceReady();
	}, 10);
}

/* Запуск API при загрузке страницы */
$(document).ready(function(){
		qspInitApi();
    });
