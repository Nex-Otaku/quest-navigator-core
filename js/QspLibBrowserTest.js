/*
*  Bridge:
*           Javascript -> PhoneGap QSP Plugin
*
*/

var qspLibMode = "BROWSER_TEST";       // "AIR", "PHONEGAP" - устанавливаем для того, 
                                   // чтобы api.js мог выполнять различный код в зависимости от платформы

var testStage = 0;

var QspLib = {
    
    restartGame: function() {
		testChangeStage(0);
    },

    executeAction: function(index) {
		testRunAction(index);
    },
    selectObject: function(index) {
        //return cordova.exec(null, null, "QspLib", "selectObject", [index]);
    },
    loadGame: function() {
		qspShowSaveSlotsDialog(getTestSaveSlots(1));
    },
    
    saveGame: function() {
		qspShowSaveSlotsDialog(getTestSaveSlots(0));
    },
    
    saveSlotSelected: function(index, open) {
        //var mode = open ? 1 : 0;
        //return cordova.exec(null, null, "QspLib", "saveSlotSelected", [index, mode]);
    },

    msgResult: function() {
        //return cordova.exec(null, null, "QspLib", "msgResult", []);
    },
    
    errorResult: function() {
        //return cordova.exec(null, null, "QspLib", "errorResult", []);
    },
    
    userMenuResult: function(index) {
        //return cordova.exec(null, null, "QspLib", "userMenuResult", [index]);
    },
    
    inputResult: function(text) {
        //return cordova.exec(null, null, "QspLib", "inputResult", [text]);
    },

    setMute: function(mute) {
        //return cordova.exec(null, null, "QspLib", "setMute", [mute]);
    }
};


//Функция для предзагрузки картинок (сейчас не используется)
jQuery.preloadImages = function () {
    if (typeof arguments[arguments.length - 1] === 'function') {
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

function getTestMainDesc()
{
	if (testStage===0)
	{
		return ('<div id="qsp-cover-wrapper">' +
				'<img src="skins/gfx/top_cover.png"><br>' + 
				'<a onclick="javascript:testChangeStage(2);" class="qsp-skin-button"><img src="skins/gfx/main_menu_start.png" data-pressed="skins/gfx/main_menu_start_pressed.png"></a><br>' + 
				'<a onclick="javascript:testChangeStage(1);" class="qsp-skin-button"><img src="skins/gfx/main_menu_about.png" data-pressed="skins/gfx/main_menu_about_pressed.png"></a><br>' +
				'<a href="http://qsp.su" class="qsp-skin-button"><img src="skins/gfx/main_menu_moregames.png" data-pressed="skins/gfx/main_menu_moregames_pressed.png"></a>' +
				'</div>'
				);
	}
	else if (testStage===1)
	{
		return ('<br>' +
		'<center><b>Феи: пропавший зонтик</b></center><br>' +
'<br>' +
'<i>Автор:</i> Ajenta Arrow<br>' +
'<br>' +
'<i>Дизайн, оформление:</i> Александра Гришина "yellowsparrow"<br>' +
'<br>' +
'<i>Музыка:</i><br>' +
'	"Easy Lemon", "Airport Lounge" - Kevin MacLeod (<a href="http://incompetech.com/">incompetech.com</a>)<br>' +
'<br>' +
'<br>' +
'<b>Что это за игра?</b><br>' +
'<br>' +
'Это интерактивная история. Вы будете выбирать различные варианты действий, таким образом управляя сюжетом. Ваша цель - достичь успешной концовки.<br>' +
'<br>' +
'<b>Волшебные зонтики</b><br>' +
'<br>' +
'В любой момент игры вы можете использовать волшебные зонтики. Но как только вы выберете действие, ситуация изменится. Поэтому, сначала проверьте - нельзя ли здесь применить зонтик, и пробуйте применить(нажать на иконку зонтика). Иначе момент может быть упущен.<br>' +
'<br>' +
'<br>' +
'<b>Обращение к игрокам:</b><br>' +
'<br>' +
'Если вы хотите сообщить об ошибке, недоработке, предложить свои идеи, или задать вопрос, обращайтесь по адресу <a href="mailto:butterfly-lantern@text-games.ru">butterfly-lantern@text-games.ru</a>.<br>' +
'<br>' +
'Если же вы просто хотите поделиться впечатлением от игры, пожалуйста, оставьте оценку и комментарий на странице игры в App Store.<br>' +
'<br>' +
'Имейте в виду, что App Store не позволяет разработчикам отвечать на комментарии на странице игры. Для обратной связи используйте вышеуказанный e-mail.<br>'
);
	}
	else if (testStage===2)
	{
		return ('В саду у Энке жили феи - три девочки и один мальчик: Алия, Амалия, Анития и Тенай. У Алии были прозрачные жёлтые крылышки, как и положено фее домашнего уюта, и жила она в щели между крышей дома и потолочными балками.<br>' +
				'<br>' +
				'Однажды Алия возвращалась от подруги Амалии к себе домой и обнаружила, что пропал зонтик. Это был её любимый зонтик - красный в жёлтый горошек. С его помощью она зажигала в саду ночных светлячков. Ночью был дождь, и утром она оставила его сушиться на подоконнике своего жилища, а теперь зонтик исчез. Самое странное, что три других зонтика, которые фея оставила сушиться рядом, остались на месте.<br>' +
				'<br>' +
				'Но кто же мог взять её любимый зонтик? Алия взяла оставшиеся три зонтика, чтобы они уж точно никуда не исчезли, и задумалась - что же теперь делать?<br>'
		);
	}
	else if (testStage===3)
	{
		return ('Алия открыла золотой зонт, её душа снова наполнилась радостью. Голова закружилась ещё больше. Крылья ослабели. Ей стало уже всё равно, что пропал зонтик и что она не сможет зажечь ночные светлячки. Да и что такое светлячки, она уже помнила с трудом. Она опустилась на черепицу крыши и уснула. Наутро она проснулась, но это была уже совсем другая история...<br>' +
				'<br>' +
				'Боюсь, что это конец приключений.<br>' +
				'Попробуйте начать игру сначала.<br>'
		);
	}
	return null;
}

function getTestActs()
{
	if (testStage===1)//об игре
	{
		return [
				{image:'', desc:'Назад'}
				];
	}
	else if (testStage===2)//начало
	{
		return [
				{image:'', desc:'Концовка'}
				];
	}
	else if (testStage===3)//концовка
	{
		return [
				{image:'', desc:'Заново'}
				];
	}
	return null;
}

function getTestSkin()
{
	var skin = {
					mainBackImagePath:"",
					sysMenuButtonImagePath:"",
					backColor:"#FBFCE1",
					menuBorder:1,
					menuBorderColor:"#FFF",
					fontColor:"#000",
					linkColor:"#F00",
					fontName:"_sans",
					fontSize:16,
					viewAlwaysShow:1,
					showActs:0,
					mainDescIntegratedActions:1,
					showObjs:0,
					showVars:0,
					mainDescTextFormat:"%TEXT%",
					msgTextFormat:"%TEXT%",
					inputTextFormat:"%TEXT%",
					actsListItemFormat:"<div class='np-action-outer'><div class='np-action-inner'>%TEXT%</div></div>",
					objsListItemFormat:"<img src='%IMAGE%.png'>",
					objsListSelItemFormat:"<img src='%IMAGE%_active.png'>",
					contentPath:""
					};
	if (testStage===0)//меню
	{
		skin.showActs = 0;
	}
	else if (testStage===1)//об игре
	{
		skin.showActs = 1;
	}
	else if (testStage===2)//начало
	{
		skin.showActs = 1;
	}
	else if (testStage===3)//концовка
	{
		skin.showActs = 1;
	}
	return skin;
}

function getTestSaveSlots(mode)
{
	return {
					open:mode,
					slots:[	
							'-empty-',
							'-empty-',
							'3',
							'-empty-',
							'-empty-'
							]
				};
}

function testChangeStage(stage)
{
	//console.log('stage ' + stage);
	testStage = stage;

	testRunNewStage();
	
	var content = {
					main:getTestMainDesc(),
					skin:getTestSkin(),
					acts:getTestActs()
					}; 
	qspSetGroupedContent(content);
}

function testRunAction(actIndex)
{
	if (testStage === 1)//об игре
	{
		if (actIndex==='0')
		{
			testChangeStage(0);//меню
		}
	}
	else if (testStage === 2)//начало
	{
		if (actIndex==='0')
		{
			testChangeStage(3);//концовка
		}
	}
	else if (testStage === 3)//концовка
	{
		if (actIndex==='0')
		{
			testChangeStage(0);//начало
		}
	}
}

function testRunNewStage()
{
	if (testStage === 0)//обложка
	{
		qspView('');
		skinSetStage('cover');
	}
	else if (testStage === 1)//об игре
	{
		skinSetStage('about');
	}
	else if (testStage === 2)//начало
	{
		skinSetStage('main');
	}
	else if (testStage === 3)//проигрыш
	{
		skinSetStage('ending');
		qspView('skins/gfx/death.png');
	}
}

function testRunMsg()
{
	qspMsg(
			'<center><img src="skins/gfx/umb_bolot.png"></center>Первый зонтик был болотного цвета с зелёными разводами. Он помогал фее скрывать предметы, делать их невидимыми. Алия часто пользовалась им, когда не успевала навести порядок в доме или в саду до прихода родителей Энке, чтобы потом не спеша доделать свои дела. Или когда ей нужно было скрыться от соседского кота, ужасного надоеды и пакостника. Но волшебный зонтик помогал ещё и видеть скрытое, или спрятанное, например клады. Надо только знать, где искать. У любой волшебной вещи две стороны. Ах, если бы Алия хоть примерно знала, где искать свой зонтик, она бы уже нашла его.<br>' +
			'<br>' +
			'<center><img src="skins/gfx/umb_zolot.png"></center>Второй зонтик был золотым с нежно голубыми цветами. Он был незаменим, когда в живом существе нужно было вызвать радость и умиротворение. Алия часто использовала его для того, чтобы успокоить Энке и его родителей, а так же предотвратить конфликты между жителями цветущего сада. Но радость, если её много, может опьянить не хуже любого вина, в этом деле главное не переусердствовать.<br>' +
			'<br>' +
			'<center><img src="skins/gfx/umb_korich.png"></center>Третий зонтик был коричневым с оранжевыми полосками. Он позволял починить любую сломанную или разбитую вещь. Это очень полезно в хозяйстве. Но также он позволял разбивать и ломать. Алия была доброй феей и никогда не пользовалась этими способностями зонтика.<br>'
			);
}

function onPhoneGapDeviceReady() {
    // Now safe to use the PhoneGap API
	window.resizeTo(320, 480);
	testChangeStage(0);
}
