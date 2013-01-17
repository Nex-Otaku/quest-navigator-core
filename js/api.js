var qsp_iScroll_main = null;
var qsp_iScroll_acts = null;
var qsp_iScroll_vars = null;
var qsp_iScroll_objs = null;
var qsp_iScroll_msg = null;

var qspDialogOpened = true;
var qspCurDialog = "";
var qspUiBlocked = true;
var qspSaveSlotsModeOpen = true;
var qspGameSkin = null;
var qspMainContent = null;
var qspMainViewWasScrolled = false;
var qspSelectedObjectIndex = -1;
var qspInvObjs = null;
var qspSplashHidden = false;
var qspPreloadingImageArray = [];
var qspIsAndroid = false;
var qspIsIos = false;
var qspScreenHD = false;

var qspHandlerViewClick = function() { qspCloseView(); };
var qspHandlerSystemMenuOverlayClick = function() { qspCloseSystemMenu(); };
var qspHandlerSaveSlotsOverlayClick = function() { qspCloseSaveSlots(-1); };

var qspLastPressedButton = null;

var qspMouseX = 0;
var qspMouseY = 0;

function qspInitApi() {
	qspInitScrolls();

	qspDialogOpened = false;
	qspCurDialog = "";
	qspUiBlocked = false;
	qspMainViewWasScrolled = false;
	qspSetDialogs();
	
	$(document.body).prepend('<div id="qsp-js-sandbox" style="display:none;"></div>');

    $(document).bind("mousedown touchstart MozTouchDown", function(e) {
              // Небольшой трюк, чтобы словить событие не только от мыши, но и от нажатия тачскрина
              var ev = e;
              if (e.originalEvent.touches && e.originalEvent.touches.length) {
                    ev = e.originalEvent.touches[0];
              } else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
                    ev = e.originalEvent.changedTouches[0];
              }
              qspMouseX = ev.pageX;
              qspMouseY = ev.pageY;
          });

	qspSetPressableButtons();
		  
	$(document).bind("contextmenu", function(e) {
		return false;
	});

    // Переменная должна устанавливаться в подключаемом файле - QspLibPG.js, QspLibAIR.js
    if (typeof(qspLibMode) === "undefined")
        alert("Не подключена библиотека QspLibXXX.js!");
    
    //PG
    if (qspLibMode === "PHONEGAP")
	{
        document.addEventListener("deviceready", onPhoneGapDeviceReady, false);
	}
	else
	{
		// Вызывается, когда мы узнали, на каком устройстве запущена игра
		if (typeof(qspSkinOnDeviceSet) === 'function')
			qspSkinOnDeviceSet();
	}
		
	// Fallback to JQuery "animate" if no CSS3 transition support
	if (!$.support.transition)
		$.fn.transition = $.fn.animate;
		
	qspDetectScreenHD();

	// Skin callback
	if (typeof(qspSkinOnInitApi) === 'function')
		qspSkinOnInitApi();
}

function qspInitScrolls() {
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	if ($('#qsp-scroller-main').length)
		qsp_iScroll_main = new iScroll("qsp-wrapper-main", {hScroll:false, bounce:false, hScrollbar:false, hideScrollbar:false, fadeScrollbar:false});
	if ($('#qsp-scroller-acts').length)
		qsp_iScroll_acts = new iScroll("qsp-wrapper-acts", {hScroll:false, bounce:false, hScrollbar:false, hideScrollbar:false, fadeScrollbar:false});
	if ($('#qsp-scroller-vars').length)
		qsp_iScroll_vars = new iScroll("qsp-wrapper-vars", {hScroll:false, bounce:false, hScrollbar:false, hideScrollbar:false, fadeScrollbar:false});
	if ($('#qsp-scroller-objs').length)
		qsp_iScroll_objs = new iScroll("qsp-wrapper-objs", {hScroll:false, bounce:false, hScrollbar:false, hideScrollbar:false, fadeScrollbar:false});
	if ($('#qsp-scroller-msg').length)
		qsp_iScroll_msg = new iScroll("qsp-wrapper-msg", {hScroll:false, bounce:false, hScrollbar:false, hideScrollbar:false, fadeScrollbar:false});
}

function qspApplyScrollsVisibility()
{
    var clear = !qspDialogOpened && 
				(qspGameSkin.hideScrollAny != 1) && (qspGameSkin.hideScrollArrows != 1);
    var mainScrollVisible = clear && (qspGameSkin.hideScrollMain != 1);
    var actsScrollVisible = clear && (qspGameSkin.showActs == 1) && (qspGameSkin.hideScrollActs != 1);
    var varsScrollVisible = clear && (qspGameSkin.showVars == 1) && (qspGameSkin.hideScrollVars != 1);
    var objsScrollVisible = clear && (qspGameSkin.showObjs == 1) && (qspGameSkin.hideScrollObjs != 1);
	if ((qsp_iScroll_main != null) && ("vScrollbarIndicator" in qsp_iScroll_main) && (qsp_iScroll_main.vScrollbarIndicator != null))
		qsp_iScroll_main.vScrollbarIndicator.style.visibility = mainScrollVisible ? 'visible' : 'hidden';
	if ((qsp_iScroll_acts != null) && ("vScrollbarIndicator" in qsp_iScroll_acts) && (qsp_iScroll_acts.vScrollbarIndicator != null))
		qsp_iScroll_acts.vScrollbarIndicator.style.visibility = actsScrollVisible ? 'visible' : 'hidden';
	if ((qsp_iScroll_vars != null) && ("vScrollbarIndicator" in qsp_iScroll_vars) && (qsp_iScroll_vars.vScrollbarIndicator != null))
		qsp_iScroll_vars.vScrollbarIndicator.style.visibility = varsScrollVisible ? 'visible' : 'hidden';
	if ((qsp_iScroll_objs != null) && ("vScrollbarIndicator" in qsp_iScroll_objs) && (qsp_iScroll_objs.vScrollbarIndicator != null))
		qsp_iScroll_objs.vScrollbarIndicator.style.visibility = objsScrollVisible ? 'visible' : 'hidden';

	// Это хак для Андроида. Без перезаполнения основного описания, 
	// возникают странные глюки после отображения qsp-skin-overlay (т.е. при показе любого диалога)
	if (qspMainContent != null)
		qspSetMainContent(qspMainContent, false);
	
	qspLoadRetinaImages('img');
}

function qspShowSystemMenu()
{
	if (qspDialogOpened)
		return;
	qspDialogOpened = true;
	qspCurDialog = 'system-menu';
	$("#qsp-dialog-system-menu").show();
    qspApplyScrollsVisibility();
	//Закрываем при клике вне диалога
	setTimeout( function() { // Delay for Mozilla
			$(".qsp-skin-overlay").bind('click', qspHandlerSystemMenuOverlayClick);
	}, 0);
} 

 
// Вызовы Native -> JS

function qspSetGroupedContent(content) 
{
    // parameter type: JSON Object
    
    // Единый вызов для установки всех атрибутов интерфейса,
    // включая скин и содержимое всех окошек.
    if (typeof(content.skin) !== 'undefined')
        qspUpdateSkin(content.skin);
    if (typeof(content.main) !== 'undefined')
        qspSetMainContent(content.main, true);
    if (typeof(content.acts) !== 'undefined')
        qspSetActsContent(content.acts);
    if (typeof(content.vars) !== 'undefined')
        qspSetVarsContent(content.vars);
    if (typeof(content.objs) !== 'undefined')
        qspSetInvContent(content.objs);
    if (typeof(content.js) !== 'undefined')
        qspExecJS(content.js);
    qspApplyScrollsVisibility();
	
	if (typeof(qspSkinOnSetGroupedContent) === 'function')
		qspSkinOnSetGroupedContent();
	
    if (!qspSplashHidden && (qspLibMode === "PHONEGAP"))
    {
		qspSplashHidden = true;
		setTimeout( function() {
				   cordova.exec(null, null, "SplashScreen", "hide", []);
				   }, 500);
    }
}

function qspSetMainContent(content, initial) 
{
	if (initial)
	{
		qspMainViewWasScrolled = false;
		qspMainContent = content;
	}
	
	$("#qsp-main").empty();
    content = qspApplyTemplateForText(qspGameSkin.mainDescTextFormat, content);
    $("#qsp-main").append(content);
	$("#qsp-main").imagesLoaded().always(qspRefreshMainScroll);
} 

function qspRefreshMainScroll()
{
	if (qsp_iScroll_main != null)
		setTimeout(function () {
            // Skin callback
            if (typeof(qspSkinOnMainScrollRefresh) == 'function')
                qspSkinOnMainScrollRefresh();
			qsp_iScroll_main.refresh();
			if ((qspGameSkin != null) && (qspGameSkin.disableScroll == 0) && !qspMainViewWasScrolled)
            {
				qspMainViewWasScrolled = true;
				qsp_iScroll_main.scrollTo(0, 0, 0, false);
            }
            // Skin callback
            if (typeof(qspSkinOnMainScrollRefreshed) == 'function')
                qspSkinOnMainScrollRefreshed();
		}, 0);
}

function qspSetVarsContent(content) 
{
    var content_vars = qspApplyTemplateForText(qspGameSkin.varsDescTextFormat, content);
	$("#qsp-vars").empty();
	$("#qsp-vars").append(content_vars);
	$("#qsp-vars").imagesLoaded().always(qspRefreshVarsScroll);
} 

function qspRefreshVarsScroll()
{
	if (qsp_iScroll_vars != null)
		setTimeout(function () {
            // Skin callback
            if (typeof(qspSkinOnVarsScrollRefresh) == 'function')
                qspSkinOnVarsScrollRefresh();
			qsp_iScroll_vars.refresh();
			if ((qspGameSkin != null) && (qspGameSkin.disableScroll == 0))
				qsp_iScroll_vars.scrollTo(0, 0, 0, false);
            // Skin callback
            if (typeof(qspSkinOnVarsScrollRefreshed) == 'function')
                qspSkinOnVarsScrollRefreshed();
		}, 0);
}

function qspSetActsContent(acts, under_desc) 
{
	var actsId = qspGameSkin.mainDescIntegratedActions == 1 ? "#qsp-acts1" : "#qsp-acts2";
	$(actsId).empty();
	if (acts)
	{
        for (i = 0; i < acts.length; i++) {
			//Для мобильной версии отключим, иначе слишком тормозит
			/*   " onmouseover='javascript:qspSelectAction(\"" + i + "\");' " + */
			$(actsId).append("<div class='qsp-action qsp-skin-button'><a " + 
			" onclick='javascript:qspExecuteAction(\"" + i + "\");'>" + 
                                  qspApplyTemplateForTextAndImage(qspGameSkin.actsListItemFormat, acts[i].desc, acts[i].image) + 
                                  "</a></div>");
		}
	}

	if (qspGameSkin.mainDescIntegratedActions == 1)
		$("#qsp-acts1").imagesLoaded().always(qspRefreshMainScroll);
	else
		$("#qsp-acts2").imagesLoaded().always(qspRefreshActsScroll);
} 

function qspRefreshActsScroll()
{
	if (qsp_iScroll_acts != null)
		setTimeout(function () {
            // Skin callback
            if (typeof(qspSkinOnActsScrollRefresh) == 'function')
                qspSkinOnActsScrollRefresh();
			qsp_iScroll_acts.refresh();
			if ((qspGameSkin != null) && (qspGameSkin.disableScroll == 0))
				qsp_iScroll_acts.scrollTo(0, 0, 0, false);
            // Skin callback
            if (typeof(qspSkinOnActsScrollRefreshed) == 'function')
                qspSkinOnActsScrollRefreshed();
		}, 0);
}

function qspSetInvContent(objs) 
{
    qspSelectedObjectIndex = -1;
    qspInvObjs = objs;
	if (objs)
	{
		for (i = 0; i < objs.length; i++) {
            if (objs[i].selected == 1)
                qspSelectedObjectIndex = i;
		}
        qspFillInvWithObjs();
	}
	$("#qsp-inv").imagesLoaded().always(qspRefreshObjsScroll);
}

function qspRefreshObjsScroll()
{
	if (qsp_iScroll_objs != null)
		setTimeout(function () {
            // Skin callback
            if (typeof(qspSkinOnObjsScrollRefresh) == 'function')
                qspSkinOnObjsScrollRefresh();
			qsp_iScroll_objs.refresh();
            // Skin callback
            if (typeof(qspSkinOnObjsScrollRefreshed) == 'function')
                qspSkinOnObjsScrollRefreshed();
		}, 0);
}

function qspFillInvWithObjs()
{
	$("#qsp-inv").empty();
	if (qspInvObjs)
	{
		for (i = 0; i < qspInvObjs.length; i++) {
            var selected = i == qspSelectedObjectIndex;
			//пока не сделано, но сделать обязательно
			/*   " onmouseover='javascript:qspSelectAction(\"" + i + "\");' " + */
			$("#qsp-inv").append("<div class='qsp-object'>" +
                                 (selected ? "" : ("<a style=\"cursor: pointer;\" onclick='javascript:qspSelectObject(\"" + i + "\");'>")) +
                                 qspApplyTemplateForTextAndImage(selected ? qspGameSkin.objsListSelItemFormat : qspGameSkin.objsListItemFormat, 
                                                              qspInvObjs[i].desc, qspInvObjs[i].image) + 
                                 (selected ? "" : "</a>") +
                                 "</div>");
		}
		qspLoadRetinaImages('#qsp-inv img');
	}
	// Skin callback
	if (typeof(qspSkinOnFillInvWithObjs) == 'function')
		qspSkinOnFillInvWithObjs();
}

function qspExecJS(cmd) 
{
	// Выполняем яваскрипт, переданный из игры командой EXEC('JS:...')
	cmd = '<script>' + cmd + '</script>';
	$('#qsp-js-sandbox').html(cmd);
}

function qspUpdateSkin(skin)
{
	//Устанавливаем переменные оформления
	qspGameSkin = skin;
	/*
	jsSkin.useHtml = useHtml;
	jsSkin.disableScroll = disableScroll;
	jsSkin.upArrowImagePath = upArrowImagePath;
	jsSkin.downArrowImagePath = downArrowImagePath;
	jsSkin.mainBackImagePath = mainBackImagePath;
	jsSkin.mainTopImagePath = mainTopImagePath;
    jsSkin.sysMenuButtonImagePath = sysMenuButtonImagePath;
    jsSkin.sysMenuButtonX = sysMenuButtonX;
    jsSkin.sysMenuButtonY = sysMenuButtonY;
	jsSkin.backColor = backColor;
	jsSkin.linkColor = linkColor;
	jsSkin.fontColor = fontColor;
	jsSkin.fontName = fontName;
	jsSkin.fontSize = fontSize;
	jsSkin.styleSheet = styleSheet;
	jsSkin.disableShade = disableShade;
	jsSkin.scrollSpeed = scrollSpeed;
	jsSkin.hideScrollArrows = hideScrollArrows;
	jsSkin.disableAutoRef = disableAutoRef;
	*/

	if (!$("#qsp-back-image").hasClass("protected"))
	{
		$("#qsp-back-image").empty();
		if (qspGameSkin.mainBackImagePath.length > 0)
		{
			$("#qsp-back-image").append("<img src=\"" + qspGameSkin.mainBackImagePath + "\" >");
		}
	}
		
	/* Непонятно, как эту штуку делать
	$("#qsp-top-image").empty();
	if (qspGameSkin.mainTopImagePath.length > 0)
		$("#qsp-top-image").append("<img src=\"" + qspGameSkin.mainTopImagePath + "\">");
	*/

	if (!$("#qsp-system-menu-button").hasClass("protected"))
	{
		if (qspGameSkin.sysMenuButtonImagePath.length > 0)
		{
			$('#qsp-system-menu-button').empty();
			$("#qsp-system-menu-button").append("<a onclick=\"javascript:qspShowSystemMenu();\" style=\"cursor: pointer;\">" +
												"<img src=\"" + qspGameSkin.sysMenuButtonImagePath + "\">" +
												"</a>");
			$("#qsp-system-menu-button").css("left", qspGameSkin.sysMenuButtonX).css("top", qspGameSkin.sysMenuButtonY);
			$('#qsp-system-menu-button').show();
		}
		else
		{
			$('#qsp-system-menu-button').hide();
		}
	}
    
	$(document.body).css("backgroundColor", qspGameSkin.backColor);

	//$(document.body).attr("bgcolor", qspGameSkin.backColor); - можно и так
	$(".qsp-skin-dialog").css("backgroundColor", qspGameSkin.backColor);
	$(".qsp-skin-dialog").css("border-width", qspGameSkin.menuBorder).css("border-color", qspGameSkin.menuBorderColor).css("border-style", "solid");
	
	$(document.body).attr("link", qspGameSkin.linkColor);
	
	//$(document.body).attr("text", qspGameSkin.fontColor);
	$(document.body).css("color", qspGameSkin.fontColor);
	
	$(document.body).css("font-family", qspGameSkin.fontName);
	
	$(document.body).css("font-size", qspGameSkin.fontSize);
    

	
	/*
	// ----------------------
	jsSkin.newLocEffect = newLocEffect;
	jsSkin.newLocEffectTime = newLocEffectTime;
	jsSkin.newLocEffectSeq = newLocEffectSeq;
	jsSkin.viewEffect = viewEffect;
	jsSkin.viewEffectTime = viewEffectTime;
	jsSkin.inputEffect = inputEffect;
	jsSkin.inputEffectTime = inputEffectTime;
	jsSkin.msgEffect = msgEffect;
	jsSkin.msgEffectTime = msgEffectTime;
	jsSkin.menuEffect = menuEffect;
	jsSkin.menuEffectTime = menuEffectTime;
	// ----------------------
	jsSkin.mainDescTextFormat = mainDescTextFormat;
	jsSkin.mainDescIntegratedActions = mainDescIntegratedActions;
	jsSkin.mainDescBackImagePath = mainDescBackImagePath;
	jsSkin.mainDescX = mainDescX;
	jsSkin.mainDescY = mainDescY;
	jsSkin.mainDescW = mainDescW;
	jsSkin.mainDescH = mainDescH;
	*/

	if (!$("#qsp-wrapper-main").hasClass("protected"))
	{
		$("#qsp-wrapper-main").css("left", qspGameSkin.mainDescX).css("top", qspGameSkin.mainDescY)
			.css("width", qspGameSkin.mainDescW).css("height", qspGameSkin.mainDescH).css("background-image", "url(" + qspGameSkin.mainDescBackImagePath + ")");
	}
			
	/*
	// ----------------------
	jsSkin.varsDescTextFormat = varsDescTextFormat;
	jsSkin.varsDescBackImagePath = varsDescBackImagePath;
	jsSkin.varsDescX = varsDescX;
	jsSkin.varsDescY = varsDescY;
	jsSkin.varsDescW = varsDescW;
	jsSkin.varsDescH = varsDescH;
	*/

	if (!$("#qsp-wrapper-vars").hasClass("protected"))
	{
		$("#qsp-wrapper-vars").css("left", qspGameSkin.varsDescX).css("top", qspGameSkin.varsDescY)
			.css("width", qspGameSkin.varsDescW).css("height", qspGameSkin.varsDescH).css("background-image", "url(" + qspGameSkin.varsDescBackImagePath + ")");
	}

	/*
	// ----------------------
	jsSkin.actsListItemFormat = actsListItemFormat;
	jsSkin.actsListSelItemFormat = actsListSelItemFormat;
	jsSkin.actsListBackImagePath = actsListBackImagePath;
	jsSkin.actsListX = actsListX;
	jsSkin.actsListY = actsListY;
	jsSkin.actsListW = actsListW;
	jsSkin.actsListH = actsListH;
	*/

	if (!$("#qsp-wrapper-acts").hasClass("protected"))
	{
		//Само собой, менять позицию этого дива мы можем только если действия расположены отдельно от основного окна описания
		$("#qsp-wrapper-acts").css("left", qspGameSkin.actsListX).css("top", qspGameSkin.actsListY)
			.css("width", qspGameSkin.actsListW).css("height", qspGameSkin.actsListH).css("background-image", "url(" + qspGameSkin.actsListBackImagePath + ")");
	}

	/*
	// ----------------------
	jsSkin.objsListItemFormat = objsListItemFormat;
	jsSkin.objsListSelItemFormat = objsListSelItemFormat;
	jsSkin.objsListBackImagePath = objsListBackImagePath;
	jsSkin.objsListX = objsListX;
	jsSkin.objsListY = objsListY;
	jsSkin.objsListW = objsListW;
	jsSkin.objsListH = objsListH;
	*/

	if (!$("#qsp-wrapper-objs").hasClass("protected"))
	{
		$("#qsp-wrapper-objs").css("left", qspGameSkin.objsListX).css("top", qspGameSkin.objsListY)
			.css("width", qspGameSkin.objsListW).css("height", qspGameSkin.objsListH).css("background-image", "url(" + qspGameSkin.objsListBackImagePath + ")");
	}
			
	/*
	// ----------------------
	jsSkin.viewAlwaysShow = viewAlwaysShow;
	jsSkin.viewX = viewX;
	jsSkin.viewY = viewY;
	jsSkin.viewW = viewW;
	jsSkin.viewH = viewH;
	*/

	if (!$("#qsp-dialog-view").hasClass("protected"))
	{
		$("#qsp-dialog-view-image-container").css("left", qspGameSkin.viewX).css("top", qspGameSkin.viewY)
			.css("width", qspGameSkin.viewW).css("height", qspGameSkin.viewH);
	}
	// Если выставлен флаг viewAlwaysShow, то мы не рисуем оверлей
	if (qspGameSkin.viewAlwaysShow == 1)
		$("#qsp-dialog-view .qsp-skin-overlay").hide();
	else
		$("#qsp-dialog-view .qsp-skin-overlay").show();
		
	/*
	строка ввода
	// ----------------------
	jsSkin.userInputX = userInputX;
	jsSkin.userInputY = userInputY;
	jsSkin.userInputW = userInputW;
	jsSkin.userInputH = userInputH;
	*/

	//$("#qsp-input-line").css("left", qspGameSkin.userInputX).css("top", qspGameSkin.userInputY)
	//	.css("width", qspGameSkin.userInputW).css("height", qspGameSkin.userInputH);
	
	/*
	// ----------------------
	jsSkin.inputBackImagePath = inputBackImagePath;
	jsSkin.inputX = inputX;
	jsSkin.inputY = inputY;
	jsSkin.inputTextFormat = inputTextFormat;
	jsSkin.inputTextX = inputTextX;
	jsSkin.inputTextY = inputTextY;
	jsSkin.inputTextW = inputTextW;
	jsSkin.inputTextH = inputTextH;
	jsSkin.inputBarX = inputBarX;
	jsSkin.inputBarY = inputBarY;
	jsSkin.inputBarW = inputBarW;
	jsSkin.inputBarH = inputBarH;
	jsSkin.inputOkImagePath = inputOkImagePath;
	jsSkin.inputOkX = inputOkX;
	jsSkin.inputOkY = inputOkY;
	jsSkin.inputCancelImagePath = inputCancelImagePath;
	jsSkin.inputCancelX = inputCancelX;
	jsSkin.inputCancelY = inputCancelY;
	*/
	// Если задан класс "protected", значит внешний вид диалога полностью определяется кастомным CSS
	// Иначе мы задаем фиксированные координаты из игры
	if (!$("#qsp-dialog-input").hasClass("protected"))
	{
		// Cancel не рисуем
		$("#qsp-dialog-input-background").empty();
		if (qspGameSkin.inputBackImagePath.length > 0)
		{
			$("#qsp-dialog-input-background").append("<img src=\"" + qspGameSkin.inputBackImagePath + "\">");
		}
		
		$("#qsp-dialog-input-background").css("left", qspGameSkin.inputX).css("top", qspGameSkin.inputY);
		//Приглашение
		$("#qsp-dialog-input-content").css("left", qspGameSkin.inputX + qspGameSkin.inputTextX)
									.css("top", qspGameSkin.inputY + qspGameSkin.inputTextY)
									.css("width", qspGameSkin.inputTextW).css("height", qspGameSkin.inputTextH);
		//Поле ввода
		$("#qsp-dialog-input-text").css("left", qspGameSkin.inputX + qspGameSkin.inputBarX)
									.css("top", qspGameSkin.inputY + qspGameSkin.inputBarY)
									.css("width", qspGameSkin.inputBarW).css("height", qspGameSkin.inputBarH);
		if (qspGameSkin.inputOkImagePath.length > 0)
		{
			$("#qsp-button-input-ok").empty();
			$("#qsp-button-input-ok").append("<img src=\"" + qspGameSkin.inputOkImagePath + "\">");
		}
		$("#qsp-button-input-ok").css("left", qspGameSkin.inputX + qspGameSkin.inputOkX).css("top", qspGameSkin.inputY + qspGameSkin.inputOkY);
	}
	
	/*
	// ----------------------
	jsSkin.menuFixedSize = menuFixedSize;
	jsSkin.menuBorder = menuBorder;
	jsSkin.menuBorderColor = menuBorderColor;
	jsSkin.menuPadding = menuPadding;
	jsSkin.menuBackImagePath = menuBackImagePath;
	jsSkin.menuX = menuX;
	jsSkin.menuY = menuY;
	jsSkin.menuListItemFormat = menuListItemFormat;
	jsSkin.menuListSelItemFormat = menuListSelItemFormat;
	jsSkin.menuListX = menuListX;
	jsSkin.menuListY = menuListY;
	jsSkin.menuListW = menuListW;
	jsSkin.menuListH = menuListH;
	*/
	
	if (!$("#qsp-dialog-user-menu").hasClass("protected"))
	{
		$("#qsp-dialog-user-menu").css("width", qspGameSkin.menuListW).css("padding", qspGameSkin.menuPadding)
			.css("border-width", qspGameSkin.menuBorder).css("border-color", qspGameSkin.menuBorderColor).css("border-style", "solid")
			.css("width", qspGameSkin.menuListW).css("backgroundColor", qspGameSkin.backColor);
	}
	
	/*
	// ----------------------
	jsSkin.msgBackImagePath = msgBackImagePath;
	jsSkin.msgX = msgX;
	jsSkin.msgY = msgY;
	jsSkin.msgTextFormat = msgTextFormat;
	jsSkin.msgTextX = msgTextX;
	jsSkin.msgTextY = msgTextY;
	jsSkin.msgTextW = msgTextW;
	jsSkin.msgTextH = msgTextH;
	jsSkin.msgOkImagePath = msgOkImagePath;
	jsSkin.msgOkX = msgOkX;
	jsSkin.msgOkY = msgOkY;
	*/
	if (!$("#qsp-dialog-msg").hasClass("protected"))
	{
		$("#qsp-dialog-msg-background").empty();
		if (qspGameSkin.msgBackImagePath.length > 0)
			$("#qsp-dialog-msg-background").append("<img src=\"" + qspGameSkin.msgBackImagePath + "\">");
		$("#qsp-dialog-msg-background").css("left", qspGameSkin.msgX).css("top", qspGameSkin.msgY);
		$("#qsp-wrapper-msg").css("left", qspGameSkin.msgX + qspGameSkin.msgTextX).css("top", qspGameSkin.msgY + qspGameSkin.msgTextY)
			 .css("width", qspGameSkin.msgTextW).css("height", qspGameSkin.msgTextH);
		if (qspGameSkin.msgOkImagePath.length > 0)
		{
			$("#qsp-button-msg-ok").empty();
			$("#qsp-button-msg-ok").append("<img src=\"" + qspGameSkin.msgOkImagePath + "\">");
		}
		$("#qsp-button-msg-ok").css("left", qspGameSkin.msgX + qspGameSkin.msgOkX).css("top", qspGameSkin.msgY + qspGameSkin.msgOkY);
	}
    
    // Для диалога ошибки применяем в точности те же настройки, что и для MSG.
    // Нам приходится это делать, т.к. для диалога ошибки настроек не предусмотрено.
	if (!$("#qsp-dialog-msg").hasClass("protected"))
	{
		$("#qsp-dialog-error-background").empty();
		if (qspGameSkin.msgBackImagePath.length > 0)
			$("#qsp-dialog-error-background").append("<img src=\"" + qspGameSkin.msgBackImagePath + "\">");
		$("#qsp-dialog-error-background").css("left", qspGameSkin.msgX).css("top", qspGameSkin.msgY);
		$("#qsp-dialog-error-content").css("left", qspGameSkin.msgX + qspGameSkin.msgTextX).css("top", qspGameSkin.msgY + qspGameSkin.msgTextY)
		.css("width", qspGameSkin.msgTextW).css("height", qspGameSkin.msgTextH);
		if (qspGameSkin.msgOkImagePath.length > 0)
		{
			$("#qsp-button-error-ok").empty();
			$("#qsp-button-error-ok").append("<img src=\"" + qspGameSkin.msgOkImagePath + "\">");
		}
		$("#qsp-button-error-ok").css("left", qspGameSkin.msgX + qspGameSkin.msgOkX).css("top", qspGameSkin.msgY + qspGameSkin.msgOkY);
	}
	

	//STUB
	//Потом сделать установку координат системного меню через игру
//	$("#qsp-dialog-system-menu-container").css("left", 292).css("top", 151)
//											.css("width", 356).css("height", 338);
//	$("#qsp-dialog-system-menu-background").css("left", 292).css("top", 151);

	//STUB
	//Потом сделать установку координат дилога загрузки/сохранения через игру
//	$("#qsp-dialog-save-slots-container").css("left", 292).css("top", 151)
//											.css("width", 356).css("height", 338);

	//Показываем либо скрываем окно действий
	if ((qspGameSkin.showActs == 1) && (qspGameSkin.mainDescIntegratedActions == 1))
		$("#qsp-acts1").show();
	else
		$("#qsp-acts1").hide();
	if ((qspGameSkin.showActs == 1) && (qspGameSkin.mainDescIntegratedActions != 1))
		$("#qsp-wrapper-acts").show();
	else
		$("#qsp-wrapper-acts").hide();
	//Показываем либо скрываем окно инвентаря
	if (qspGameSkin.showObjs == 1)
		$("#qsp-wrapper-objs").show();
	else
		$("#qsp-wrapper-objs").hide();
	//Показываем либо скрываем окно дополнительного описания
	if (qspGameSkin.showVars == 1)
		$("#qsp-wrapper-vars").show();
	else
		$("#qsp-wrapper-vars").hide();
 	//Показываем либо скрываем строку ввода(не реализовано)
	/*
     if (show)
     $("#qsp-input-line").show();
     else
     $("#qsp-input-line").hide();
     */

	// Skin callback
	if (typeof(qspSkinOnUpdateSkin) == 'function')
		qspSkinOnUpdateSkin();
}

function qspBlockUi(block)
{
	//Блокируем или разблокируем интерфейс
	qspUiBlocked = block;
}

function qspShowSaveSlotsDialog(content)
{
    // parameter type: JSON Object

	//Показываем слоты - для загрузки либо сохранения
    var slots = content.slots;
	qspSaveSlotsModeOpen = content.open == 1;
	$("#qsp-dialog-save-slots-container").empty();
	
	for (i = 0; i < slots.length; i++)
	{
		var empty = slots[i] == "-empty-";
		var active = !qspSaveSlotsModeOpen || !empty;
		var slotName = empty ? "Слот " + (i + 1) + " (пусто)" : "Слот " + slots[i];
		//сделать какую-нибудь подсветку в будущем 
		/*   " onmouseover='javascript:qspSelectAction(" + i + ");' " + */
		var div = "<div class='qsp-save-slot-" + (active ? "enabled" : "disabled") + " qsp-skin-button'>" + 
						(active ? "<a onclick='javascript:qspCloseSaveSlots(" + (i + 1) + ");'>" : "") + 
   						"<div>" + slotName + "</div>" +
						(active ? "</a>" : "") + 
					"</div>";
		$("#qsp-dialog-save-slots-container").append(div);
	}
	qspCloseSystemMenu();

	qspDialogOpened = true;
	qspCurDialog = 'save';
	$("#qsp-dialog-save-slots").show();
	
	qspApplyScrollsVisibility();

	//Закрываем при клике вне диалога
	setTimeout( function() { // Delay for Mozilla
			$(".qsp-skin-overlay").bind('click', qspHandlerSaveSlotsOverlayClick);
	}, 0);
}

function qspMsg(text)
{
    // parameter type: JSON String
	qspDialogOpened = true;
	qspCurDialog = 'msg';
    text = qspApplyTemplateForText(qspGameSkin.msgTextFormat, text);

	$('#qsp-dialog-msg-content').empty();
	$('#qsp-dialog-msg-content').append(text);
	
	if (qsp_iScroll_msg != null)
		setTimeout(function () {
                   qsp_iScroll_msg.refresh();
                   if ((qspGameSkin != null) && (qspGameSkin.disableScroll == 0))
                       qsp_iScroll_msg.scrollTo(0, 0, 0, false);
                   }, 0);

	$('#qsp-dialog-msg').show();
	
	qspApplyScrollsVisibility();
	
	//Закрываем при клике вне диалога ?
	/*
	setTimeout( function() { // Delay for Mozilla
			$(".qsp-skin-overlay").click( function() {
				qspCloseMsg();
			});
	}, 0);
*/
}

function qspError(error)
{
    // parameter type: JSON Object

	//Показываем окошко с сообщением ошибки игры
    //desc, loc, actIndex, line
	qspDialogOpened = true;
	qspCurDialog = 'error';
	
	var errDesc = "<center>Ошибка!</center>" + 
                    "Локация: " + error.loc + "<br>" +
					"Строка: " + error.line + "<br>" +
					"Номер действия: " + error.actIndex + "<br>" +
					"Описание: " + error.desc;
	$('#qsp-dialog-error-content').empty();
	$('#qsp-dialog-error-content').append(errDesc);
	$('#qsp-dialog-error').show();
    
    qspApplyScrollsVisibility();
}

function qspMenu(menu)
{
    // parameter type: JSON Array
	qspDialogOpened = true;
	qspCurDialog = 'user-menu';
	$('#qsp-dialog-user-menu').empty();
	for (i = 0; i < menu.length; i++)
	{
		//пока не сделано, но сделать обязательно
		/*   " onmouseover='javascript:qspOverUserMenu(\"" + i + "\");' " + */
		$('#qsp-dialog-user-menu').append("<div class='qsp-user-menu-item'><a href=\"#" + i + "\">" + 
                                          qspApplyTemplateForTextAndImage(qspGameSkin.menuListItemFormat, menu[i].desc, menu[i].image) + 
                                          "</a></div>");
	}

    // Если менюшка вылазит за правый край, сдвигаем ее влево
    // Если менюшка вылазит за нижний край, сдвигаем ее вверх
    var menuX = qspMouseX;
    var menuY = qspMouseY;
    if (qspGameSkin != null)
    {
        if (menuX + qspGameSkin.menuListW + 2*qspGameSkin.menuBorder + 2*qspGameSkin.menuPadding > $(window).width())
        {
            menuX = $(window).width() - qspGameSkin.menuListW - 2*qspGameSkin.menuBorder - 2*qspGameSkin.menuPadding;
        }
        if (menuY + $('#qsp-dialog-user-menu').height() + 2*qspGameSkin.menuBorder + 2*qspGameSkin.menuPadding > $(window).height())
        {
            menuY = $(window).height() - $('#qsp-dialog-user-menu').height() - 2*qspGameSkin.menuBorder - 2*qspGameSkin.menuPadding;
        }
    }

    
    showContextMenu({
        menu: "qsp-dialog-user-menu",
		item: "qsp-user-menu-item",
		x: menuX,
		y: menuY
    },
        function(action) {
        qspCloseMenu(action);
    });
}

function qspInput(text)
{
    // parameter type: JSON String
	qspDialogOpened = true;
	qspCurDialog = 'input';
    
    text = qspApplyTemplateForText(qspGameSkin.inputTextFormat, text);
	$('#qsp-dialog-input-content').empty();
	$('#qsp-dialog-input-content').append(text);
	$('#qsp-dialog-input-text').val("");
	
	$("#qsp-dialog-input").show();
	
	qspApplyScrollsVisibility();
}

function qspView(path)
{
    // parameter type: JSON String

    // Библиотека QSP дергает вызов "VIEW" еще ДО выполнения кода первой локации,
    // поэтому qspView в первый раз зовется еще до того,
    // как мы назначили переменные оформления в qspGameSkin
    if (qspGameSkin === null)
        return;
    
	if (path == "")
	{
		//Закрываем VIEW по запросу из игры, если оно было ранее открыто
		qspCloseView();
	}
	else
	{
		//Открываем VIEW
		$('#qsp-dialog-view-image-container').empty();
		$('#qsp-dialog-view-image-container').append('<img src="' + path + '">');
		$('#qsp-dialog-view').show();
		
		if (qspGameSkin.viewAlwaysShow != 1)
		{
			qspDialogOpened = true;
			qspCurDialog = 'view';
			qspApplyScrollsVisibility();
			//Закрываем при любом клике
			setTimeout( function() { // Delay for Mozilla
					$(document).bind('click', qspHandlerViewClick);
			}, 0);
		}
		else
		{
			$('#qsp-dialog-view-image-container').imagesLoaded().always(qspRefreshMainScroll);
		}
	}
}


// Вызовы JS -> AS3

function qspSelectAction(index)
{
	//Навели курсор на действие (в мобильной версии отключено)
	if (qspDialogOpened || qspUiBlocked)
		return;
    QspLib.selectAction(index);
}

function qspExecuteAction(index)
{
	//Нажали на действие
	if (qspDialogOpened || qspUiBlocked)
		return;

    QspLib.executeAction(index);
}

function qspSelectObject(index)
{
	//Нажали на предмет в инвентаре
	if (qspDialogOpened || qspUiBlocked)
		return;
    qspSelectedObjectIndex = index;
    qspFillInvWithObjs();
    QspLib.selectObject(index);
}

function qspLoadGame()
{
    QspLib.loadGame();
}

function qspSaveGame()
{
    QspLib.saveGame();
}

function qspRestartGame()
{
	qspCloseSystemMenu();

	// Skin callback
	if (typeof(qspSkinOnRestart) == 'function')
		qspSkinOnRestart();

	QspLib.restartGame();
}

function qspCloseSaveSlots(slot)
{
	$(".qsp-skin-overlay").unbind('click', qspHandlerSaveSlotsOverlayClick);
	$("#qsp-dialog-save-slots").hide();
	qspDialogOpened = false;
	qspCurDialog = '';
	
	// Skin callback
	if (slot != -1)
	{
		if (qspSaveSlotsModeOpen)
		{
			if (typeof(qspSkinOnLoad) == 'function')
				qspSkinOnLoad();
		}
		else
		{
			if (typeof(qspSkinOnSave) == 'function')
				qspSkinOnSave();
		}
	}
	
	qspApplyScrollsVisibility();
	
    QspLib.saveSlotSelected(slot, qspSaveSlotsModeOpen);
}

function qspCloseMsg()
{
//	$(".qsp-skin-overlay").unbind('click');
	$("#qsp-dialog-msg").hide();
	qspDialogOpened = false;
	qspCurDialog = '';
	qspApplyScrollsVisibility();

    // Это не очень логично, что нам приходится обновлять
    // скроллер после того, как мы его прячем,
    // но иначе на Андроиде возникают страннейшие баги.
	if (qsp_iScroll_msg != null)
		setTimeout(function () {
                   qsp_iScroll_msg.refresh();
                   }, 0);
    
    QspLib.msgResult();
}

function qspCloseError()
{
	$('#qsp-dialog-error').hide(); 
	qspDialogOpened = false;
	qspCurDialog = '';
    qspApplyScrollsVisibility();
    
    QspLib.errorResult();
}

function qspCloseMenu(index)
{
	$('#qsp-dialog-user-menu').hide(); 
	qspDialogOpened = false;
	qspCurDialog = '';
	qspApplyScrollsVisibility();
    QspLib.userMenuResult(index);
}

function qspCloseInput(valid)
{
	$("#qsp-dialog-input").hide();
	qspDialogOpened = false;
	qspCurDialog = '';
	qspApplyScrollsVisibility();

	var text = valid ? $("#qsp-dialog-input-text").val() : '';
	QspLib.inputResult(text);
}

function qspCloseView()
{
	$(document).unbind('click', qspHandlerViewClick);
	
	$('#qsp-dialog-view').hide();
	$('#qsp-dialog-view-image-container').empty();
	
	qspDialogOpened = false;
	qspCurDialog = '';
	qspApplyScrollsVisibility();
	return false;
}

function qspCloseSystemMenu()
{
	$(".qsp-skin-overlay").unbind('click', qspHandlerSystemMenuOverlayClick);
	$('#qsp-dialog-system-menu').hide();
	qspDialogOpened = false;
	qspCurDialog = '';
	qspApplyScrollsVisibility();
}


// Диалоги

function qspSetDialogs()
{
	//MSG
	$('#qsp-dialog-msg').hide();

	//ERROR
	$('#qsp-dialog-error').hide();
	
	//MENU
	$('#qsp-dialog-user-menu').hide();
	$('#qsp-dialog-user-menu').css("position", "absolute").css("z-index", "500");
	
	//SYSTEM MENU
	$('#qsp-dialog-system-menu').hide();

	//SYSTEM MENU BUTTON
	$('#qsp-system-menu-button').hide();
	
	//SAVE SLOTS
	$('#qsp-dialog-save-slots').hide();
	
	//INPUT
	$('#qsp-dialog-input').hide();
    $('#qsp-dialog-input-text').keydown(function() {
        if (event.keyCode == 13) {
            $('#qsp-button-input-ok').trigger('click');
            return false;
         }
    });
	
	//VIEW
	$('#qsp-dialog-view').hide();
}

function qspSetPressableButtons()
{
	// Делаем возможность задавать специальные картинки для нажатых кнопок.
	// Можно обходиться и без них.
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    var hasTouch = 'ontouchstart' in window && !isTouchPad;
	
	// Лишние клики замечены только на тач-скринах
	if (hasTouch)
	{
		document.addEventListener('click', gcb_clickBuster, true);
	}
	
	var START_EV = hasTouch ? 'touchstart' : 'mousedown';
	var END_EV = hasTouch ? 'touchend touchcancel' : 'mouseup dragend';
    $(document).bind(START_EV, function(e) {
			qspLastPressedButton = e.target;
	
			// Делаем "нажатый" вид кнопок
			var t = $(qspLastPressedButton);
			
			// Если у картинки указан атрибут data-pressed, 
			// используем его для переключения в "нажатое" состояние
			var src1 = t.attr('src');
			var src2 = t.attr('data-pressed');
			if ((typeof(src1) !== 'undefined') && (typeof(src2) !== 'undefined'))
			{
				t.attr('src', src2);
				t.attr('data-pressed', src1);
			}
			
			// Для кнопки задаем класс "pressed"
			t = t.hasClass('qsp-skin-button') ? t : t.parents(".qsp-skin-button");
			if (t.length && t.hasClass('qsp-skin-button') && !t.hasClass('pressed'))
				t.addClass('pressed');
          });
    $(document).bind(END_EV, function(e) {
			// Возвращаем вид кнопок к исходному состоянию
			var t = $(qspLastPressedButton);
			if (!t.length)
				return;
			qspLastPressedButton = null;
				
			var src1 = t.attr('src');
			var src2 = t.attr('data-pressed');
			if ((typeof(src1) !== 'undefined') && (typeof(src2) !== 'undefined'))
			{
				t.attr('src', src2);
				t.attr('data-pressed', src1);
			}

			t = t.hasClass('qsp-skin-button') ? t : t.parents(".qsp-skin-button");
			if (t.length && t.hasClass('pressed'))
			{
				setTimeout( function() {
					t.removeClass('pressed');
					t = null;
				}, 200);
			}
          });
	
	// Убираем задержку кликов на тач-девайсах (fastclick.js)
	new FastClick(document.body);
}

function qspApplyTemplateForText(template, text)
{
    var t = template;
    t = t.replace('%TEXT%', text);
    return t;
}

function qspApplyTemplateForTextAndImage(template, text, image)
{
    var t = template;
    t = t.replace('%TEXT%', text);
    t = t.replace('%IMAGE%', image);
    return t;
}

function qspGetContentPath(path)
{
	// Уточняем путь к картинкам, если требуется
	if (qspGameSkin == null)
		return "";
	return qspGameSkin.contentPath + path;
}

function qspMakeRetinaPath(path)
{
	// Добавляем @2x для картинок, если требуется
	if (!qspScreenHD) return path;
	var checkForRetina = new RegExp("(.+)(@2x\\.\\w{3,4})");
	if (checkForRetina.test(path)) return path;
	return path.replace(/(.+)(\.\w{3,4})$/, "$1@2x$2");
}

function qspBackKeyPressed()
{
	// Пользователь нажал кнопку BACK
	if (qspDialogOpened)
	{
		if (qspCurDialog === 'save')
		{
			qspCloseSaveSlots(-1);
		}
		else if (qspCurDialog === 'msg')
		{
			qspCloseMsg();
		}
		else if (qspCurDialog === 'error')
		{
			qspCloseError();
		}
		else if (qspCurDialog === 'user-menu')
		{
			qspCloseMenu(-1);
		}
		else if (qspCurDialog === 'system-menu')
		{
			qspCloseSystemMenu();
		}
		else if (qspCurDialog === 'input')
		{
			qspCloseInput(false);
		}
		else if (qspCurDialog === 'view')
		{
			qspCloseView();
		}
	}
	else
	{
		QspLib.moveTaskToBackground();
	}
}

function qspLoadRetinaImages(selector)
{
	if (qspScreenHD)
	{
		$(selector).retina('@2x');
	}
}

function qspDetectScreenHD()
{
	// get pixel ratio
	var myDevicePixelRatio = 1;
	if (window.devicePixelRatio !== undefined) {
		myDevicePixelRatio = window.devicePixelRatio;
	} else if (window.matchMedia !== undefined) {
		for (var i = 1; i <= 2; i += 0.5) {
			if (window.matchMedia('(min-resolution: ' + i + 'dppx)').matches) {
				myDevicePixelRatio = i;
			}
		}
	}
	
	// Картинки @2x смотрятся лучше даже на экранах c плотностью пикселов 1.5 
	qspScreenHD = myDevicePixelRatio >= 1.5;

	if (qspScreenHD)
	{
		// Скрываем все картинки, заданные тегом IMG для Retina-дисплеев.
		// Нужно для того, чтобы не было "моргания" при подгрузке HD-версий
		$(document.head).append('<style> body.retina img:not(.processed-retina-img) { opacity:0; } </style>');
		// Добавляем класс "retina" к BODY
		$(document.body).addClass('retina');
	}
}