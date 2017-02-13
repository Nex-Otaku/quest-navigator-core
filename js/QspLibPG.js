/*
*  Bridge:
*           Javascript -> PhoneGap QSP Plugin
*
*/

var qspLibMode = "PHONEGAP";       // "AIR", "PHONEGAP" - устанавливаем для того, 
                                   // чтобы api.js мог выполнять различный код в зависимости от платформы


var QspLib = {
    
    registerJsCallback: function(callbackFunction, callbackName)
    {
        return QspBridge.registerJsCallback(callbackFunction, callbackName);
    },

    initLib: function(onInited) {
        return QspBridge.initLib(onInited);
    },
    
    restartGame: function() {
        return QspBridge.restartGame();
    },
    
    version: function(types, success, fail) {
        return QspBridge.version(types, success, fail);
    },

    executeAction: function(index) {
        return QspBridge.executeAction(index);
    },
    
    selectObject: function(index) {
        return QspBridge.selectObject(index);
    },
    
    loadGame: function() {
        return QspBridge.loadGame();
    },
    
    saveGame: function() {
        return QspBridge.saveGame();
    },
    
    saveSlotSelected: function(index, open) {
        return QspBridge.saveSlotSelected(index, open);
    },

    msgResult: function() {
        return QspBridge.msgResult();
    },
    
    errorResult: function() {
        return QspBridge.errorResult();
    },
    
    userMenuResult: function(index) {
        return QspBridge.userMenuResult(index);
    },
    
    inputResult: function(text) {
        return QspBridge.inputResult(text);
    },

    setMute: function(mute) {
        return QspBridge.setMute(mute);
    },
	
	// Для того, чтобы приложение на Андроиде не закрывать по кнопке BACK, а отправлять в фоновый режим
	moveTaskToBackground: function() {
        return QspBridge.moveTaskToBackground();
	}
};


//Функция для предзагрузки картинок (сейчас не используется)
jQuery.preloadImages = function () {
    if (typeof arguments[arguments.length - 1] == 'function') {
        var callback = arguments[arguments.length - 1];
    } else {
        var callback = false;
    }
    if (typeof arguments[0] == 'object') {
        var images = arguments[0];
        var n = images.length;
    } else {
        var images = arguments;
        var n = images.length - 1;
    }
    if (n == 0 && typeof callback == 'function') {
        callback();
        return;
    }
    var not_loaded = n;
    for (var i = 0; i < n; i++) {
    	$(images[i]).imagesLoaded().always(function() {
                                                        if (--not_loaded < 1 && typeof callback == 'function') {
                                                            callback();
                                                        }
                                                        });
    }
}

var qspInitLevel = 0;

function qspInitNext()
{
    setTimeout(function() {
        qspInitLevel++;
        if (qspInitLevel == 1)
            QspLib.initLib(qspInitNext);
        else if (qspInitLevel == 2)
            QspLib.registerJsCallback(qspSetGroupedContent,		"qspSetGroupedContent");    //QspLib4
        else if (qspInitLevel == 3)
            QspLib.registerJsCallback(qspMsg,					"qspMsg");                  //QspLib5
        else if (qspInitLevel == 4)
            QspLib.registerJsCallback(qspView,                	"qspView");                 //QspLib6
        else if (qspInitLevel == 5)
            QspLib.registerJsCallback(qspInput,               	"qspInput");                //QspLib7
        else if (qspInitLevel == 6)
            QspLib.registerJsCallback(qspMenu,                	"qspMenu");                 //QspLib8
        else if (qspInitLevel == 7)
            QspLib.registerJsCallback(qspError,               	"qspError");                //QspLib9
        else if (qspInitLevel == 8)
            QspLib.registerJsCallback(qspShowSaveSlotsDialog,	"qspShowSaveSlotsDialog");  //QspLib10
        else if (qspInitLevel == 9)
            QspLib.restartGame();
        else
        {
            // no more init
        }
    }, 0);
}

function onPhoneGapDeviceReady() {
    // Now safe to use the PhoneGap API
	qspIsAndroid = device.platform === "Android";
	qspIsIos = (device.platform === "iPhone") || (device.platform === "iPad");
	if (qspIsAndroid)
	{
		// Переопределяем поведение кнопки BACK
		document.addEventListener("backbutton", qspBackKeyPressed, false);
		// По кнопке MENU вызываем диалог системного меню
		document.addEventListener("menubutton", qspShowSystemMenu, false);
	}

	// Сообщаем API, что нам стал известен тип устройства.
	qspSetDevice();

	qspInitNext();
}

function qspLibOnInitApi() {
	document.addEventListener("deviceready", onPhoneGapDeviceReady, false);
}