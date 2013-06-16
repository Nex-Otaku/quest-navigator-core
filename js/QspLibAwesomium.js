/*
*  Bridge:
*           Javascript -> Awesomium QSP Plugin
*
*/

var qspLibMode = "AWESOMIUM";       // "AIR", "PHONEGAP", "AWESOMIUM" - устанавливаем для того, 
                                   // чтобы api.js мог выполнять различный код в зависимости от платформы


var QspLib = QspLibAwesomium;

var oldLib = {

/*    
    registerJsCallback: function(callbackFunction, callbackName)
    {
        return cordova.exec(callbackFunction, null, "QspLibAwesomium", "registerJsCallback", [callbackName]);
    },

    initLib: function(onInited) {
	
        return cordova.exec(onInited, null, "QspLibAwesomium", "initLib", []);
    },
  */  
    restartGame: function() {
        return cordova.exec(null, null, "QspLibAwesomium", "restartGame", []);
    },

/*    
    version: function(types, success, fail) {
      return cordova.exec(success, fail, "QspLibAwesomium", "version", types);
    },
*/
/*    
    selectAction: function(index) {
        return cordova.exec(null, null, "QspLibAwesomium", "selectAction", [index]);
    },*/

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
    },
	
	// Для того, чтобы приложение на Андроиде не закрывать по кнопке BACK, а отправлять в фоновый режим
	moveTaskToBackground: function() {
		return cordova.exec(null, null, "QspLibAwesomium", "moveTaskToBackground", []);
	}
};

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

function onWebDeviceReady() {
	qspIsDesktop = true;
	// Сообщаем API, что нам стал известен тип устройства.
	qspSetDevice();
	QspLib.alert('ready');
	//QspLib.SayHello();
	//alert('hello said');
	
	//qspInitNext();
}

function qspLibOnInitApi() {
alert('qspLibOnInitApi');
	setTimeout( function() { // Delay for Mozilla
			onWebDeviceReady();
	}, 10);
	alert('qspLibOnInitApi set');
}