
function getXHRPopStateShowStatus(){
	return XHRPopStateShowStatus;
}

function setXHRPopStateShowStatus(st){
	XHRPopStateShowStatus = st;
}

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
		'data': {'metodo': 'ajax'},
		'dataType': 'json',
		'done': function(rtn){

			Boss.dialog.close();

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

			closeMenu();

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

			/* OUTROS */
			}else{

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

/* SOMENTE NO MOBILE */
window.toggleMenu = function(){

	var nav = Boss.getById('nav-menu');

	if(nav.classList.contains('nav_open')){
		closeMenu();
	}else{
		openMenu();
	}
};

/* SOMENTE NO MOBILE */
window.openMenu = function(){

	var nav = Boss.getById('nav-menu');
	
	lock();
	
	if(nav){
		nav.classList.remove('nav_close');
		nav.classList.add('nav_open');
	}
};	

/* SOMENTE NO MOBILE */
window.closeMenu = function(){
	var nav = Boss.getById('nav-menu');

	unlock();
	
	if(nav){
		nav.classList.remove('nav_open');
		nav.classList.add('nav_close');
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