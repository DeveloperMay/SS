window.push = {
	jsdominio: 'https://objetivasoftware.com.br',
	lockExitMessage: '',
	XHRPopState,
	XHRPopLastController: '/',
	XHRPopStateScroll: {},
	lockChangePageFn: false,
	XHRPopStateShowStatus: true,
	pushstate: {
		init: function(configObj){

			history.scrollRestoration = 'manual';

			var xhrfn = function(){};
			var lockChangePageFn = function(){};
			var lockExitMessage = '';

			if(typeof(configObj.xhrfn) === 'function'){
				xhrfn = configObj.xhrfn;
			}

			if(typeof(configObj.lockChangePageFn) === 'function'){
				lockChangePageFn = configObj.lockChangePageFn;
			}

			if(configObj.lockExitMessage){
				lockExitMessage = configObj.lockExitMessage;
			}

			/* POPSTATE EVENT */
			Boss.evts.add('popstate', window, function(evts){

				if(lockChangePage === true){
					lockChangePageFn(window.location.href);
					return false;
				}

				var host = window.location.protocol+'//'+window.location.host;
				var controler = window.location.href.replace(host, '')+'!popstate';
				xhrfn(controler, function(){});

			});

			/* CLICK EVENTS */
			Boss.evts.add('click', document, function(evts){

				var elemt = Boss.targt(evts);

				var expJs = new RegExp('javascript:', 'i');
				var expFTP = new RegExp('ftp:', 'i');
				var expMail = new RegExp('mailto:', 'i');
				var expWhatsapp = new RegExp('whatsapp:', 'i');

				var domain = window.location.hostname;

				if(elemt.parentElement !== null && elemt.nodeName !== 'BUTTON' && elemt.parentElement.nodeName === 'BUTTON'){
					elemt = elemt.parentElement;
				}

				if(elemt.nodeName === 'BUTTON' && elemt.getAttribute('data-href') && elemt.getAttribute('data-href') !== false){

					var hrefDomain = elemt.getAttribute('data-href').replace('http://', '');
					hrefDomain = hrefDomain.replace('https://', '');

					var re = new RegExp('^\/', 'i'); 

					if(re.test(hrefDomain) === true){
						hrefDomain = domain+hrefDomain;
					}

					var urlIn = new RegExp('^'+domain, 'i');

					if(urlIn.test(hrefDomain) === true){
						Boss.pushstate.goXHR(elemt.getAttribute('data-href'), xhrfn, lockChangePageFn);
					}else{
						var a = document.createElement('a');
						a.href = elemt.getAttribute('data-href');
						Boss.trigger('click', a);
					}
				}else{

					var wl = true;
					while(wl === true){

						if(elemt.parentNode !== null && elemt.nodeName !== 'A'){
							elemt = elemt.parentNode;
						}else{
							wl = false;

							if(elemt.href){

								var hrefDomain = elemt.href.replace('http://', '');
								hrefDomain = hrefDomain.replace('https://', '');

								var urlIn = new RegExp('^'+domain, 'i');

								if(urlIn.test(hrefDomain) === true && !elemt.getAttribute('data-href')){

									/* GOXHR*/
									if(expJs.test(elemt.href) === false || 
										expFTP.test(elemt.href) === false || 
										expMail.test(elemt.href) === false || 
										expWhatsapp.test(elemt.href) === false || 
										!elemt.getAttribute('data-href')){

										if(evts.stopPropagation){
											evts.stopPropagation();
										}
										if(evts.preventDefault){
											evts.preventDefault();
										}
										Boss.pushstate.goXHR(elemt.href, xhrfn, lockChangePageFn);
									}

								}
							}
						}
					}
				}
			});

			/* beforeunload EVENT  */
			Boss.evts.add('beforeunload', window, function(evts){
				if(lockClosePage === true){

					evts.cancelBubble = true;

					evts.returnValue = lockExitMessage;

					if(evts.stopPropagation){
						evts.stopPropagation();
					}

					if(evts.preventDefault){
						evts.preventDefault();
					}

					return lockExitMessage;
				}
			});
		},
		goXHR: function(controler, xhrfn, lockChangePageFn){

			if(lockChangePage === true && lockChangePageFn){
				lockChangePageFn(controler);
				return false;
			}

			var host = window.location.protocol+'//'+window.location.host;
			var ctrlpage = window.location.href.replace(host, '');
			ctrlpage = ctrlpage.replace(/\?.*$/, '');
			XHRPopStateScroll[ctrlpage] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

			xhrfn(controler, function(){
				history.pushState({}, '', controler);
			});

		}
	}
};


window.animaBox = {
	inner: null,
	container: null,
	config: {
		refreshRate: 1,
		counter: 0,
		perspective: 30,
	},
	mouse: {
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		updatePosition: function(event){

			var e = event || window.event;
			this.x = e.clientX - this._x;
			this.y = (e.clientY - this._y) * -1;
		},
		setOrigin: function(e) {
			this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
			this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
		},
		show: function() {
			return "(" + this.x + ", " + this.y + ")";
		}
	},
	isTimeToUpdate: function(){

		return animaBox.config.counter++ % animaBox.config.refreshRate === 0;
	},
	onMouseEnterHandler: function(event){
		animaBox.update(event);
	},
	onMouseLeaveHandler: function(){
		animaBox.inner.style = null;
	},
	onMouseMoveHandler: function(event){
		if(animaBox.isTimeToUpdate()){
			animaBox.update(event)
		}
	},
	update: function(event){

		animaBox.mouse.updatePosition(event);

		animaBox.updateTransformStyle(
			(animaBox.mouse.y / animaBox.inner.offsetHeight / 2).toFixed(2),
			(animaBox.mouse.x / animaBox.inner.offsetWidth / 2).toFixed(2)
		);
	},
	updateTransformStyle: function(x, y){
		var style = "rotateX(" + x + "deg) rotateY(" + y + "deg) scale3d(1, 1, 1)";

		animaBox.inner.style.willChange = 'transform';
		animaBox.inner.style.transform = style;
		animaBox.inner.style.webkitTransform = style;
		animaBox.inner.style.mozTranform = style;
		animaBox.inner.style.msTransform = style;
		animaBox.inner.style.oTransform = style;
	},
	init: function(container){

		container = Boss.getById(container);

		/* Proximo elemento ( elemento.nextSibling ) */
		var inner = container.getElementsByTagName('DIV')[0];

		if(container && inner){

			animaBox.container = container;
			animaBox.inner = inner;

			container.style.display = 'block';
			container.style.perspective = animaBox.config.perspective+'px';

			animaBox.mouse.setOrigin(container);

			container.onmousemove = animaBox.onMouseMoveHandler;
			container.onmouseleave = animaBox.onMouseLeaveHandler;
			container.onmouseenter = animaBox.onMouseEnterHandler;
		}
	},
	xhrfn: function(controler, doneCallFn){

		var expPopstate = /!popstate+$/g;
		var expHash = /#[.*\S]+$/g;
		var expHashExtract = /#([.*\S]+)$/i;
		var atualLocation = XHRPopLastController.replace(expHash, '');

		controler = controler.replace(expPopstate, '');
		var testHash = controler;

		// SCROLL TO HASH ELEMENT
		if(expHashExtract.test(controler) === true){
			var idByHash = controler.match(expHashExtract)[1];
			if(Boss.getById(idByHash)){
				var idByHashTop = Boss.positionAtTop(Boss.getById(idByHash));
				window.scrollTo(0, idByHashTop);
			}else{
				window.scrollTo(0, XHRPopStateScroll[controler]);
			}
		}

		controler = controler.replace(expHash, '');
		controlador = controler;

		var pushLoader = Boss.getById('push-loader');
		pushLoader.style.width = '10%';
		pushLoader.style.opacity = 1;

		if(XHRPopState){
			if(typeof(XHRPopState.abort) === 'function'){
				if(getXHRPopStateShowStatus() === false){
					console.warn('Cancelando request anterior.');
				}
				setXHRPopStateShowStatus(false);
				XHRPopState.abort();
			}
		}
		
		setXHRPopStateShowStatus(false);

		XHRPopState = Boss.ajax({
			'url': controler,
			'data': {'push': 'push'},
			'dataType': 'json',
			'done': function(rtn){

				setXHRPopStateShowStatus(true);

				doneCallFn();

				pushLoader.style.width = '50%';

				if(rtn.title){
					document.title = rtn.title;
				}

				var render = Boss.getById('content');
				render.innerHTML = '';
				render.innerHTML = rtn.html;

				if(typeof(ga) !== 'undefined'){
					
					if(controler === jsdominio){
						ga('send', 'pageview', '/');
					}else{
						ga('send', 'pageview', controler.replace(jsdominio, ''));
					}
				}

				Boss.delay(function(){

					// SCROLL TO HASH ELEMENT
					if(expHashExtract.test(testHash) === true){
						var idByHash = testHash.match(expHashExtract)[1];
						if(Boss.getById(idByHash)){
							var idByHashTop = Boss.positionAtTop(Boss.getById(idByHash));
							window.scrollTo(0, idByHashTop);
						}else{
							window.scrollTo(0, XHRPopStateScroll[testHash]);
						}
					}else{

						controlerscroll = controler.replace(/\?.*$/, '');

						if(XHRPopStateScroll[controlerscroll]){
							window.scrollTo(0, XHRPopStateScroll[controlerscroll]);
						}else if(XHRPopStateScroll['/'+controlerscroll]){
							window.scrollTo(0, XHRPopStateScroll['/'+controlerscroll]);
						}else{
							window.scrollTo(0, 0);
						}
					}

					var scripts = render.getElementsByTagName('script');
					for(x in scripts){
						eval(scripts[x].innerHTML);
					}

				}, 30);

				/* CONTROLADOR INDEX */
				if(controler === '/' || controler === jsdominio || controler === jsdominio+'/' || controler === jsdominio+'/mobile/'){

					pushLoader.style.width = '100%';

					Boss.delay(function(){
						pushLoader.style.opacity = 0;
					}, 500);

					if(Boss.getById('header-index-pc') && Boss.getById('header-index-pc-arrow')){

						Boss.getById('header-index-pc').classList.remove('hidden');
						Boss.getById('header-index-pc-arrow').classList.remove('hidden');
					}

				/* OUTROS */
				}else{

					if(Boss.getById('header-index-pc') && Boss.getById('header-index-pc-arrow')){

						Boss.getById('header-index-pc').classList.add('hidden');
						Boss.getById('header-index-pc-arrow').classList.add('hidden');
					}

					Boss.delay(function(){

						pushLoader.style.width = '100%';

						Boss.delay(function(){
							pushLoader.style.opacity = 0;
						}, 500);

						Boss.delay(function(){
							pushLoader.style.width = '0%';
						}, 1000);
					}, 30);

					var ctrl = controler
					ctrl = ctrl.replace(jsdominio+'/mobile/', '');
					ctrl = ctrl.replace(jsdominio+'/', '');

					ctrl = ctrl.split('/');

				}

				closeMenu();
			},
			'error': function(evts){
				if(getXHRPopStateShowStatus() === true){
					Boss.warning({'message': 'Não foi possível acessar o conteúdo requisitado, há algum problema com a Internet!'});
					Boss.delay(function(){
						pushLoader.style.opacity = 0;
					}, 500);

					Boss.delay(function(){
						pushLoader.style.width = '0%';
					}, 1000);
				}
			}
		});
	};
};



















function getXHRPopStateShowStatus(){
	return XHRPopStateShowStatus;
}

function setXHRPopStateShowStatus(st){
	XHRPopStateShowStatus = st;
}

window.goHref = function(url){
	Boss.pushstate.goXHR(url, xhrfn, lockChangePageFn);
};

window.controlador = '/';

var xhrfn = function(controler, doneCallFn){

	var expPopstate = /!popstate+$/g;
	var expHash = /#[.*\S]+$/g;
	var expHashExtract = /#([.*\S]+)$/i;
	var atualLocation = XHRPopLastController.replace(expHash, '');

	controler = controler.replace(expPopstate, '');
	var testHash = controler;

	// SCROLL TO HASH ELEMENT
	if(expHashExtract.test(controler) === true){
		var idByHash = controler.match(expHashExtract)[1];
		if(Boss.getById(idByHash)){
			var idByHashTop = Boss.positionAtTop(Boss.getById(idByHash));
			window.scrollTo(0, idByHashTop);
		}else{
			window.scrollTo(0, XHRPopStateScroll[controler]);
		}
	}

	controler = controler.replace(expHash, '');
	controlador = controler;

	var pushLoader = Boss.getById('push-loader');
	pushLoader.style.width = '10%';
	pushLoader.style.opacity = 1;

	if(XHRPopState){
		if(typeof(XHRPopState.abort) === 'function'){
			if(getXHRPopStateShowStatus() === false){
				console.warn('Cancelando request anterior.');
			}
			setXHRPopStateShowStatus(false);
			XHRPopState.abort();
		}
	}
	
	setXHRPopStateShowStatus(false);

	XHRPopState = Boss.ajax({
		'url': controler,
		'data': {'push': 'push'},
		'dataType': 'json',
		'done': function(rtn){

			setXHRPopStateShowStatus(true);

			doneCallFn();

			pushLoader.style.width = '50%';

			if(rtn.title){
				document.title = rtn.title;
			}

			var render = Boss.getById('content');
			render.innerHTML = '';
			render.innerHTML = rtn.html;

			if(typeof(ga) !== 'undefined'){
				
				if(controler === jsdominio){
					ga('send', 'pageview', '/');
				}else{
					ga('send', 'pageview', controler.replace(jsdominio, ''));
				}
			}

			Boss.delay(function(){

				// SCROLL TO HASH ELEMENT
				if(expHashExtract.test(testHash) === true){
					var idByHash = testHash.match(expHashExtract)[1];
					if(Boss.getById(idByHash)){
						var idByHashTop = Boss.positionAtTop(Boss.getById(idByHash));
						window.scrollTo(0, idByHashTop);
					}else{
						window.scrollTo(0, XHRPopStateScroll[testHash]);
					}
				}else{

					controlerscroll = controler.replace(/\?.*$/, '');

					if(XHRPopStateScroll[controlerscroll]){
						window.scrollTo(0, XHRPopStateScroll[controlerscroll]);
					}else if(XHRPopStateScroll['/'+controlerscroll]){
						window.scrollTo(0, XHRPopStateScroll['/'+controlerscroll]);
					}else{
						window.scrollTo(0, 0);
					}
				}

				var scripts = render.getElementsByTagName('script');
				for(x in scripts){
					eval(scripts[x].innerHTML);
				}

			}, 30);

			/* CONTROLADOR INDEX */
			if(controler === '/' || controler === jsdominio || controler === jsdominio+'/' || controler === jsdominio+'/mobile/'){

				pushLoader.style.width = '100%';

				Boss.delay(function(){
					pushLoader.style.opacity = 0;
				}, 500);

				if(Boss.getById('header-index-pc') && Boss.getById('header-index-pc-arrow')){

					Boss.getById('header-index-pc').classList.remove('hidden');
					Boss.getById('header-index-pc-arrow').classList.remove('hidden');
				}

			/* OUTROS */
			}else{

				if(Boss.getById('header-index-pc') && Boss.getById('header-index-pc-arrow')){

					Boss.getById('header-index-pc').classList.add('hidden');
					Boss.getById('header-index-pc-arrow').classList.add('hidden');
				}

				Boss.delay(function(){

					pushLoader.style.width = '100%';

					Boss.delay(function(){
						pushLoader.style.opacity = 0;
					}, 500);

					Boss.delay(function(){
						pushLoader.style.width = '0%';
					}, 1000);
				}, 30);

				var ctrl = controler
				ctrl = ctrl.replace(jsdominio+'/mobile/', '');
				ctrl = ctrl.replace(jsdominio+'/', '');

				ctrl = ctrl.split('/');

			}

			closeMenu();
		},
		'error': function(evts){
			if(getXHRPopStateShowStatus() === true){
				Boss.warning({'message': 'Não foi possível acessar o conteúdo requisitado, há algum problema com a Internet!'});
				Boss.delay(function(){
					pushLoader.style.opacity = 0;
				}, 500);

				Boss.delay(function(){
					pushLoader.style.width = '0%';
				}, 1000);
			}
		}
	});
};

window.curY = 0;
window.lock = function(){
	curY = window.scrollY;
	document.body.classList.add('lock');
};

window.unlock = function(){
	document.body.classList.remove('lock');
	window.scrollTo(0, curY);
};

window.toggleMenuMobile = function(){

	var menu = Boss.getById('menu-mob');

	if(menu){

		if(menu.classList.contains('menu-mob-open')){
			closeMenu();
		}else{
			openMenu();
		}
	}
};

window.closeMenu = function(){
	var menu = Boss.getById('menu-mob');

	if(menu){
		
		unlock();
		menu.classList.add('menu-mob-close');
		menu.classList.remove('menu-mob-open');
	}
};

window.openMenu = function(){
	var menu = Boss.getById('menu-mob');

	if(menu){

		lock();		
		menu.classList.add('menu-mob-open');
		menu.classList.remove('menu-mob-close');
	}
};



window.getKey = function(){

	var key = sessionStorage.getItem("key");

	if(Boss.getById('int-key')){

		Boss.getById('int-key').innerHTML = key+'. ';
	}
};

window.share = function(rede, link){

	if(rede == 'facebook'){

		window.open("https://www.facebook.com/share.php?u="+window.location.href+link, 'compartilhar', 'width=800, height=600, toolbar=no, top=50, left=50');
	}	

	if(rede == 'whatsapp'){

		if(url == 'mobile'){

			window.open("whatsapp://send?text="+window.location.href+link, 'compartilhar', 'width=800, height=600, toolbar=no, top=50, left=50');
		}else{

			window.open("https://web.whatsapp.com/send?text="+window.location.href+link, 'compartilhar', 'width=800, height=600, toolbar=no, top=50, left=50');
		}
	}

	if(rede == 'twitter'){

		window.open("https://twitter.com/home?status="+window.location.href+link, 'compartilhar', 'width=800, height=600, toolbar=no, top=50, left=50');
	}
};

window.setcode = function(key){

	sessionStorage.setItem("key", key);
};

var lastWidth = 0;
var prevScrollpos = window.pageYOffset;

var ur = window.location.pathname;
window.url = 'pc';
ur = ur.split('/');

if(ur[1] == 'mobile'){
	url = 'mobile';
}

function checkChange(){

	if(!sessionStorage.getItem('versaoPC') && !sessionStorage.getItem('versaoMobile')){

		sessionStorage.setItem('versaoPC', 'false');
		sessionStorage.setItem('versaoMobile', 'false');
	}

	if(url === 'pc'){

		if(sessionStorage.getItem('versaoPC') === 'true'){

			Boss.getById('box-changeMobile').classList.add('hidden');
		}else{
			Boss.getById('box-changeMobile').classList.remove('hidden');
		}

	}else{

		if(sessionStorage.getItem('versaoMobile') === 'true'){

			Boss.getById('box-changeMobile').classList.add('hidden');
		}else{
			Boss.getById('box-changeMobile').classList.remove('hidden');
		}
	}
}

function cancelChange(versao){

	if(Boss.getById('box-changeMobile')){

		Boss.getById('box-changeMobile').classList.add('hidden');
	}

	if(versao === 'pc'){

		sessionStorage.setItem('versaoPC', 'true');
	}else{
		
		sessionStorage.setItem('versaoMobile', 'true');
	}
}

Boss.pushstate.init({
	'lockExitMessage': lockExitMessage,
	'xhrfn': xhrfn,
	'lockChangePageFn': lockChangePageFn
});

window.busca = {
	inputSearch: Boss.getById('input-search'),
	ajax: function(value){

		value.toLowerCase();

		if(Boss.getById('loader-busca')){

			Boss.getById('loader-busca').classList.remove('hidden');
		}

		/* REMOVE TAGS HTML DO INPUT */
		var temp = document.createElement('div');
		temp.innerHTML = value;
		value = temp.textContent;

		if(value !== ''){

			var con = controlador.split('/');

			if(url == 'pc'){
				url = '/';
			}

			if(url == 'mobile'){
				url = '/mobile/';
			}

			console.log(url+"busca/b/"+value);

			if(url == '/mobile/'){

				if(con[3] !== 'mobile' && con[2] !== 'busca'){

					Boss.pushstate.goXHR(url+"busca/b/"+value, xhrfn, lockChangePageFn);
				}
			}

			if(url == '/'){
				if(con[1] !== 'busca'){

					Boss.pushstate.goXHR(url+"busca/b/"+value, xhrfn, lockChangePageFn);
				}
			}

			window.history.pushState("", "", url+"busca/b/"+value);

			Boss.ajax({
				url: url+'busca/busca',
				data: {'search': value},
				dataType: 'json',
				done: function(rtn){

					if(Boss.getById('totalItens') && Boss.getById('res-busca') && Boss.getById('resultados-busca')){

						var total = rtn.total;
						var html = rtn.html;

						if(Boss.getById('loader-busca')){

						 	Boss.getById('loader-busca').classList.add('hidden');
						}
						
						Boss.getById('totalItens').innerHTML = total;

						Boss.getById('res-busca').innerHTML = '';
						Boss.getById('resultados-busca').innerHTML = html;
					
					}
				}
			});
		}
	},
	init: function(){

		Boss.evts.add('keyup', busca.inputSearch, function(){

			Boss.delayPersistent2(function(){

				if(busca.inputSearch.value.length >= 3){

					busca.ajax(busca.inputSearch.value);
				}

			}, 600, 'Busca');
		});
	}
};

window.searchBusca = '';

window.busca_refresh = function(){

	if(searchBusca){
		
		if(typeof(busca) !== 'undefined'){

			busca.inputSearch.value = searchBusca;

			if(typeof(busca.ajax) !== 'undefined'){

				busca.ajax(busca.inputSearch.value);
			}
		}
	}
};

busca.init();