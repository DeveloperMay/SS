var jsdominio = 'https://abigor.com.br',
	lockExitMessage = '',
	XHRPopState = '',
	XHRPopLastController = '/',
	XHRPopStateScroll = {},
	lockChangePageFn = false,
	lockChangePage = false,
	lockClosePage = false,
	XHRPopStateShowStatus = true;

window.push = {
	controlador: '/',
	action: '',
	respostaAjax: '',
	render: a.id('content'),
	pushLoader: a.id('push-loader'),
	mobile: '/mobile',
	history: {
		init: function(configObj){

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
			a.evts.add('popstate', window, function(evts){

				if(lockChangePage === true){
					lockChangePageFn(window.location.href);
					return false;
				}

				var host = window.location.protocol+'//'+window.location.host;
				var controler = window.location.href.replace(host, '')+'!popstate';
				xhrfn(controler, function(){});

			});

			/* CLICK EVENTS */
			a.evts.add('click', document, function(evts){
				
				var elemt = evts.target;

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
						a.pushstate.goXHR(elemt.getAttribute('data-href'), xhrfn, lockChangePageFn);
					}else{
						var a = document.createElement('a');
						a.href = elemt.getAttribute('data-href');
						a.trigger('click', a);
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
										push.history.goXHR(elemt.href, xhrfn, lockChangePageFn);
									}

								}
							}
						}
					}
				}
			});

			/* beforeunload EVENT  */
			a.evts.add('beforeunload', window, function(evts){
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
	},
	url: function(){

		/* PEGA O PATHNAME DA URL - TUDO DEPOIS DO PRIMEIRO /, exp /contato */
		let url = window.location.pathname;

		/* IGNORA A VERSÃO MOBILE, EXP: /mobile/contato */
		url = url.replace(push.mobile, '');

		/* QUEBRA A URL */
		url = url.split('/');

		/* ATUALIZA A VARIAVEL CONTROLADOR */
		if(url[1]){
			push.controlador = url[1];
		}
		
		/* ATUALIZA A VARIAVEL ACTION */
		if(url[2]){
			push.action = url[2];
		}
	},
	getAction: function(){

		/* ATUALIZA A ACTION */
		push.url();

		return push.action;
	},
	getControlador: function(){

		/* ATUALIZA A CONTROLADOR */
		push.url();

		return push.controlador;
	},
	getXHRPopStateShowStatus: function(){
		return XHRPopStateShowStatus;
	},
	setXHRPopStateShowStatus: function(st){
		XHRPopStateShowStatus = st;
	},
	seo: function(res){

		/* ATUALIZA O SEO DA PÁGINA PELAS INFORMAÇÕES DA VIEW - CONTROLADOR */
		if(typeof(res) !== 'undefined'){

			if(res.title){
				document.title = res.title;
			}
			if(res.description){
				document.querySelector('meta[name="description"]').setAttribute("content", res.description);
			}
		}
	},
	checkJson: function(text){
		if (typeof text !=="string"){
			return false;
		}
		try{
			return true;
		}
		catch (error){
			return false;
		}
	},
	xhrfn: function(controler, doneCallFn){

		var expPopstate = /!popstate+$/g;
		var expHash = /#[.*\S]+$/g;
		var expHashExtract = /#([.*\S]+)$/i;
		var atualLocation = XHRPopLastController.replace(expHash, '');

		controler = controler.replace(expPopstate, '');
		var testHash = controler;

		/* SCROLL TO HASH ELEMENT */
		if(expHashExtract.test(controler) === true){
			var idByHash = controler.match(expHashExtract)[1];
			if(a.id(idByHash)){
				var idByHashTop = a.positionAtTop(a.id(idByHash));
				window.scrollTo(0, idByHashTop);
			}else{
				window.scrollTo(0, XHRPopStateScroll[controler]);
			}
		}

		push.pushLoader.style.width = '10%';
		push.pushLoader.style.opacity = 1;

		if(XHRPopState){
			if(typeof(XHRPopState.abort) === 'function'){
				if(push.getXHRPopStateShowStatus() === false){
					console.warn('Cancelando request anterior.');
				}
				push.setXHRPopStateShowStatus(false);
				XHRPopState.abort();
			}
		}
		
		push.setXHRPopStateShowStatus(false);

		XHRPopState = fetch(controler, {
			method: 'POST',
            mode: 'cors',
			headers: {
				'Content-Type':'application/x-www-form-urlencoded'
			},
			body: 'push=push'
			}).then(resposta => {

				resposta.json().then(json => {

					const metas = json.metas;
					const html = json.html;

					/* ATUALIZA A VARIAVEL RESPOSTAAJAX */
					push.respostaAjax = json;

					push.setXHRPopStateShowStatus(true);

					doneCallFn();

					push.pushLoader.style.width = '50%';

					/* ATUALIZA O SEO DA PAGINA */
					push.seo(metas);

					push.render.innerHTML = '';
					push.render.innerHTML = html;

					a.delay(function(){

						/* SCROLL TO HASH ELEMENT */
						if(expHashExtract.test(testHash) === true){
							var idByHash = testHash.match(expHashExtract)[1];
							if(a.id(idByHash)){
								var idByHashTop = a.positionAtTop(a.id(idByHash));
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

						/* ESTE TRECHO É IMPORTANTISSIMO PARA EXECUTAR O JS DAS VIEWS, SEM ISSO NÃO EXECUTA JS DAS VIEWS! */
						var scripts = push.render.getElementsByTagName('script');
						for(x in scripts){
							eval(scripts[x].innerHTML);
						}

					}, 30);

					/* CONTROLADOR INDEX */
					if(push.controlador == "/"){

						push.pushLoader.style.width = '100%';

						a.delay(function(){
							push.pushLoader.style.opacity = 0;
						}, 500);

					/* OUTROS */
					}else{

						a.delay(function(){

							push.pushLoader.style.width = '100%';

							a.delay(function(){
								push.pushLoader.style.opacity = 0;
							}, 500);

							a.delay(function(){
								push.pushLoader.style.width = '0%';
							}, 1000);
						}, 30);
					}
				});

			}).catch (error => {
			  console.log(error)
			}
		);
	}
};
push.history.init({
	'lockExitMessage': lockExitMessage,
	'xhrfn': push.xhrfn,
	'lockChangePageFn': lockChangePageFn
});