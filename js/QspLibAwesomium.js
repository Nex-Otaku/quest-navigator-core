/*
*  Bridge:
*           Javascript -> Awesomium QSP Plugin
*
*/

var qspLibMode = "AWESOMIUM";       // "AIR", "PHONEGAP", "AWESOMIUM" - устанавливаем для того, 
                                   // чтобы api.js мог выполнять различный код в зависимости от платформы


var QspLib = QspLibAwesomium;

var oldLib = {
    restartGame: function() {
        return cordova.exec(null, null, "QspLibAwesomium", "restartGame", []);
    },

    executeAction: function(index) {
        return cordova.exec(null, null, "QspLibAwesomium", "executeAction", [index]);
    },
    
    selectObject: function(index) {
        return cordova.exec(null, null, "QspLibAwesomium", "selectObject", [index]);
    },
    
    loadGame: function() {
        return cordova.exec(null, null, "QspLibAwesomium", "loadGame", []);
    },
    
    saveGame: function() {
        return cordova.exec(null, null, "QspLibAwesomium", "saveGame", []);
    },
    
    saveSlotSelected: function(index, open) {
        var mode = open ? 1 : 0;
        return cordova.exec(null, null, "QspLibAwesomium", "saveSlotSelected", [index, mode]);
    },

    msgResult: function() {
        return cordova.exec(null, null, "QspLibAwesomium", "msgResult", []);
    },
    
    errorResult: function() {
        return cordova.exec(null, null, "QspLibAwesomium", "errorResult", []);
    },
    
    userMenuResult: function(index) {
        return cordova.exec(null, null, "QspLibAwesomium", "userMenuResult", [index]);
    },
    
    inputResult: function(text) {
        return cordova.exec(null, null, "QspLibAwesomium", "inputResult", [text]);
    },

    setMute: function(mute) {
        return cordova.exec(null, null, "QspLibAwesomium", "setMute", [mute]);
    }
};


function onWebDeviceReady() {
	// Самодельный диалог alert, 
	// так как в Awesomium стандартные диалоги не работают.
	// Короткий вариант будет работать только после полной инициализации.
	// До этого, вызываем напрямую через QspLib.
	window.alert = function(text) { QspLib.alert(text) };

	qspIsDesktop = true;
	// Сообщаем API, что нам стал известен тип устройства.
	qspSetDevice();
	QspLib.restartGame();
}

function debug(str) {
	$(document.body).append(str);
}

function qspLibOnInitApi() {
	setTimeout( function() { // Delay for Mozilla
			onWebDeviceReady();
	}, 10);
}