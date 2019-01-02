window.a = {
	/* ADD EVENTS */
	evts: {
		add: function (evt, el, fn) {
			if(el !== null){
				if(window.addEventListener){
					el.addEventListener(evt, function(evt){
						fn(evt);
					}, true);
				}else{
					el.attachEvent("on"+evt, function(){
						fn(evt);
					});
				}
			}
		}
	},
	targt: function (e) {
		return e.target;
	},
	trigger: function (ev, el){
		if(document.createEvent){
			evento = document.createEvent('HTMLEvents');
			evento.initEvent(ev, true, true);
			el.dispatchEvent(evento);
		}else{
			evento = document.createEventObject();
			el.fireEvent('on'+ev, evento);
		}
	},
	id: function(element){
		return document.getElementById(element);
	},
	delay: function (fn, tm) {
		window.setTimeout(function () {
			fn();
		}, tm);
	},
	delayPersistent: (function(fn, ms){
		var timer = 0;
		return function(fn, ms){
			clearTimeout(timer);
			timer = setTimeout(fn, ms);
		};
	}()),
	delayPersistent2: (function(fn, ms, label){
		if(typeof(delayPersistent2) === 'undefined'){
			window.delayPersistent2 = {};
		}
		return function(fn, ms, label){
			clearTimeout(delayPersistent2[label]);
			delayPersistent2[label] = setTimeout(fn, ms);
		};
	}()),
	testJSON: function(text){
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
	ajax: function (options) {

		if(a.id('box-pc-menu')){

			if(a.id('box-pc-menu').classList.contains('box-menu-pc-open') && typeof(closeMenuPC) !== 'undefined'){

				closeMenuPC();
			}
		}
		var XHR;
		var strPost = new Array();
		var r20 = /%20/g;

		if(window.XMLHttpRequest){
			XHR = new XMLHttpRequest();
		}else if(window.ActiveXObject){
			XHR = new ActiveXObject('Msxml2.XMLHTTP');
			if(!XHR){
				XHR = new ActiveXObject('Microsoft.XMLHTTP');
			}
		}else{
			console.warn('This Browser do not support XMLHttpRequest');
			return false;
		}

		if(options.progress){
			XHR.upload.addEventListener('progress', options.progress, false);
		}

		if(options.error){
			XHR.addEventListener('error', options.error, false);
			XHR.addEventListener('abort', options.error, false);
		}

		XHR.open('POST', options.url, true);

		/* AS DATA */
		if(options.data){

			XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");

			for(x in options.data){
				strPost.push(encodeURIComponent(x)+'='+encodeURIComponent(options.data[x]));
			}

			stPost = strPost.join('&').replace(r20, "+");
			XHR.send(stPost);

		/* AS FORM */
		}else if(options.formId){

			var form = a.id(options.formId);
			var frm = new FormData();

			var inputs = form.getElementsByTagName('input');
			var tInputs = inputs.length;

			for(x = 0; x < tInputs; x++){
				if(inputs[x].getAttribute('name') && !inputs[x].getAttribute('disabled')){

					/* INPUT FILE */
					if(inputs[x].type === 'file'){
						
						var tFiles = inputs[x].files.length;

						if(tFiles > 0){
							for(z = 0; z < tFiles; z++){
								var fle = inputs[x].files[z];
								frm.append(inputs[x].getAttribute('name'), fle);
							}
						}

					/* RADIO AND CHECKBOX */
					}else if(inputs[x].type === 'radio' || inputs[x].type === 'checkbox'){
						if(inputs[x].checked === true){
							frm.append(inputs[x].getAttribute('name'), inputs[x].value);
						}
					/* OTHERS INPUTS FIELDS */
					}else{
						frm.append(inputs[x].getAttribute('name'), inputs[x].value);
					}
				}
			}

			var textareas = form.getElementsByTagName('textarea');
			var tTextareas = textareas.length;

			for(x = 0; x < tTextareas; x++){
				if(textareas[x].getAttribute('name') && !textareas[x].getAttribute('disabled')){
					frm.append(textareas[x].getAttribute('name'), textareas[x].value);
				}
			}

			var selects = form.getElementsByTagName('select');
			var tSelects = selects.length;

			for(x = 0; x < tSelects; x++){
				if(selects[x].getAttribute('name') && !selects[x].getAttribute('disabled')){
					frm.append(selects[x].getAttribute('name'), selects[x].value);
				}
			}

			XHR.send(frm);

		}

		XHR.onreadystatechange = function(){

			if(XHR.readyState === 4 && (XHR.status === 200 || XHR.status === 304)){
				if(typeof(options.dataType) !== 'undefined'){

					if(options.dataType === 'JSON' || options.dataType === 'json'){
						jsonStr = XHR.responseText;


						var TesteText = a.testJSON(XHR.responseText);
						jsonStr = eval("("+XHR.responseText+")");
	
						if(typeof(options.done) === 'function'){
							options.done(jsonStr);
						}
					}

				}else{
					if (typeof(options.done) === 'function'){
						options.done(XHR.responseText);
					}
				}
			}

			if(XHR.readyState === 4 && XHR.status === 404){
				if(typeof(options.error) === 'function'){
					options.error(XHR);
				}
			}

			if(XHR.readyState === 4 && XHR.status === 500){
				if(typeof(options.error) === 'function'){
					options.error(XHR);
				}
			}
		}

		return XHR;
	},
};