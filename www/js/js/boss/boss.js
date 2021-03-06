/* IE BUGS */
(function () {
	if(navigator.userAgent.match(/MSIE 8\.|MSIE 7\.|MSIE 6\.|MSIE 5\./)){
		window.location.href = '/navegador.html';
	}
	if(navigator.userAgent.match(/MSIE 9\.0/)){
		if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
			Object.defineProperty(HTMLElement.prototype, 'classList', {
				get: function() {
					var self = this;
					function update(fn) {
						return function(value) {
						var classes = self.className.split(/\s+/),
						index = classes.indexOf(value);

						fn(classes, index, value);
						self.className = classes.join(" ");
						}
					}

					var ret = {
						add: update(function(classes, index, value) {
							~index || classes.push(value);
						}),

						remove: update(function(classes, index) {
							~index && classes.splice(index, 1);
						}),

						toggle: update(function(classes, index, value) {
							~index ? classes.splice(index, 1) : classes.push(value);
						}),

						contains: function(value) {
							return !!~self.className.split(/\s+/).indexOf(value);
						},

						item: function(i) {
							return self.className.split(/\s+/)[i] || null;
						}
					};

					Object.defineProperty(ret, 'length', {
						get: function() {
							return self.className.split(/\s+/).length;
						}
					});

					return ret;
				}
			});

			var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

			function InvalidCharacterError(message) {
				this.message = message;
			}
			InvalidCharacterError.prototype = new Error;
			InvalidCharacterError.prototype.name = 'InvalidCharacterError';

			object.btoa || (
				object.btoa = function (input) {
				var str = String(input);
				for (var block, charCode, idx = 0, map = chars, output = ''; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)){
					charCode = str.charCodeAt(idx += 3/4);
					if (charCode > 0xFF) {
						throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
					}
					block = block << 8 | charCode;
				}
				return output;
			});
		}
	}
}());

(function(){

	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if(!window.requestAnimationFrame){
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if(!window.cancelAnimationFrame){
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

/* VAR TO LOCK CHANGE PAGE */
var lockChangePage = false;

/* VAR TO LOOK EXIT PAGE, CLOSE BROWSER OR CLOSE TAB */
var lockClosePage = false;

var touchEvents = false;

/* EVENTOS DE ESCUTA APENAS UMA VEZ */
var fakescroll;
var fakeresize;

if(Event in window){
	fakescroll = new Event('fakescroll');
	fakeresize = new Event('fakeresize');
}else if(document.createEvent){

	fakescroll = document.createEvent('Event');
	fakescroll.initEvent('fakescroll', true, false);

	fakeresize = document.createEvent('Event');
	fakeresize.initEvent('fakeresize', true, false);
}

window.ancoraativa = 0;
window.Boss = {
	smoothScroll: {
		easeInOutQuart: function(time, from, distance, dutation){

			if ((time /= dutation / 2) < 1){

				return distance / 2 * time * time * time * time + from;
			}

			return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
		},
		getScrollTopByHref: function(element) {
			var id = element.getAttribute('href');
			return document.querySelector(id).offsetTop;
		},
		scrollToPosition: function(to, dutation) {
			Boss.smoothScroll.smoothScrollTo(0, to, dutation);
		},
		scrollToIdOnClick: function(event, dutation) {

			if(ancoraativa !== 2){

				ancoraativa = 1;

				if(ancoraativa === 1){
					event.preventDefault();
					closeMenu();
					var to = Boss.smoothScroll.getScrollTopByHref(event.currentTarget);
					Boss.smoothScroll.scrollToPosition(to, dutation);
				}
			}
		},
		smoothScrollTo: function(endX, endY, dutation = 2000){

			var startY = window.scrollY || window.pageYOffset;
			var distanceY = endY - startY;
			var startTime = new Date().getTime();

			var timer = setInterval(function () {

				var time = new Date().getTime() - startTime;
				var newY = Boss.smoothScroll.easeInOutQuart(time, startY, distanceY, dutation);

				if (time >= dutation || ancoraativa == 3){

					clearInterval(timer);
					ancoraativa = 0;
				}

				window.scroll(0, (newY - 90));
			}, 1000 / 60);
		},
		init: function(){
			
  			dutation = arguments.length > 0 ? arguments[0] : 2000;
			if(arguments.length > 1) throw new Error("Too many arguments! Expected 1.");

			var menuItems = document.querySelectorAll('a[href^="#"]');

			menuItems.forEach(function (item) {

				Boss.evts.add('click', item, function(evt){
					Boss.smoothScroll.scrollToIdOnClick(evt, dutation);
				});
			});
		},
		go: function(e, destino){

			if(ancoraativa !== 2){

				ancoraativa = 1;

				if(ancoraativa === 1){
					ancoraativa = 2;
					var yorigem = e.offsetParent.offsetTop;
					var ydestino = Boss.getById(destino).offsetTop;

					Boss.smoothScroll.smoothScrollTo(yorigem, ydestino);
				}
			}
		},
		goTop: function(){

  			dutation = arguments.length > 0 ? arguments[0] : 400;
			if(arguments.length > 1){
				throw new Error("Você não pode passar mais de um parâmetro nesta função! -_-");
			}

			if(ancoraativa !== 2){

				ancoraativa = 1;

				if(ancoraativa === 1){
					var yorigem = window.scrollY;
					ancoraativa = 2;
					var ydestino = Boss.getById('nav').offsetTop;
					Boss.smoothScroll.smoothScrollTo(yorigem, ydestino, dutation);
				}
			}
		}
	},
	/* TOUCH EVENT */
	evtTouch: function(){
		if (window.navigator.msPointerEnabled) {
			return 'MSPointerDown';
		}else if('ontouchstart' in window && touchEvents === true){
			return 'touchstart';
		}else{
			return 'mousedown';
		}
	},
	/* UP AND END TOUCH EVENT */
	evtTouchUp: function(){
		if (window.navigator.msPointerEnabled) {
			return 'MSPointerUp';
		}else if('ontouchend' in window && touchEvents === true){
			return 'touchend';
		}else{
			return 'mouseup';
		}
	},
	/* TOUCH MOVE EVENT */
	evtTouchMove: function(){
		if('ontouchmove' in window && touchEvents === true){
			return 'touchmove';
		}else{
			return 'mousemove';
		}
	},
	dialog: {
		open: function(obj){

			var c = document.createElement('button');
			c.classList.add('boss-dialog-close');
			c.setAttribute('id', 'boss-dialog-close');
			c.innerHTML = '<i class="i-close" aria-hidden="true"></i>';

			obj.html = obj.html.split('{{dialogs}}').join('');

			if(!Boss.getById('boss-dialog')){
				var dialog = document.createElement('div');
				dialog.setAttribute('id', 'boss-dialog');

				var area = document.createElement('div');
				area.classList.add('boss-dialog-area');
				area.innerHTML = obj.html;

				if(obj.close){
					area.appendChild(c);
				}

				dialog.appendChild(area);
				document.body.appendChild(dialog);

			}else{

				var dialog = Boss.getById('boss-dialog');
				dialog.classList.remove('hidden');
				dialog.innerHTML = '';

				var area = document.createElement('div');
				area.classList.add('boss-dialog-area');
				area.innerHTML = obj.html;

				if(obj.close){
					area.appendChild(c);
				}

				dialog.appendChild(area);

			}

			Boss.delay(function(){
				var scripts = dialog.getElementsByTagName('script');
				for(x in scripts){
					eval(scripts[x].innerHTML);
				}
			}, 10);

			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('boss-dialog-close'), function(evts){

				Boss.dialog.close();

				if(obj.callBack && typeof(obj.callBack) === 'function'){
					obj.callBack();
				}
			});
		},
		close: function(){

			if(Boss.getById('boss-dialog')){

				unlock();
				var dialog = Boss.getById('boss-dialog');
				dialog.classList.add('hidden');
				dialog.innerHTML = '';
			}
		}
	},
	selectMultiple: {
		data: {},
		setValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var selct = Boss.getById(selctString);

			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var checkeds = 0;

			for(x = 0; x < tlines; x++){
				if(lines[x].value === val){
					lines[x].selected = true;
					Boss.getById('id-'+elemtString+'-'+x).checked = true;
				}

				if(lines[x].value !== '' && lines[x].selected === true){
					checkeds = checkeds + 1;
				}
			}

			if(checkeds < 1){

				for(x = 0; x < tlines; x++){

					if(lines[x].value === ''){
						lines[x].selected = true;
						Boss.getById('id-'+elemtString+'-').checked = true;
					}
				}

			}else{

				for(x = 0; x < tlines; x++){
					if(lines[x].value === ''){
						lines[x].selected = false;
						Boss.getById('id-'+elemtString+'-').checked = false;
					}
				}
			}
		},
		unsetValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var selct = Boss.getById(selctString);

			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var checkeds = 0;

			for(x = 0; x < tlines; x++){
				if(lines[x].value === val){
					lines[x].selected = false;
					Boss.getById('id-'+elemtString+'-'+x).checked = false;
				}

				if(lines[x].value !== '' && lines[x].selected === true){
					checkeds = checkeds + 1;
				}
			}

			if(checkeds < 1){

				for(x = 0; x < tlines; x++){

					if(lines[x].value === ''){
						lines[x].selected = true;
						Boss.getById('id-'+elemtString+'-').checked = true;
					}
				}

			}else{

				for(x = 0; x < tlines; x++){
					if(lines[x].value === ''){
						lines[x].selected = false;
						Boss.getById('id-'+elemtString+'-').checked = false;
					}
				}
			}

		},
		init: function(elemtString, selctString, confObj){

			var initShow = false;
			var all = 'all';
			var add = 'add';
			var addXHR = false;
			var clear = 'clear';
			var ok = 'ok';
			var placeholder = 'search';

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			if(typeof(confObj) !== 'object'){
				console.warn('Hey stupid, the thirty parameter need be a object.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			if(typeof(selctString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var selct = Boss.getById(selctString);
			selct.setAttribute('tabindex', '-1');
			if(selct.nodeName !== 'SELECT' && selct.nodeName !== 'select'){
				console.warn('Hey stupid, the second parameter need be a select field.');
				return false;
			}

			/* FIX TABINDEX IN THE COMPONENT */
			elemt.setAttribute('tabindex', '0');

			/* CALL CHANGE */
			if(confObj.callChange){

				Boss.evts.add('change', elemt, function(evts){
					var targt = Boss.targt(evts);
					if(targt === elemt){
						confObj.callChange(evts);
					}
				});
			}

			if(confObj.initShow){
				initShow = confObj.initShow;
			}
			if(confObj.all){
				all = confObj.all;
			}

			if(confObj.addXHR){
				addXHR = true;
			}

			if(confObj.clear){
				clear = confObj.clear;
			}
			if(confObj.ok){
				ok = confObj.ok;
			}
			if(confObj.placeholder){
				placeholder = confObj.placeholder;
			}

			/* RENDER HTML OF COMPONENT */
			var mask = '<div id="showhide-'+elemtString+'" class="boss-js-select-label no-select"><div>'+confObj.label+' <span class="boss-showhide-triangle animation"></span></div></div>';

			if(initShow === true){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show">';
			}
			if(initShow === false){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show hidden">';
			}

			/* MASK OF THIS CONPONENT */
			mask += '	<div class="boss-js-select-search"><div><input tabindex="-1" class="boss-js-select-search-input" id="search-'+elemtString+'" type="text" placeholder="'+placeholder+'" /><span class="hidden" id="search-clear-'+elemtString+'">+</span></div></div>';
			mask += '	<div class="boss-js-select-check-all no-select">';
			mask += '		<input type="checkbox" tabindex="-1" class="boss-comp-checkbox" id="all-'+elemtString+'"><label for="all-'+elemtString+'"><span class="boss-comp-checkbox-span"></span>'+all+'</label>';
			mask += '		<div id="ok-'+elemtString+'" class="button">'+ok+'</div>';
			mask += '		<div id="clear-'+elemtString+'" class="button">'+clear+'</div>';
			if(addXHR !== false){
				mask += '		<div id="add-'+elemtString+'" class="hidden button">'+add+'</div>';
			}
			mask += '	</div>';
			mask += '	<div id="list-'+elemtString+'" class="boss-js-select-list no-select" tabindex="-1">';
			mask += '		<ul></ul>';
			mask += '	</div>';
			mask += '	<div class="boss-js-select-status" id="status-'+elemtString+'">status</div>';
			mask += '</div>';

			var tempElemt = document.createElement('div');
			tempElemt.innerHTML = mask;

			elemt.appendChild(tempElemt);

			/* RENDER LIST */
			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var tcheckd = 0;

			for(x = 0; x < tlines; x++){

				var li = document.createElement('li');
				li.setAttribute('data-value', lines[x].innerHTML);
				var id = 'id-'+elemtString+'-'+lines[x].value;
				var checkd = '';
				if(lines[x].selected){
					checkd = 'checked';
					tcheckd = tcheckd + 1;
				}
				li.innerHTML = '<input tabindex="-1" '+checkd+' type="checkbox" class="boss-comp-checkbox" value="'+lines[x].value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-checkbox-span"></span>'+lines[x].innerHTML+'</label>';
				ul.appendChild(li);

			}

			var stats = Boss.getById('status-'+elemtString);
			stats.textContent = (tlines - 1)+' linhas, '+tcheckd+' marcados';

			/* CLEAR SEARCH */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('search-clear-'+elemtString), function(evnt){
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			});

			/* SEARCH EVENTs */
			Boss.evts.add('keyup', Boss.getById('search-'+elemtString), function(evnt){
				/* TIME DELAY AFTER LAST DIGIT PRESSED */
				Boss.delayPersistent2(function(){

					var search = Boss.targt(evnt);
					var lis = ul.getElementsByTagName('li');
					var tlis = lis.length;
					var exp = new RegExp(search.value, 'i');

					var found = 0;

					for(x = 0; x < tlis; x++){
						if(typeof(lis[x].childNodes) !== 'undefined'){
							var tx = lis[x].getAttribute('data-value');
							if(exp.test(tx)){
								lis[x].classList.remove('hidden');
								found = found + 1;
							}else{
								lis[x].classList.add('hidden');
							}
						}
					}

					if(search.value.length > 1){
						if(addXHR !== false){
							Boss.getById('add-'+elemtString).classList.remove('hidden');
						}
						Boss.getById('search-clear-'+elemtString).classList.remove('hidden');
					}else{
						if(addXHR !== false){
							Boss.getById('add-'+elemtString).classList.add('hidden');
						}
						if(Boss.getById('search-clear-'+elemtString)){
							Boss.getById('search-clear-'+elemtString).classList.add('hidden');
						}
					}

				}, 650, 'search-'+elemtString);
			});

			/* CHECKBOX EVENTs */
			Boss.evts.add('change', Boss.getById(elemtString), function(evnt){

				Boss.delay(function(){

					var all = Boss.getById('all-'+elemtString);
					var checkboxs = ul.getElementsByTagName('input');
					var lengt = checkboxs.length;
					var checkeds = 0;
					var selct = Boss.getById(selctString);
					
					for(x = 0; x < lengt; x++){
						/* IGNORE THE FIRST */
						if(x > 0){
							if(checkboxs[x].checked === true){
								checkeds = checkeds + 1;
							}
						}
						if(checkboxs[x].checked === true){
							selct.options[x].selected = true;
						}else{
							selct.options[x].selected = false;
						}
					}

					var stats = Boss.getById('status-'+elemtString);
					stats.textContent = lengt+' linhas, '+checkeds+' marcados';

					if((lengt - 1) <= checkeds){
						all.checked = true;
					}else{
						all.checked = false;
						/* FORCE THE VALUE="" ELEMENT KEEP CHECKED */
					}

					if(checkeds < 1){
						checkboxs[0].checked = true;
					}else{
						checkboxs[0].checked = false;
					}

				}, 10);

			});

			/* ALL BUTTON */
			Boss.evts.add('change', Boss.getById('all-'+elemtString), function(evnt){

				var all = Boss.targt(evnt);

				var checkboxs = ul.getElementsByTagName('input');
				var tcheckboxs = checkboxs.length;
				var selct = Boss.getById(selctString);

				for(x = 0; x < tcheckboxs; x++){
					if(typeof(checkboxs[x].childNodes) !== 'undefined'){

						if(all.checked === true){
							if(selct.options[x].value == ''){
								checkboxs[x].checked = false;
								selct.options[x].selected = false;
							}else{
								checkboxs[x].checked = true;
								selct.options[x].selected = true;
							}
						}else{
							if(selct.options[x].value == ''){
								checkboxs[x].checked = true;
								selct.options[x].selected = true;
							}else{
								checkboxs[x].checked = false;
								selct.options[x].selected = false;
							}
						}
					}
				}
			});

			/* CLEAR BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('clear-'+elemtString), function(evnt){

				var checkboxs = ul.getElementsByTagName('input');
				var tcheckboxs = checkboxs.length;
				var selct = Boss.getById(selctString);

				var all = Boss.getById('all-'+elemtString);
				all.checked = false;

				for(x = 0; x < tcheckboxs; x++){
					if(typeof(checkboxs[x].childNodes) !== 'undefined'){

						if(checkboxs[x].value == ''){
							checkboxs[x].checked = true;
							selct.options[x].selected = true;
						}else{
							checkboxs[x].checked = false;
							selct.options[x].selected = false;
						}
					}
				}
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			});

			/* ADD BUTTON */
			if(addXHR !== false){
				if(confObj.addXHR){
					Boss.evts.add(Boss.evtTouchUp(), Boss.getById('add-'+elemtString), function(evnt){
						
						Boss.getById('add-'+elemtString).classList.add('hidden');
						Boss.ajax({
							url: confObj.addXHR.url,
							data: {'value': Boss.getById('search-'+elemtString).value, 'name': elemtString},
							dataType: 'json',
							done: function(a){
								if(a.stats === true){

									var li = document.createElement('li');
									li.setAttribute('data-value', a.label);
									var id = 'id-'+elemtString+'-'+a.value;

									li.innerHTML = '<input tabindex="-1" checked type="checkbox" class="boss-comp-checkbox" value="'+a.value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-checkbox-span"></span>'+a.label+'</label>';
									ul.appendChild(li);

									var opt = document.createElement('option');
									opt.value = a.value;
									opt.setAttribute('selected', 'selected');
									opt.innerHTML = a.label;

									selct.appendChild(opt);

									Boss.getById('search-'+elemtString).value = '';

									Boss.trigger('keyup', Boss.getById('search-'+elemtString));

								}
								if(a.stats === false){

									var stats = Boss.getById('status-'+elemtString);
									stats.innerHTML = '<span class="red">'+a.error+'</span>';

								}
							}
						});
					});
				}
			}

			/* OK BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('ok-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);

				elemtShowHide.classList.add('hidden');
				spn.classList.remove('rotate-180');

				Boss.trigger('change', Boss.getById(elemtString));
				Boss.trigger('blur', Boss.getById(elemtString));
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));

			});

			/* ACTION IN CONPONENT */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('showhide-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				
				/* FIX BUG AT FIRST FUCOS */
				if(elemt.getAttribute('data-last-evt') === 'focus'){
					elemt.setAttribute('data-last-evt', 'up');
				}else{
					if(elemtShowHide.classList.contains('hidden')){
						elemtShowHide.classList.remove('hidden');
						spn.classList.add('rotate-180');
					}else{
						elemtShowHide.classList.add('hidden');
						spn.classList.remove('rotate-180');
					}
				}
			});

			/* BLUR */
			Boss.evts.add('blur', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'blur');
				var spn = elemt.getElementsByTagName('span')[0];


				/* IF THE BLUR EVENT WAS HAPPENED OUT THE COMPONENT */
				if(Boss.focusOut(elemt, evts.relatedTarget) === false){

					Boss.getById('target-showhide-'+elemtString).classList.add('hidden');
					spn.classList.remove('rotate-180');
				}

			});

			/* FOCUS */
			Boss.evts.add('focus', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'focus');

				var spn = elemt.getElementsByTagName('span')[0];

				Boss.getById('target-showhide-'+elemtString).classList.remove('hidden');
				spn.classList.add('rotate-180');

			});
		}
	},
	selectUnique: {
		data: {},
		setValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var rads = Boss.getName(elemtString);
			var labl = Boss.getById('label-'+elemtString);

			var selct = Boss.getById(selctString);
			var tlines = selct.options.length;

			for(x = 0; x < tlines; x++){
				if(selct.options[x].value == val){
					selct.options[x].selected = true;
					rads[x].checked = true;
					labl.textContent = selct.options[x].textContent;
				}else{
					rads[x].checked = false;
				}
			}
		},
		unsetValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var selct = Boss.getById(selctString);
			var labl = Boss.getById('label-'+elemtString);

			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var checkeds = 0;

			for(x = 0; x < tlines; x++){
				if(lines[x].value === val){
					lines[x].selected = false;
					Boss.getById('id-'+elemtString+'-'+x).checked = false;
				}

				if(lines[x].value !== '' && lines[x].selected === true){
					checkeds = checkeds + 1;
				}
			}

			if(checkeds < 1){

				for(x = 0; x < tlines; x++){

					if(lines[x].value === ''){
						lines[x].selected = true;
						Boss.getById('id-'+elemtString+'-').checked = true;
					}
				}

			}else{

				for(x = 0; x < tlines; x++){
					if(lines[x].value === ''){
						lines[x].selected = false;
						Boss.getById('id-'+elemtString+'-').checked = false;
					}
				}
			}

			labl.textContent = selct.options[selct.selectedIndex].textContent;

		},
		init: function(elemtString, selctString, confObj){

			var initShow = false;
			var add = 'add';
			var addXHR = false;
			var searchXHR = false;
			var clear = 'clear';
			var ok = 'ok';
			var placeholder = 'search';

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			if(typeof(confObj) !== 'object'){
				console.warn('Hey stupid, the thirty parameter need be a object.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			if(typeof(selctString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var selct = Boss.getById(selctString);
			selct.setAttribute('tabindex', '-1');
			if(selct.nodeName !== 'SELECT' && selct.nodeName !== 'select'){
				console.warn('Hey stupid, the second parameter need be a select field.');
				return false;
			}

			/* FIX TABINDEX IN THE COMPONENT */
			elemt.setAttribute('tabindex', '0');

			/* CALL CHANGE */
			if(confObj.callChange){

				Boss.evts.add('change', elemt, function(evts){
					var targt = Boss.targt(evts);
					if(targt === elemt){
						confObj.callChange(evts);
					}
				});
			}
			if(confObj.initShow){
				initShow = confObj.initShow;
			}
			if(confObj.addXHR){
				addXHR = true;
			}
			if(confObj.searchXHR){
				searchXHR = true;
			}
			if(confObj.clear){
				clear = confObj.clear;
			}
			if(confObj.ok){
				ok = confObj.ok;
			}
			if(confObj.placeholder){
				placeholder = confObj.placeholder;
			}

			/* RENDER HTML OF COMPONENT */
			var mask = '<div id="showhide-'+elemtString+'" class="boss-js-select-label no-select"><div><div id="label-'+elemtString+'"></div> <span class="boss-showhide-triangle animation"></span></div></div>';

			if(initShow === true){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show">';
			}
			if(initShow === false){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show hidden">';
			}

			/* MASK OF THIS CONPONENT */
			mask += '	<div class="boss-js-select-search"><div><input tabindex="-1" class="boss-js-select-search-input" id="search-'+elemtString+'" type="text" placeholder="'+placeholder+'" /><span class="hidden" id="search-clear-'+elemtString+'">+</span></div></div>';
			mask += '	<div class="boss-js-select-check-all no-select">';
			mask += '		<div id="ok-'+elemtString+'" class="button">'+ok+'</div>';
			mask += '		<div id="clear-'+elemtString+'" class="button">'+clear+'</div>';
			if(addXHR !== false){
				mask += '		<div id="add-'+elemtString+'" class="hidden button">'+add+'</div>';
			}
			mask += '	</div>';
			mask += '	<div id="list-'+elemtString+'" class="boss-js-select-list no-select" tabindex="-1">';
			mask += '		<ul></ul>';
			mask += '	</div>';
			mask += '	<div class="boss-js-select-status" id="status-'+elemtString+'">status</div>';
			mask += '</div>';

			var tempElemt = document.createElement('div');
			tempElemt.innerHTML = mask;

			elemt.appendChild(tempElemt);

			/* RENDER LIST */
			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var tcheckd = 0;

			for(x = 0; x < tlines; x++){

				var li = document.createElement('li');
				li.setAttribute('data-value', lines[x].innerHTML);
				var id = 'id-'+elemtString+'-'+lines[x].value;
				var checkd = '';
				if(lines[x].selected){
					checkd = 'checked';
					tcheckd = tcheckd + 1;
				}
				li.innerHTML = '<input tabindex="-1" '+checkd+' type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+lines[x].value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+lines[x].innerHTML+'</label>';
				ul.appendChild(li);

			}

			/* LABEL WRITE */
			var labl = Boss.getById('label-'+elemtString);
			labl.textContent = selct.options[selct.selectedIndex].textContent;

			var stats = Boss.getById('status-'+elemtString);
			stats.textContent = (tlines - 1)+' linhas, '+tcheckd+' marcados';

			/* CLEAR SEARCH */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('search-clear-'+elemtString), function(evnt){
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			});

			/* SEARCH EVENTs */
			Boss.evts.add('keyup', Boss.getById('search-'+elemtString), function(evnt){
				/* TIME DELAY AFTER LAST DIGIT PRESSED */
				Boss.delayPersistent2(function(){

					var search = Boss.targt(evnt);
					var lis = ul.getElementsByTagName('li');
					var tlis = lis.length;
					var exp = new RegExp(search.value, 'i');

					
					if(searchXHR === true && search.value.length > 2){
						Boss.ajax({
							'url': confObj.searchXHR,
							'data': {'label': search.value},
							'dataType': 'json',
							'done': function(rtn){

								var lengt = Object.keys(rtn).length;

								var saveLabel = '';
								var saveValue = '';
								/* SAVE SELECTED */
								if(selct.value !== ''){
									saveLabel = selct.options[selct.selectedIndex].textContent;
									saveValue = selct.value;
								}

								/* REMOVE OPTIONS AND LIs */
								ul.innerHTML = '<li data-value=" - - "><input tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span> - - </label></li>';
								selct.innerHTML = '<option value=""> - - </option>';
								
								/* INSERT SAVED SELECTED */
								if(saveLabel.value !== '' && saveValue !== ''){

									var li = document.createElement('li');
									li.setAttribute('data-value', saveLabel);
									var id = 'id-'+elemtString+'-'+saveValue;

									li.innerHTML = '<input checked tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+saveValue+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+saveLabel+'</label>';
									ul.appendChild(li);

									var opt = document.createElement('option');
									opt.value = saveValue;
									opt.setAttribute('selected', 'selected');
									opt.innerHTML = saveLabel;

									selct.appendChild(opt);
								}

								/* SAVE found */
								for(x = 0; x < lengt; x++){

									if(saveValue != rtn[x].value){

										var li = document.createElement('li');
										li.setAttribute('data-value', rtn[x].label);
										var id = 'id-'+elemtString+'-'+rtn[x].value;

										li.innerHTML = '<input tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+rtn[x].value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+rtn[x].label+'</label>';
										ul.appendChild(li);

										var opt = document.createElement('option');
										opt.value = rtn[x].value;
										opt.innerHTML = rtn[x].label;

										selct.appendChild(opt);

									}
								}
							}
						});
					}else{
						var found = 0;
						for(x = 0; x < tlis; x++){
							if(typeof(lis[x].childNodes) !== 'undefined'){
								var tx = lis[x].getAttribute('data-value');
								if(exp.test(tx)){
									lis[x].classList.remove('hidden');
									found = found + 1;
								}else{
									lis[x].classList.add('hidden');
								}
							}
						}

						if(search.value.length > 1){
							if(addXHR !== false){
								Boss.getById('add-'+elemtString).classList.remove('hidden');
							}
							Boss.getById('search-clear-'+elemtString).classList.remove('hidden');
						}else{
							if(addXHR !== false){
								Boss.getById('add-'+elemtString).classList.add('hidden');
							}

							if(Boss.getById('search-clear-'+elemtString)){
								Boss.getById('search-clear-'+elemtString).classList.add('hidden');
							}
						}
					}

				}, 650, 'search-'+elemtString);
			});

			/* CHECKBOX EVENTs */
			Boss.evts.add('change', Boss.getById(elemtString), function(evnt){

				Boss.delay(function(){

					var checkboxs = ul.getElementsByTagName('input');
					var lengt = checkboxs.length;
					var checkeds = 0;
					var selct = Boss.getById(selctString);
					var labl = Boss.getById('label-'+elemtString);
					
					for(x = 0; x < lengt; x++){
						/* IGNORE THE FIRST */
						if(x > 0){
							if(checkboxs[x].checked === true){
								checkeds = checkeds + 1;
							}
						}
						if(checkboxs[x].checked === true){
							selct.options[x].selected = true;
						}else{
							selct.options[x].selected = false;
						}
					}

					var stats = Boss.getById('status-'+elemtString);
					stats.textContent = lengt+' linhas, '+checkeds+' marcados';

					if(checkeds < 1){
						checkboxs[0].checked = true;
					}else{
						checkboxs[0].checked = false;
					}

					labl.textContent = selct.options[selct.selectedIndex].textContent;

				}, 10);

			});

			/* CLEAR BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('clear-'+elemtString), function(evnt){

				var checkboxs = ul.getElementsByTagName('input');
				var tcheckboxs = checkboxs.length;
				var selct = Boss.getById(selctString);
				var labl = Boss.getById('label-'+elemtString);

				for(x = 0; x < tcheckboxs; x++){
					if(typeof(checkboxs[x].childNodes) !== 'undefined'){

						if(checkboxs[x].value == ''){
							checkboxs[x].checked = true;
							selct.options[x].selected = true;
						}else{
							checkboxs[x].checked = false;
							selct.options[x].selected = false;
						}
					}
				}
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			
				labl.textContent = selct.options[selct.selectedIndex].textContent;
			});

			/* ADD BUTTON */
			if(addXHR !== false){
				if(confObj.addXHR){
					Boss.evts.add(Boss.evtTouchUp(), Boss.getById('add-'+elemtString), function(evnt){
						
						Boss.getById('add-'+elemtString).classList.add('hidden');
						Boss.ajax({
							url: confObj.addXHR.url,
							data: {'value': Boss.getById('search-'+elemtString).value, 'name': elemtString},
							dataType: 'json',
							done: function(a){
								if(a.stats === true){

									var li = document.createElement('li');
									li.setAttribute('data-value', a.label);
									var id = 'id-'+elemtString+'-'+a.value;

									li.innerHTML = '<input checked tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+a.value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+a.label+'</label>';
									ul.appendChild(li);

									var opt = document.createElement('option');
									opt.value = a.value;
									opt.setAttribute('selected', 'selected');
									opt.innerHTML = a.label;

									selct.appendChild(opt);

									Boss.getById('search-'+elemtString).value = '';

									Boss.trigger('keyup', Boss.getById('search-'+elemtString));

								}
								if(a.stats === false){

									var stats = Boss.getById('status-'+elemtString);
									stats.innerHTML = '<span class="red">'+a.error+'</span>';

								}
							}
						});
					});
				}
			}

			/* OK BUTTON */
			Boss.evts.add('click', Boss.getById('ok-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				var labl = Boss.getById('label-'+elemtString);

				elemtShowHide.classList.add('hidden');
				spn.classList.remove('rotate-180');

				Boss.trigger('change', Boss.getById(elemtString));
				Boss.trigger('change', Boss.getById(selctString));
				Boss.trigger('blur', Boss.getById(elemtString));
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			
				labl.textContent = selct.options[selct.selectedIndex].textContent;

			});

			/* DBLCLICK CHECKBOX */
			Boss.evts.add('dblclick', ul, function(evnt){
				Boss.delay(function(){
					Boss.trigger('click', Boss.getById('ok-'+elemtString));
				}, 10);
			});

			/* ACTION IN CONPONENT */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('showhide-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				
				/* FIX BUG AT FIRST FUCOS */
				if(elemt.getAttribute('data-last-evt') === 'focus'){
					elemt.setAttribute('data-last-evt', 'up');
				}else{
					if(elemtShowHide.classList.contains('hidden')){
						elemtShowHide.classList.remove('hidden');
						spn.classList.add('rotate-180');
					}else{
						elemtShowHide.classList.add('hidden');
						spn.classList.remove('rotate-180');
					}
				}
			});

			/* BLUR */
			Boss.evts.add('blur', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'blur');
				var spn = elemt.getElementsByTagName('span')[0];

				/* IF THE BLUR EVENT WAS HAPPENED OUT THE COMPONENT */
				if(Boss.focusOut(elemt, evts.relatedTarget) === false){

					Boss.getById('target-showhide-'+elemtString).classList.add('hidden');
					spn.classList.remove('rotate-180');
				}

			});

			/* FOCUS */
			Boss.evts.add('focus', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'focus');

				var spn = elemt.getElementsByTagName('span')[0];

				Boss.getById('target-showhide-'+elemtString).classList.remove('hidden');
				spn.classList.add('rotate-180');

			});
		}
	},
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
	getById: function(element){
		return document.getElementById(element);
	},
	getName: function(element){
		return document.getElementsByName(element);
	},
	remover: function(el){
		el.parentNode.removeChild(el);
	},
	targt: function (e) {
		e = e.target ? e : window.event;
		return e.target || e.srcElement;
	},
	inArray: function(st, arr){
		var lengt = arr.length;
		var x;
		for(x = 0; x < lengt; x++){
			if(arr[x] === st){
				return true;
				break;
			}
		}
		return false;
	},
	isChild: function(parent, child) {
		if(child.parentNode){
			var node = child.parentNode;
			while(node !== null){
				if(node === parent){
					return true;
				}
				node = node.parentNode;
			}
		}
		return false;
	},
	positionAtTop: function(el){
		posicao = 0;
		if(el.offsetParent){
			do{
				posicao += el.offsetTop;
			} while (el = el.offsetParent);
		}
		return posicao;
	},
	insertAfter: function(newElement, targetElement){
		var parent = targetElement.parentNode;
		if(parent.lastchild == targetElement) {
			parent.appendChild(newElement);
		}else{
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	},
	getUri: function(){
		var lca = window.location.href.split('?');
		var getUri = {};

		if(typeof(lca[1]) !== 'undefined'){
			var parts = lca[1].split('&');
			for (var i = 0; i < parts.length; i++) {
				var temp = parts[i].split('=');
				getUri[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
			}
		}
		return getUri;
	},
	focusOut: function(parnt, chld){
		if(chld){
			var nod = chld.parentNode;
			while (nod !== null) {
				if (nod === parnt) {
					return true;
				}
				nod = nod.parentNode;
			}
			return false;
		}else{
			return false;
		}
	},
	toBytes: function(lengt){
		if(lengt < 1024){
			var siz = lengt.toFixed(1)+'B';
		}else if(lengt >= 1024 && lengt < 1048576){
			var siz = lengt / 1024;
			var siz = siz.toFixed(1)+'KB';
		}else{
			var siz = lengt / 1048576;
			var siz = siz.toFixed(1)+'MB';
		}
		return siz;
	},
	serializer: function(formid){
		if(this.getById(formid)){
			var form = this.getById(formid);
			var inputs =  form.getElementsByTagName('input');
			var selects = form.getElementsByTagName('select');
			var textareas = form.getElementsByTagName('textarea');
			ti = inputs.length;
			ts = selects.length;
			tt = textareas.length;
			serializado = {};
			for(it = 0; it < ti; it++){
				if(inputs[it].name && !inputs[it].getAttribute('disabled')){
					if(inputs[it].getAttribute('type') === 'radio' || inputs[it].getAttribute('type') === 'checkbox'){
						if(inputs[it].checked === true){
							serializado[inputs[it].getAttribute('name')] = inputs[it].value;
						}
					}else{
						serializado[inputs[it].getAttribute('name')] = inputs[it].value;
					}
				}
			}
			for(st = 0; st < ts; st++){
				if(selects[st].getAttribute('name') && !selects[st].getAttribute('disabled')){
					serializado[selects[st].getAttribute('name')] = selects[st].value;
				}
			}
			for(t = 0; t < tt; t++){
				if(textareas[t].getAttribute('name') && !textareas[t].getAttribute('disabled')){
					serializado[textareas[t].getAttribute('name')] = textareas[t].value;
				}
			}
			return serializado;
		}else{
			return false;
		}
	},
	screensizes: function(){

		var orient;

		if(window.screen.mozOrientation){
			orient = window.screen.mozOrientation;
		}else if(window.screen.msOrientation){
			orient = window.screen.msOrientation
		}else if(window.screen.orientation){
			if(window.screen.orientation.type){
				orient = window.screen.orientation.type;
			}else{
				orient = window.screen.orientation;
			}
		}else{
			if(window.screen.height > window.screen.width){
				orient = 'portrait-primary';
			}else{
				orient = 'landscape-primary';
			}
		}

		return {
			'viewWidth': window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			'viewHeight': window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
			'pageWidth': document.body.clientWidth || document.body.offsetWidth,
			'pageHeight': document.body.clientHeight || document.body.offsetHeight,
			'resolutionWidth': window.screen.width,
			'resolutionHeight': window.screen.height,
			'orientation': orient,
			'colorDepth': window.screen.colorDepth,
			'pixelDepth': window.screen.pixelDepth
		}

	},
	ajax: function (options) {

		if(Boss.getById('box-pc-menu')){

			if(Boss.getById('box-pc-menu').classList.contains('box-menu-pc-open') && typeof(closeMenuPC) !== 'undefined'){

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

			var form = Boss.getById(options.formId);
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
						if(JSON.parse(XHR.responseText)){
							jsonStr = eval("("+XHR.responseText+")");
						}
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
	get: function(url, fn){

		var XHR = new XMLHttpRequest();

		XHR.onreadystatechange = function(){
			if (XHR.readyState == 4 && (XHR.status == 200 || XHR.status == 400 || XHR.status === 304)){

				jsonStr = XHR.responseText;
				if(JSON.parse(XHR.responseText)){
					jsonStr = eval("("+XHR.responseText+")");
				}
				if(typeof(fn) === 'function'){
					fn(jsonStr);
				}
			}
		};

		XHR.open("GET", url, true);
		XHR.send();

	},
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
	},
	warning: function(obj){
		if(obj.message){

			var mask = '<div class="boss-warning"><button id="boss-warning-close" type="button" class="boss-warning-close"><i class="icl ic-times"></i></button><p class="text-center font16 strong">'+obj.message+'</p></div>';

			if(Boss.getById('boss-warning')){
				var div = Boss.getById('boss-warning');
				div.innerHTML = mask;
			}else{
				var div = document.createElement('div');
				div.setAttribute('id', 'boss-warning');
				div.innerHTML = mask;
				document.body.appendChild(div);
			}

			if(obj.color){
				div.setAttribute('class', obj.color);
			}else{
				div.removeAttribute('class');
			}

			div.classList.remove('hidden');
			div.style.top = '-1px';
			div.style.opacity = '1';

			Boss.delayPersistent2(function(){
				div.style.top = '-80px';
				div.style.opacity = '0';
			}, 8000, 'warning');

			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('boss-warning-close'), function(){

				if(Boss.getById('boss-warning')){
					
					var div = Boss.getById('boss-warning');
					div.style.top = '-80px';
					div.style.opacity = '0';
				}
			});
		}
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
	numberFormat: function(n){

		var spt = String(n).split('.');

		var milhar = '0';
		var centavos = '00';
		var valor = '';

		if(spt[0]){
			milhar = spt[0];
			var sptMilahr = milhar.split('');
			var tsptMilahr = sptMilahr.length;
			if(tsptMilahr > 0){
				var tres = 0;
				for(x = (tsptMilahr - 1); x >= 0; x = x-1){
					valor = sptMilahr[x]+valor;
					tres = tres + 1;
					if(tres === 3 && sptMilahr[(x-1)]){
						valor = '.'+valor;
						tres = 0;
					}
				}
			}

		}
		if(spt[1]){
			centavos = spt[1];
		}

		return valor+','+centavos;
	}
};

Boss.validate = {
	rules: {
		notUppercase: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			var upper = {'A':'','B':'','C':'','D':'','E':'','F':'','G':'','H':'','I':'','J':'','K':'','L':'','M':'','N':'','O':'','P':'','Q':'','R':'','S':'','T':'','U':'','V':'','W':'','X':'','Y':'','Z':''};
			var lower = {'a':'','b':'','c':'','d':'','e':'','f':'','g':'','h':'','i':'','j':'','k':'','l':'','m':'','n':'','o':'','p':'','q':'','r':'','s':'','t':'','u':'','v':'','w':'','x':'','y':'','z':''};

			var lengtUpper = 0;
			var lengtLower = 0;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var temp = value.split('');
			var lTemp = temp.length;

			if(lTemp > 4){

				for (x = 0; x < lTemp; x++) {

					if(typeof(upper[temp[x]]) !== 'undefined'){
						lengtUpper = lengtUpper + 1;
					}else if(typeof(lower[temp[x]]) !== 'undefined'){
						lengtLower = lengtLower + 1;
					}else{
						lengtLower = lengtLower + 1;
					}
				}

				// MORE UPPER WHO LOWER
				if(lengtUpper > lengtLower){
					return false;
				}

			}

			return true;

		},
		notSpace: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var temp = value.split('');
			var lTemp = temp.length;

			for (x = 0; x < lTemp; x++) {

				if(temp[x] == ' '){
					return false;
				}
			}

			return true;

		},
		cnpj: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var value = value.replace(/\D/g, "");

			while(value.length < 14){
				value = "0" + value;
			}
			var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
			var a = [];
			var b = 0;
			var c = [6,5,4,3,2,9,8,7,6,5,4,3,2], x;

			for (var i = 0; i < 12; i++){
				a[i] = value.charAt(i);
				b += a[i] * c[i+1];
			}

			if((x = b % 11) < 2){
				a[12] = 0;
			}else{
				a[12] = 11 - x;
			}

			b = 0;
			for (var y = 0; y < 13; y++){
				b += (a[y] * c[y]);
			}

			if ((x = b % 11) < 2){
				a[13] = 0;
			}else{
				a[13] = 11 - x;
			}

			if ((parseInt(value.charAt(12), 10) !== a[12]) || (parseInt(value.charAt(13), 10) !== a[13]) || value.match(expReg) ){
				return false;
			}
			return true;
		},
		cpf: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			value = value.replace(".","");
			value = value.replace(".","");
			var cpf = value.replace("-","");

			var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
			var a = [];
			var b = 0;
			var c = 11;
			var x, y;
			for (var i = 0; i < 11; i++){
				a[i] = cpf.charAt(i);
				if (i < 9){
					b += (a[i] * --c);
				}
			}
			if ((x = b % 11) < 2){
				a[9] = 0;
			}else{
				a[9] = 11-x;
			}

			b = 0;
			c = 11;

			for(y=0; y<10; y++){
				b += (a[y] * c--);
			}

			if((x = b % 11) < 2){
				a[10] = 0;
			}else{
				a[10] = 11-x;
			}

			if((parseInt(cpf.charAt(9), 10) !== a[9]) || (parseInt(cpf.charAt(10), 10) !== a[10]) || cpf.match(expReg)){
				return false;
			}

			return true;
		},
		inteiro: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[0-9]+$/;
			if(!n.test(value)){
				return false;
			}

			var n = /^[0]+/;
			if(n.test(value)){
				return false;
			}

			return true;
		},
		inteiroZero: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[0-9]+$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		moeda: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			/* PALEATIVO */
			fld[0].setAttribute('step', '0.01');

			if(fld[0].validity.valid === false){
				console.warn('a');
				return false;
			}

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^-*\d+(\.\d{1,2})?$/; 
			if(!n.test(value)){
				console.warn('b');
				return false;
			}

			return true;
		},
		decimal: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		cep: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[0-9]{5}-*[0-9]{3}$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		empty: function(fld, parameters){

			var lengt = fld.length;

			if(lengt < 2 && fld[0].type !== 'radio'){
				value = fld[0].value;
				if(value === ''){
					return false;
				}
			}else if(fld[0].type === 'radio'){
				for(x = 0; x < lengt; x++){
					if(fld[x].checked === true && fld[x].value === ''){
						return false;
						break;
					}
				}
			}

			return true;
		},
		tel: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^\(*[0-9]{2}\)* *-*[0-9]{4} *-* *[0-9]{4}$|^\(*[0-9]{2}\)* *-*[0-9]{5} *-* *[0-9]{4}$/;

			if(!n.test(value)){
				return false;
			}

			return true;
		},
		email: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[a-z-A-Z0-9\._\-]+@[a-z-A-Z0-9\._\-]+\.[a-z-A-Z0-9]\.*[a-z]+$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		url: function(fld, parameters) {

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		complexidadeSenha: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /([0-9a-zA-Z]+|[0-9\d]+|[a-zA-Z\d]+).{6,}/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		igual: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var igual = Boss.getName(parameters.igual)[0];
			if(value === igual.value){
				return true;
			}
			return false;
		},
		igualNumber: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(Number(value) === Number(parameters.igualNumber)){
				return true;
			}
			return false;
		},
		igualId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var igual = Boss.getById(parameters.igualId);
			if(value === igual.value){
				return true;
			}
			return false;
		},
		igualNumberId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var igual = Boss.getById(parameters.igualNumberId);
			if(Number(value) === Number(igual.value)){
				return true;
			}
			return false;
		},
		maiorId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.maiorId);
			if(parseFloat(value) > parseFloat(igual.value)){
				return true;
			}
			return false;
		},
		maiorIgualId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var maiorigualid = Boss.getById(parameters.maiorIgualId);
			if(parseFloat(value) >= parseFloat(maiorigualid.value)){
				return true;
			}
			return false;
		},
		maiorIgualIdNull: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var maiorigualidnull = Boss.getById(parameters.maiorIgualIdNull);
			if(maiorigualidnull.value == '' || parseFloat(value) >= parseFloat(maiorigualidnull.value)){
				return true;
			}
			return false;
		},
		maiorIdNull: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.maiorIdNull);
			if(parseFloat(value) >= parseFloat(igual.value) || igual.value == ''){
				return true;
			}
			return false;

		},
		maior: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(parseFloat(value) > parseFloat(parameters.maior)){
				return true;
			}
			return false;

		},
		maiorIgual: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(parseFloat(value) >= parseFloat(parameters.maiorIgual)){
				return true;
			}
			return false;
		},
		menor: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(Number(value) < Number(parameters.menor)){
				return true;
			}
			return false;
		},
		menorIgual: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(parseFloat(value) <= parseFloat(parameters.menorIgual)){
				return true;
			}
			return false;

		},
		menorIgualId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^\d+(\.[\d]+)?$/;

			value = Math.abs(value);

			/* Math.abs PARA IGNORAR VALORES NEGATIVOS */
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.menorIgualId);
			if(parseFloat(value) <= parseFloat(Math.abs(igual.value)) || Math.abs(igual.value) == ''){
				return true;
			}
			return false;

		},
		maiorNuloId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.maiorNuloId);
			if(parseFloat(value) >= parseFloat(igual.value) || value === ''){
				return true;
			}
			return false;

		},
		diferente: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(value !== parameters.diferente){
				return true;
			}
			return false;
		},
		diferenteId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var diff = Boss.getById(parameters.diferenteId);
			if(value !== diff.value || value === ''){
				return true;
			}
			return false;
		},
		tamanhoMaximo: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(value.length <= parameters.tamanhoMaximo){
				return true;
			}
			return false;

		},
		tamanhoMinimo: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(value.length >= parameters.tamanhoMinimo){
				return true;
			}
			return false;
		},
		sicredi: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			n = /^\d+?$/;
			if(!n.test(value)){
				return false;
			}

			if(value.length === 7){
				return true;
			}
			return false;

		},
		banrisul: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			n = /^\d+?$/;
			if(!n.test(value)){
				return false;
			}

			if(value.length === 7){
				return true;
			}
			return false;

		},
		minSelection: function(fld, parameters){
			
			if(parameters.minSelection){

				var lengt = fld.length;

				if(fld[0].type === 'checkbox' || fld[0].type === 'radio'){
					var checkeds = 0;
					for(x = 0; x < lengt; x++){
						if(fld[x].checked === true){
							checkeds = checkeds + 1;
						}
					}
					if(checkeds < parameters.minSelection){
						return false;
					}
				}

				if(fld[0].type === 'select-multiple' || fld[0].type === 'select-one'){
					var selecteds = 0;
					var opts = fld[0].options;
					var lOpts = opts.length;
					for(o = 0; o < lOpts; o++){
						if(opts[o].selected === true){
							selecteds = selecteds + 1;
						}
					}
					if(selecteds < parameters.minSelection){
						return false;
					}
				}

				if(fld[0].type === 'file'){
					var tFls = fld[0].files.length;
					if(tFls < parameters.minSelection){
						return false;
					}
				}
			}

			return true;
		},
		maxSelection: function(fld, parameters){
			
			if(parameters.maxSelection){

				var checkeds = 0;
				var selecteds = 0;
				var lengt = fld.length;

				if(fld[0].type === 'checkbox' || fld[0].type === 'radio'){
					for(x = 0; x < lengt; x++){
						if(fld[x].checked === true){
							checkeds = checkeds + 1;
						}
					}
					if(checkeds > parameters.maxSelection){
						return false;
					}
				}

				if(fld[0].type === 'select-multiple' || fld[0].type === 'select-one'){
					var opts = fld[0].options;
					var lOpts = opts.length;
					for(o = 0; o < lOpts; o++){
						if(opts[o].selected === true){
							selecteds = selecteds + 1;
						}
					}
					if(selecteds > parameters.maxSelection){
						return false;
					}
				}

				if(fld[0].type === 'file'){
					var tFls = fld[0].files.length;
					if(tFls > parameters.maxSelection){
						return false;
					}
				}
			}

			return true;
		},
		fileMaxBytes: function(fld, parameters){
			
			if(parameters.fileMaxBytes){
				if(fld[0].type === 'file'){
					var fld = fld[0].files;
					var tFls = fld.length;
					for(f = 0; f < tFls; f++){
						if(fld[f].size > parameters.fileMaxBytes){
							return false;
						}
					}
				}
			}
			return true;
		},
		fileMimeTypes: function(fld, parameters){
			
			if(parameters.fileMimeTypes){
				if(fld[0].type === 'file'){
					var fld = fld[0].files;
					var tFls = fld.length;
					for(f = 0; f < tFls; f++){
						console.warn('Tipo de arquivo: '+fld[f].type);
						if(fld[f].type !== '' && Boss.inArray(fld[f].type,parameters.fileMimeTypes) === false){
							return false;
						}
					}
				}
			}
			return true;
		}
	},
	frmsMemory: {},
	locks: {},
	processLock: function(formid){

		if(Boss.validate.locks[formid].lock === true){

			/* UNLOCK */
			if(Boss.validate.locks[formid].initString === Boss.validate.locks[formid].changeString){
				lockChangePage = false;
				lockClosePage = false;

			/* LOCK */
			}else{
				lockChangePage = true;
				lockClosePage = true;
			}
		}

	},
	processField: function(form, nme, rules, evtstype){

		var fld = document.getElementsByName(this.frmsMemory[form].names[nme]);
		var lengt = fld.length;

		/* THE RULES */
		for(r in this.frmsMemory[form]['fields'][nme].rules){

			var rFn = Boss.validate.rules[r];

			var parameters = '';
			if(this.frmsMemory[form]['fields'][nme].rules[r].parameters){
				parameters = this.frmsMemory[form]['fields'][nme].rules[r].parameters;
			}
			var rMessage = this.frmsMemory[form]['fields'][nme].rules[r].error;
			var classError = this.frmsMemory[form]['fields'][nme].classError;
			var classOk = this.frmsMemory[form]['fields'][nme].classOk;

			if(typeof(this.frmsMemory[form]['fields'][nme].rules[r].active) == 'undefined' || this.frmsMemory[form]['fields'][nme].rules[r].active === true){
				if(typeof(rFn) === 'function'){
					if(rFn(fld, parameters) === false){

						if(evtstype !== 'keyup'){
							if(parent.Boss){
								parent.Boss.warning({message: rMessage});
							}else{
								Boss.warning({message: rMessage});
							}
						}

						// selectUnique COMPONENT
						if(fld[0].getAttribute('tabindex') == '-1' && fld[0].type === 'radio'){

							var selectUnique = fld[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

							if(Boss.getById('lb-'+nme)){
								Boss.getById('lb-'+nme).classList.add('red');
							}
							/*selectUnique.classList.add(classError);
							selectUnique.classList.remove(classOk);*/

						}else{

							if(Boss.getById('lb-'+nme)){
								Boss.getById('lb-'+nme).classList.add('red');
							}
							/*fld[0].parentNode.classList.add(classError);
							fld[0].parentNode.classList.remove(classOk);*/

						}
						
						/* BREAK LOOPS */
						return false;

						/* BREAK LOOPS */
						break;
					}else{

						// selectUnique COMPONENT
						if(fld[0].getAttribute('tabindex') == '-1' && fld[0].type === 'radio'){

							var selectUnique = fld[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

							selectUnique.classList.add(classOk);
							selectUnique.classList.remove(classError);

						}else{
	
							if(Boss.getById('lb-'+nme)){

								Boss.getById('lb-'+nme).classList.remove('red');
							}
							/*fld[0].parentNode.classList.add(classOk);
							fld[0].parentNode.classList.remove(classError);*/
						}
					}
				}else{
					console.warn('The rule "'+r+'" don\'t exists.');
				}
			}
		}
		return true;
	},
	goMask: function(form, nme, mask, evts){

		if(mask === 'tel'){
			mask = '(99) 9999-9999';
		}
		if(mask === 'cnpj'){
			mask = '99.999.999/9999-99';
		}
		if(mask === 'cpf'){
			mask = '999.999.999-99';
		}
		if(mask === 'cep'){
			mask = '99999-999';
		}

		if(evts.keyCode !== 37 && evts.keyCode !== 37 && evts.keyCode !== 37 && evts.keyCode !== 40){

			var fld = document.getElementsByName(this.frmsMemory[form].names[nme])[0];
			var val = fld.value;

			var spltMask = mask.split('');
			var lengtMask = spltMask.length;

			var spltVal = val.split('');

			var partial = '';

			var cut = Array();
			var outs = {};
			var pcut = 0;

			for(x = 0; x < lengtMask; x++){

				var d = /\d/;
				var a = /\w/;

				if(d.test(spltMask[x]) && a.test(spltMask[x])){
					if(!cut[pcut]){
						cut[pcut] = 0;
					}
					cut[pcut] = cut[pcut] + 1;
				}else{
					pcut++;
					cut[pcut] = spltMask[x];
					outs[spltMask[x]] = spltMask[x];
					pcut++;
				}
			}

			var v = val;
			for(o in outs){
				var reg = new RegExp('\\'+outs[o], 'g');
				v = v.replace(reg, '');
			}

			/* 10 and 11 digitos for fone */
			if(v.length === 11 && mask === '(99) 9999-9999'){
				cut = Array("(", 2, ")"," ", 5, "-", 4);
			}else if(v.length === 10 && mask === '(99) 9999-9999'){
				cut = Array("(", 2, ")"," ", 4, "-", 4);
			}

			var start = 0;

			var masked = '';

			for(c in cut){
				if(cut[c] > 0){
					masked += v.substr(start, cut[c]);
					start = start + cut[c];
				}else{
					if(v.length >= start){
						masked += cut[c];
					}
				}
			}

			if(masked === '('){
				masked = '';
			}

			fld.value = masked;

		}

	},
	process: function(form, evts){

		var frm = Boss.getById(form);
		var tFrm = frm.length;

		var statusValidate = true;

		if(evts.type === 'blur' || evts.type === 'change' || evts.type === 'keyup'){

			var fld = Boss.targt(evts);
			var nme = fld.getAttribute('name');

			/* IF NAME EXISTS */
			if(typeof(Boss.validate.frmsMemory[form]['fields'][nme]) !== 'undefined'){
				this.processField(form, nme, this.frmsMemory[form]['fields'][nme].rules, evts.type);
			}

			if(evts.type === 'blur' || evts.type === 'change' || evts.type === 'keyup' && evts.keyCode !== 8){
				if(typeof(Boss.validate.frmsMemory[form]['fields'][nme]) !== 'undefined'){
					if(typeof(Boss.validate.frmsMemory[form]['fields'][nme].mask) !== 'undefined'){
						this.goMask(form, nme, this.frmsMemory[form]['fields'][nme].mask, evts);
					}
				}
			}

			if(evts.type === 'keyup' && evts.keyCode === 8){
				if(typeof(Boss.validate.frmsMemory[form]['fields'][nme]) !== 'undefined'){
					if(typeof(Boss.validate.frmsMemory[form]['fields'][nme].mask) !== 'undefined'){
						Boss.delayPersistent(function(){
							var fld = Boss.targt(evts);
							var nme = fld.getAttribute('name');
							Boss.validate.goMask(form, nme, Boss.validate.frmsMemory[form]['fields'][nme].mask, evts);
							Boss.trigger('keyup', fld);
						}, 1300);
					}
				}
			}

		/* SUBMIT */
		}else if(evts.type === 'submit' || evts === 'submit'){

			/* ACROSS FIELDS */
			for(x in this.frmsMemory[form].names){

				var nme = this.frmsMemory[form].names[x];

				/* IF NAME EXISTS */
				if(typeof(this.frmsMemory[form]['fields'][nme]) !== 'undefined'){

					var tmStatus = this.processField(form, nme, this.frmsMemory[form]['fields'][nme].rules, 'submit');
					/* BREAK TRUE */
					if(statusValidate === true && tmStatus === false){
						statusValidate = tmStatus;
					}
				}

			}
		}

		return statusValidate;

	},
	init: function(obj){

		if(Boss.getById(obj.config.formId)){

			var formid = obj.config.formId;
			var frm = Boss.getById(formid);
			var tFrm = frm.length;

			Boss.validate.locks[formid] = {};

			var lockPushState = false;

			if(typeof(obj.config.lockPushState) !== 'undefined'){
				lockPushState = obj.config.lockPushState;
			}

			if(lockPushState === true){

				Boss.validate.locks[formid]['lock'] = true;
				Boss.validate.locks[formid]['initString'] = JSON.stringify(Boss.serializer(formid));

			}

			if(lockPushState === false){
				Boss.validate.locks[formid]['lock'] = false;
			}

			if(frm.nodeName === 'FORM'){

				/* INIT FORM */
				this.frmsMemory[formid] = {};
				/* STORE FORM */
				this.frmsMemory[formid] = obj;
				/* INIT FORM NAMES */
				this.frmsMemory[formid]['names'] = {};

				/* FIND FIELDS NAMES OF THIS FORM */
				/* STORE FORM */
				for(f = 0; f < tFrm; f++){
					/* IF EXISTS NAME ATTRIBUTE */
					if(frm[f].getAttribute('name')){
						var nam = frm[f].getAttribute('name');
						/* STORE NAMES */
						this.frmsMemory[formid]['names'][nam] = nam;
					}
				}

				/* STOP SUBMIT EVENT */
				Boss.evts.add('submit', frm, function(evts){
					
					var valid = Boss.validate.process(formid, evts);

					if(valid === true){
						lockChangePage = false;
						lockClosePage = false;

						/* SEND BY FUNCTION */
						if(obj.send){
							obj.send();
						}
					}else{
						lockChangePage = true;
						lockClosePage = true;
					}

					/* CANCEL EVENT */
					evts.cancelBubble = true;

					if(evts.stopPropagation){
						evts.stopPropagation();
					}

					if(evts.preventDefault){
						evts.preventDefault();
					}

				});

				/* KEYUP EVENT */
				Boss.evts.add('keyup', frm, function(evts){
					Boss.delayPersistent(function(){
						var elem = Boss.targt(evts);
						/* SOME ELEMENTS ALLOW BLUR */
						if(elem.nodeName !== 'BUTTON' && (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA')){
							if(elem.type !== 'radio' && elem.type !== 'checkbox' && elem.type !== 'select' && elem.type !== 'button' && elem.type !== 'submit' && elem.type !== 'reset' && elem.type !== 'image'){
								Boss.validate.process(formid, evts);

								Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
								Boss.validate.processLock(formid);

							}
						}
					}, 100);
				});

				/* BLUR EVENT */
				Boss.evts.add('blur', frm, function(evts){
					var elem = Boss.targt(evts);
					/* SOME ELEMENTS ALLOW BLUR */
					if(elem.nodeName !== 'BUTTON' && (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA')){
						if(elem.type !== 'radio' && elem.type !== 'checkbox' && elem.type !== 'select' && elem.type !== 'button' && elem.type !== 'submit' && elem.type !== 'reset' && elem.type !== 'image'){
							Boss.validate.process(formid, evts);
						}
					}
				});

				/* FOCUS EVENT */
				Boss.evts.add('focus', frm, function(evts){
					var elem = Boss.targt(evts);
					/* SOME ELEMENTS ALLOW BLUR */
					if(elem.nodeName !== 'BUTTON' && (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA')){
						if(elem.type !== 'radio' && elem.type !== 'checkbox' && elem.type !== 'select' && elem.type !== 'button' && elem.type !== 'submit' && elem.type !== 'reset' && elem.type !== 'image'){
							Boss.validate.process(formid, evts);
						}
					}
				});

				/* CHANGE EVENT */
				Boss.evts.add('change', frm, function(evts){
					Boss.validate.process(formid, evts);

					Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
					Boss.validate.processLock(formid);

				});

				/* PASTE EVENT */
				Boss.evts.add('paste', frm, function(evts){

					Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
					Boss.validate.processLock(formid);

				});

				/* CUT EVENT */
				Boss.evts.add('cut', frm, function(evts){

					Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
					Boss.validate.processLock(formid);

				});

			}else{
				console.warn('This isn\'t a form.');
				return false;
			}

		}else{
			console.warn('Bro, I did not find his form.');
			return false;
		}
	}
};

Boss.evts.add('touchmove', document, function(evt){
	if(touchEvents === false){
		touchEvents = true;
	}
});

Boss.evts.add('touchstart', document, function(evt){
	if(touchEvents === false){
		touchEvents = true;
	}
});

/* CRIA EVENTO DE SCROLL ALTERNATIVO */
Boss.evts.add('scroll', window, function(evt){
	Boss.trigger('fakescroll', window);
});

/* CRIA EVENTO DE RESIZE ALTERNATIVO */
Boss.evts.add('resize', window, function(evt){
	Boss.trigger('fakeresize', window);
});


/* PAUSA O SCROLL - SUAVE QUANDO PRESSIONA AS TECLAS, PAGEDOWN, PAGEUP, SETA CIMA E BAIXO */
Boss.evts.add('keydown', window, function(event){
	var btn = event.keyCode;
	if(btn === 38 || btn === 40 || btn === 35 || btn === 36 || btn === 34 || btn === 33 || btn === 32){
		ancoraativa = 3;
	}
});
/* PAUSA O SCROLL - SUAVE QUANDO O SCROLL DO MOUSE É ACIONADO (usuario tentando usar o scroll) */
Boss.evts.add('wheel', window, function(){

	ancoraativa = 3;
});

/* PAUSA O SCROLL - SUAVE QUANDO O SCROLL DO MOUSE É ACIONADO (usuario tentando usar o scroll) */
Boss.evts.add('touchmove', window, function(){

	ancoraativa = 3;
});


/* SITE */
window.curY = 0;
window.lock = function(){

	curY = window.scrollY;
	document.body.classList.add('lock');
};
window.unlock = function(){

	document.body.classList.remove('lock');
	window.scrollTo(0, curY);

	if(document.querySelector('.btn-top')){

		if(window.scrollY > 400){
			document.querySelector('.btn-top').classList.remove('hidden');
		}else{
			
			document.querySelector('.btn-top').classList.add('hidden');
		}
	}
};

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