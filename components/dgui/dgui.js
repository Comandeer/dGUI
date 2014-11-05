(function(root, factory)
{
	if(typeof define === 'function' && define.amd)
		define([], function()
		{
			return factory(root);
		});
	else if(typeof exports === 'object')
		module.exports = factory(root);
	else
		factory(root);
}(this, function(global)
{
	//setup only once
	if(global.dGUI)
		return;

	var dGUI = {
		path: '/components/'
	};

	//is touch device?
	dGUI.isTouch = (function() //http://ctrlq.org/code/19616-detect-touch-screen-javascript also consider: http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
	{
		return (('ontouchstart' in window)
			|| (navigator.maxTouchPoints > 0)
			|| (navigator.MaxTouchPoints > 0)
			|| (navigator.msMaxTouchPoints > 0));
	}());

	//Load components on demand
	dGUI.require = function(components, cb)
	{
		if(!Array.isArray(components))
			components = [components];

		var all = components.length
		,i = 0
		,load = function()
		{
			console.log('Done importing ' + this.href);
			
			++i;
			if(i == all)
				cb();
		}
		,error = function()
		{
			console.log('Error while importing ' + this.href);

			++i;
			if(i == all)
				cb();
		};

		components.forEach(function(component)
		{
			component = component.replace('dgui-', '');
			var link = document.createElement('link');
			link.rel = 'import';
			link.href = dGUI.path + '/dgui-' + component + '/dgui-' + component + '.html';

			document.head.appendChild(link);

			link.addEventListener('load', load);
			link.addEventListener('error', error);
		});
	};

	//get cursor position
	dGUI.getCursorPos = function(e, node)
	{
		var offset = node ? node.getBoundingClientRect() : {
			top: 0
			,left: 0
		}
		,top = e.clientY - offset.top
		,left = e.clientX - offset.left;

		if(node)
		{
			if(top < 0)
				top = 0;
			else if(top > node.clientHeight)
				top = node.clientHeight;

			if(left < 0)
				left = 0;
			else if(left > node.clientWidth)
				left = node.clientWidth;
		}

		return {
			top: top
			,left: left
		};
	};

	//throttle - https://remysharp.com/2010/07/21/throttling-function-calls
	dGUI.throttle = function(fn, threshhold, scope)
	{
		threshhold || (threshhold = 250);

		var last
		,deferTimer;

		return function()
		{
			var context = scope || this
			,now = +new Date
			,args = arguments;

			if (last && now < last + threshhold)
			{
				clearTimeout(deferTimer);

				deferTimer = setTimeout(function()
				{
					last = now;
					fn.apply(context, args);
				}, threshhold);
			}
			else
			{
				last = now;
				fn.apply(context, args);
			}
		};
	};

	//debounce - https://remysharp.com/2010/07/21/throttling-function-calls
	dGUI.debounce = function(fn, delay, scope)
	{
		var timer = null;

		return function()
		{
			var context = scope || this
			,args = arguments;

			clearTimeout(timer);

			timer = setTimeout(function()
			{
				fn.apply(context, args);
			}, delay);
		};
	};

	//jQuery.fn.once
	dGUI.fireOnce = function(element, type, fn, scope)
	{
		element.addEventListener(type, function f(e)
		{
			var context = scope || this
			,args = arguments;

			fn.apply(context, args);

			element.removeEventListener(type, f);
		});
	};

	//http://stackoverflow.com/questions/1865563/set-cursor-at-a-length-of-14-onfocus-of-a-textbox/1867393#1867393
	dGUI.setCaret = function(elem, pos)
	{
		if(elem.createTextRange)
		{
			var textRange = elem.createTextRange();

			textRange.collapse(true);
			textRange.moveEnd(pos);
			textRange.moveStart(pos);
			return textRange.select();
		}
		else if(elem.setSelectionRange)
			return elem.setSelectionRange(pos, pos);

		return false;
	};
		
	//http://jsfiddle.net/NaHTw/304/
	dGUI.insertAtCaret = function(elem, text)
	{
		var caretPos = elem.selectionStart
		,currentValue = elem.value;

		elem.value = currentValue.substr(0, caretPos) + text + currentValue.substr(caretPos);

		dGUI.setCaret(elem, caretPos + 1);
	};

	//http://jsfiddle.net/NaHTw/304/
	dGUI.deleteAtCaret = function(elem)
	{
		var caretPos = elem.selectionStart
		,currentValue = elem.value;

		elem.value = currentValue.substr(0, caretPos - 1) + currentValue.substr(caretPos);

		dGUI.setCaret(elem, caretPos - 1);
	};
		
	global.dGUI = dGUI; //yep, it somehow sucks

	return dGUI;
}));
