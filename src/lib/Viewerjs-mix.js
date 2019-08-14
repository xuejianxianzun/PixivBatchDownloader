/*!
 * 本文件是我将 Viewer.js 的 css 和 JavaScript 压缩后合并到了一个文件中，以便调用。感谢原作者~
 *
 * Viewer.js v1.1.0
 * https://fengyuanchen.github.io/viewerjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 */
let viewer_css=`.viewer-zoom-in::before,
.viewer-zoom-out::before,
.viewer-one-to-one::before,
.viewer-reset::before,
.viewer-prev::before,
.viewer-play::before,
.viewer-next::before,
.viewer-rotate-left::before,
.viewer-rotate-right::before,
.viewer-flip-horizontal::before,
.viewer-flip-vertical::before,
.viewer-fullscreen::before,
.viewer-fullscreen-exit::before,
.viewer-close::before {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC');
  background-repeat: no-repeat;
  color: transparent;
  display: block;
  font-size: 0;
  height: 20px;
  line-height: 0;
  width: 20px;
}

.viewer-zoom-in::before {
  background-position: 0 0;
  content: 'Zoom In';
}

.viewer-zoom-out::before {
  background-position: -20px 0;
  content: 'Zoom Out';
}

.viewer-one-to-one::before {
  background-position: -40px 0;
  content: 'One to One';
}

.viewer-reset::before {
  background-position: -60px 0;
  content: 'Reset';
}

.viewer-prev::before {
  background-position: -80px 0;
  content: 'Previous';
}

.viewer-play::before {
  background-position: -100px 0;
  content: 'Play';
}

.viewer-next::before {
  background-position: -120px 0;
  content: 'Next';
}

.viewer-rotate-left::before {
  background-position: -140px 0;
  content: 'Rotate Left';
}

.viewer-rotate-right::before {
  background-position: -160px 0;
  content: 'Rotate Right';
}

.viewer-flip-horizontal::before {
  background-position: -180px 0;
  content: 'Flip Horizontal';
}

.viewer-flip-vertical::before {
  background-position: -200px 0;
  content: 'Flip Vertical';
}

.viewer-fullscreen::before {
  background-position: -220px 0;
  content: 'Enter Full Screen';
}

.viewer-fullscreen-exit::before {
  background-position: -240px 0;
  content: 'Exit Full Screen';
}

.viewer-close::before {
  background-position: -260px 0;
  content: 'Close';
}

.viewer-container {
  bottom: 0;
  direction: ltr;
  font-size: 0;
  left: 0;
  line-height: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  -webkit-tap-highlight-color: transparent;
  top: 0;
  -webkit-touch-callout: none;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.viewer-container::-moz-selection,
.viewer-container *::-moz-selection {
  background-color: transparent;
}

.viewer-container::selection,
.viewer-container *::selection {
  background-color: transparent;
}

.viewer-container img {
  display: block;
  height: auto;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
  width: 100%;
}

.viewer-canvas {
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
}

.viewer-canvas > img {
  height: auto;
  margin: 15px auto;
  max-width: 90% !important;
  width: auto;
}

.viewer-footer {
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  text-align: center;
}

.viewer-navbar {
  background-color: rgba(0, 0, 0, .5);
  overflow: hidden;
}

.viewer-list {
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  height: 50px;
  margin: 0;
  overflow: hidden;
  padding: 1px 0;
}

.viewer-list > li {
  color: transparent;
  cursor: pointer;
  float: left;
  font-size: 0;
  height: 50px;
  line-height: 0;
  opacity: .5;
  overflow: hidden;
  -webkit-transition: opacity .15s;
  transition: opacity .15s;
  width: 30px;
}

.viewer-list > li:hover {
  opacity: .75;
}

.viewer-list > li + li {
  margin-left: 1px;
}

.viewer-list > .viewer-loading {
  position: relative;
}

.viewer-list > .viewer-loading::after {
  border-width: 2px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  width: 20px;
}

.viewer-list > .viewer-active,
.viewer-list > .viewer-active:hover {
  opacity: 1;
}

.viewer-player {
  background-color: #000;
  bottom: 0;
  cursor: none;
  display: none;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.viewer-player > img {
  left: 0;
  position: absolute;
  top: 0;
}

.viewer-toolbar ul {
  display: inline-block;
  margin: 0 auto 5px;
  overflow: hidden;
  padding: 3px 0;
}

.viewer-toolbar li {
  background-color: rgba(0, 0, 0, .5);
  border-radius: 50%;
  cursor: pointer;
  float: left;
  height: 24px;
  overflow: hidden;
  -webkit-transition: background-color .15s;
  transition: background-color .15s;
  width: 24px;
}

.viewer-toolbar li:hover {
  background-color: rgba(0, 0, 0, .8);
}

.viewer-toolbar li::before {
  margin: 2px;
}

.viewer-toolbar li + li {
  margin-left: 1px;
}

.viewer-toolbar .viewer-small {
  height: 18px;
  margin-bottom: 3px;
  margin-top: 3px;
  width: 18px;
}

.viewer-toolbar .viewer-small::before {
  margin: -1px;
}

.viewer-toolbar .viewer-large {
  height: 30px;
  margin-bottom: -3px;
  margin-top: -3px;
  width: 30px;
}

.viewer-toolbar .viewer-large::before {
  margin: 5px;
}

.viewer-tooltip {
  background-color: rgba(0, 0, 0, .8);
  border-radius: 10px;
  color: #fff;
  display: none;
  font-size: 12px;
  height: 20px;
  left: 50%;
  line-height: 20px;
  margin-left: -25px;
  margin-top: -10px;
  position: absolute;
  text-align: center;
  top: 50%;
  width: 50px;
}

.viewer-title {
  color: #ccc;
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  margin: 0 5% 5px;
  max-width: 90%;
  opacity: .8;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-transition: opacity .15s;
  transition: opacity .15s;
  white-space: nowrap;
}

.viewer-title:hover {
  opacity: 1;
}

.viewer-button {
  background-color: rgba(0, 0, 0, .5);
  border-radius: 50%;
  cursor: pointer;
  height: 80px;
  overflow: hidden;
  position: absolute;
  right: -40px;
  top: -40px;
  -webkit-transition: background-color .15s;
  transition: background-color .15s;
  width: 80px;
}

.viewer-button:focus,
.viewer-button:hover {
  background-color: rgba(0, 0, 0, .8);
}

.viewer-button::before {
  bottom: 15px;
  left: 15px;
  position: absolute;
}

.viewer-fixed {
  position: fixed;
}

.viewer-open {
  overflow: hidden;
}

.viewer-show {
  display: block;
}

.viewer-hide {
  display: none;
}

.viewer-backdrop {
  background-color: rgba(0, 0, 0, .5);
}

.viewer-invisible {
  visibility: hidden;
}

.viewer-move {
  cursor: move;
  cursor: -webkit-grab;
  cursor: grab;
}

.viewer-fade {
  opacity: 0;
}

.viewer-in {
  opacity: 1;
}

.viewer-transition {
  -webkit-transition: all .3s;
  transition: all .3s;
}

@-webkit-keyframes viewer-spinner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes viewer-spinner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.viewer-loading::after {
  -webkit-animation: viewer-spinner 1s linear infinite;
  animation: viewer-spinner 1s linear infinite;
  border: 4px solid rgba(255, 255, 255, .1);
  border-left-color: rgba(255, 255, 255, .5);
  border-radius: 50%;
  content: '';
  display: inline-block;
  height: 40px;
  left: 50%;
  margin-left: -20px;
  margin-top: -20px;
  position: absolute;
  top: 50%;
  width: 40px;
  z-index: 1;
}

@media (max-width: 767px) {
  .viewer-hide-xs-down {
    display: none;
  }
}

@media (max-width: 991px) {
  .viewer-hide-sm-down {
    display: none;
  }
}

@media (max-width: 1199px) {
  .viewer-hide-md-down {
    display: none;
  }
}
`;
let viewer_css_el=document.createElement('style');
viewer_css_el.innerHTML=viewer_css;
document.head.appendChild(viewer_css_el);
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Viewer = factory());
  }(this, (function () { 'use strict';

	var DEFAULTS = {
	  // Enable inline mode
	  inline: false,

	  // Show the button on the top-right of the viewer
	  button: true,

	  // Show the navbar
	  navbar: true,

	  // Show the title
	  title: true,

	  // Show the toolbar
	  toolbar: true,

	  // Show the tooltip with image ratio (percentage) when zoom in or zoom out
	  tooltip: true,

	  // Enable to move the image
	  movable: true,

	  // Enable to zoom the image
	  zoomable: true,

	  // Enable to rotate the image
	  rotatable: true,

	  // Enable to scale the image
	  scalable: true,

	  // Enable CSS3 Transition for some special elements
	  transition: true,

	  // Enable to request fullscreen when play
	  fullscreen: true,

	  // The amount of time to delay between automatically cycling an image when playing.
	  interval: 5000,

	  // Enable keyboard support
	  keyboard: true,

	  // Enable a modal backdrop, specify `static` for a backdrop which doesn't close the modal on click
	  backdrop: true,

	  // Indicate if show a loading spinner when load image or not.
	  loading: true,

	  // Indicate if enable loop viewing or not.
	  loop: true,

	  // Min width of the viewer in inline mode
	  minWidth: 200,

	  // Min height of the viewer in inline mode
	  minHeight: 100,

	  // Define the ratio when zoom the image by wheeling mouse
	  zoomRatio: 0.1,

	  // Define the min ratio of the image when zoom out
	  minZoomRatio: 0.01,

	  // Define the max ratio of the image when zoom in
	  maxZoomRatio: 100,

	  // Define the CSS `z-index` value of viewer in modal mode.
	  zIndex: 2015,

	  // Define the CSS `z-index` value of viewer in inline mode.
	  zIndexInline: 0,

	  // Define where to get the original image URL for viewing
	  // Type: String (an image attribute) or Function (should return an image URL)
	  url: 'src',

	  // Define where to put the viewer in modal mode.
	  // Type: String | Element
	  container: 'body',

	  // Filter the images for viewing.
	  // Type: Function (return true if the image is viewable)
	  filter: null,

	  // Event shortcuts
	  ready: null,
	  show: null,
	  shown: null,
	  hide: null,
	  hidden: null,
	  view: null,
	  viewed: null,
	  zoom: null,
	  zoomed: null
	};

	var TEMPLATE = '<div class="viewer-container" touch-action="none">' + '<div class="viewer-canvas"></div>' + '<div class="viewer-footer">' + '<div class="viewer-title"></div>' + '<div class="viewer-toolbar"></div>' + '<div class="viewer-navbar">' + '<ul class="viewer-list"></ul>' + '</div>' + '</div>' + '<div class="viewer-tooltip"></div>' + '<div role="button" class="viewer-button" data-viewer-action="mix"></div>' + '<div class="viewer-player"></div>' + '</div>';

	var IN_BROWSER = typeof window !== 'undefined';
	var WINDOW = IN_BROWSER ? window : {};
	var NAMESPACE = 'viewer';

	// Actions
	var ACTION_MOVE = 'move';
	var ACTION_SWITCH = 'switch';
	var ACTION_ZOOM = 'zoom';

	// Classes
	var CLASS_ACTIVE = NAMESPACE + '-active';
	var CLASS_CLOSE = NAMESPACE + '-close';
	var CLASS_FADE = NAMESPACE + '-fade';
	var CLASS_FIXED = NAMESPACE + '-fixed';
	var CLASS_FULLSCREEN = NAMESPACE + '-fullscreen';
	var CLASS_FULLSCREEN_EXIT = NAMESPACE + '-fullscreen-exit';
	var CLASS_HIDE = NAMESPACE + '-hide';
	var CLASS_HIDE_MD_DOWN = NAMESPACE + '-hide-md-down';
	var CLASS_HIDE_SM_DOWN = NAMESPACE + '-hide-sm-down';
	var CLASS_HIDE_XS_DOWN = NAMESPACE + '-hide-xs-down';
	var CLASS_IN = NAMESPACE + '-in';
	var CLASS_INVISIBLE = NAMESPACE + '-invisible';
	var CLASS_LOADING = NAMESPACE + '-loading';
	var CLASS_MOVE = NAMESPACE + '-move';
	var CLASS_OPEN = NAMESPACE + '-open';
	var CLASS_SHOW = NAMESPACE + '-show';
	var CLASS_TRANSITION = NAMESPACE + '-transition';

	// Events
	var EVENT_READY = 'ready';
	var EVENT_SHOW = 'show';
	var EVENT_SHOWN = 'shown';
	var EVENT_HIDE = 'hide';
	var EVENT_HIDDEN = 'hidden';
	var EVENT_VIEW = 'view';
	var EVENT_VIEWED = 'viewed';
	var EVENT_ZOOM = 'zoom';
	var EVENT_ZOOMED = 'zoomed';
	var EVENT_CLICK = 'click';
	var EVENT_DRAG_START = 'dragstart';
	var EVENT_KEY_DOWN = 'keydown';
	var EVENT_LOAD = 'load';
	var EVENT_POINTER_DOWN = WINDOW.PointerEvent ? 'pointerdown' : 'touchstart mousedown';
	var EVENT_POINTER_MOVE = WINDOW.PointerEvent ? 'pointermove' : 'touchmove mousemove';
	var EVENT_POINTER_UP = WINDOW.PointerEvent ? 'pointerup pointercancel' : 'touchend touchcancel mouseup';
	var EVENT_RESIZE = 'resize';
	var EVENT_TRANSITION_END = 'transitionend';
	var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';

	// Data keys
	var DATA_ACTION = NAMESPACE + 'Action';
	var BUTTONS = ['zoom-in', 'zoom-out', 'one-to-one', 'reset', 'prev', 'play', 'next', 'rotate-left', 'rotate-right', 'flip-horizontal', 'flip-vertical'];

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
		  var descriptor = props[i];
		  descriptor.enumerable = descriptor.enumerable || false;
		  descriptor.configurable = true;
		  if ("value" in descriptor) descriptor.writable = true;
		  Object.defineProperty(target, descriptor.key, descriptor);
		}
	  }

	  return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	  };
	}();

	/**
	 * Check if the given value is a string.
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns `true` if the given value is a string, else `false`.
	 */
	function isString(value) {
	  return typeof value === 'string';
	}

	/**
	 * Check if the given value is not a number.
	 */
	var isNaN = Number.isNaN || WINDOW.isNaN;

	/**
	 * Check if the given value is a number.
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns `true` if the given value is a number, else `false`.
	 */
	function isNumber(value) {
	  return typeof value === 'number' && !isNaN(value);
	}

	/**
	 * Check if the given value is undefined.
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
	 */
	function isUndefined(value) {
	  return typeof value === 'undefined';
	}

	/**
	 * Check if the given value is an object.
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns `true` if the given value is an object, else `false`.
	 */
	function isObject(value) {
	  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
	}

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Check if the given value is a plain object.
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
	 */

	function isPlainObject(value) {
	  if (!isObject(value)) {
		return false;
	  }

	  try {
		var _constructor = value.constructor;
		var prototype = _constructor.prototype;


		return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
	  } catch (e) {
		return false;
	  }
	}

	/**
	 * Check if the given value is a function.
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns `true` if the given value is a function, else `false`.
	 */
	function isFunction(value) {
	  return typeof value === 'function';
	}

	/**
	 * Iterate the given data.
	 * @param {*} data - The data to iterate.
	 * @param {Function} callback - The process function for each element.
	 * @returns {*} The original data.
	 */
	function forEach(data, callback) {
	  if (data && isFunction(callback)) {
		if (Array.isArray(data) || isNumber(data.length) /* array-like */) {
			var length = data.length;

			var i = void 0;

			for (i = 0; i < length; i += 1) {
			  if (callback.call(data, data[i], i, data) === false) {
				break;
			  }
			}
		  } else if (isObject(data)) {
		  Object.keys(data).forEach(function (key) {
			callback.call(data, data[key], key, data);
		  });
		}
	  }

	  return data;
	}

	/**
	 * Extend the given object.
	 * @param {*} obj - The object to be extended.
	 * @param {*} args - The rest objects which will be merged to the first object.
	 * @returns {Object} The extended object.
	 */
	var assign = Object.assign || function assign(obj) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	  }

	  if (isObject(obj) && args.length > 0) {
		args.forEach(function (arg) {
		  if (isObject(arg)) {
			Object.keys(arg).forEach(function (key) {
			  obj[key] = arg[key];
			});
		  }
		});
	  }

	  return obj;
	};

	var REGEXP_SUFFIX = /^(?:width|height|left|top|marginLeft|marginTop)$/;

	/**
	 * Apply styles to the given element.
	 * @param {Element} element - The target element.
	 * @param {Object} styles - The styles for applying.
	 */
	function setStyle(element, styles) {
	  var style = element.style;


	  forEach(styles, function (value, property) {
		if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
		  value += 'px';
		}

		style[property] = value;
	  });
	}

	/**
	 * Check if the given element has a special class.
	 * @param {Element} element - The element to check.
	 * @param {string} value - The class to search.
	 * @returns {boolean} Returns `true` if the special class was found.
	 */
	function hasClass(element, value) {
	  return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
	}

	/**
	 * Add classes to the given element.
	 * @param {Element} element - The target element.
	 * @param {string} value - The classes to be added.
	 */
	function addClass(element, value) {
	  if (!value) {
		return;
	  }

	  if (isNumber(element.length)) {
		forEach(element, function (elem) {
		  addClass(elem, value);
		});
		return;
	  }

	  if (element.classList) {
		element.classList.add(value);
		return;
	  }

	  var className = element.className.trim();

	  if (!className) {
		element.className = value;
	  } else if (className.indexOf(value) < 0) {
		element.className = className + ' ' + value;
	  }
	}

	/**
	 * Remove classes from the given element.
	 * @param {Element} element - The target element.
	 * @param {string} value - The classes to be removed.
	 */
	function removeClass(element, value) {
	  if (!value) {
		return;
	  }

	  if (isNumber(element.length)) {
		forEach(element, function (elem) {
		  removeClass(elem, value);
		});
		return;
	  }

	  if (element.classList) {
		element.classList.remove(value);
		return;
	  }

	  if (element.className.indexOf(value) >= 0) {
		element.className = element.className.replace(value, '');
	  }
	}

	/**
	 * Add or remove classes from the given element.
	 * @param {Element} element - The target element.
	 * @param {string} value - The classes to be toggled.
	 * @param {boolean} added - Add only.
	 */
	function toggleClass(element, value, added) {
	  if (!value) {
		return;
	  }

	  if (isNumber(element.length)) {
		forEach(element, function (elem) {
		  toggleClass(elem, value, added);
		});
		return;
	  }

	  // IE10-11 doesn't support the second parameter of `classList.toggle`
	  if (added) {
		addClass(element, value);
	  } else {
		removeClass(element, value);
	  }
	}

	var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;

	/**
	 * Transform the given string from camelCase to kebab-case
	 * @param {string} value - The value to transform.
	 * @returns {string} The transformed value.
	 */
	function hyphenate(value) {
	  return value.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
	}

	/**
	 * Get data from the given element.
	 * @param {Element} element - The target element.
	 * @param {string} name - The data key to get.
	 * @returns {string} The data value.
	 */
	function getData(element, name) {
	  if (isObject(element[name])) {
		return element[name];
	  } else if (element.dataset) {
		return element.dataset[name];
	  }

	  return element.getAttribute('data-' + hyphenate(name));
	}

	/**
	 * Set data to the given element.
	 * @param {Element} element - The target element.
	 * @param {string} name - The data key to set.
	 * @param {string} data - The data value.
	 */
	function setData(element, name, data) {
	  if (isObject(data)) {
		element[name] = data;
	  } else if (element.dataset) {
		element.dataset[name] = data;
	  } else {
		element.setAttribute('data-' + hyphenate(name), data);
	  }
	}

	/**
	 * Remove data from the given element.
	 * @param {Element} element - The target element.
	 * @param {string} name - The data key to remove.
	 */
	function removeData(element, name) {
	  if (isObject(element[name])) {
		try {
		  delete element[name];
		} catch (e) {
		  element[name] = undefined;
		}
	  } else if (element.dataset) {
		// #128 Safari not allows to delete dataset property
		try {
		  delete element.dataset[name];
		} catch (e) {
		  element.dataset[name] = undefined;
		}
	  } else {
		element.removeAttribute('data-' + hyphenate(name));
	  }
	}

	var REGEXP_SPACES = /\s\s*/;
	var onceSupported = function () {
	  var supported = false;

	  if (IN_BROWSER) {
		var once = false;
		var listener = function listener() {};
		var options = Object.defineProperty({}, 'once', {
		  get: function get$$1() {
			supported = true;
			return once;
		  },


		  /**
		   * This setter can fix a `TypeError` in strict mode
		   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
		   * @param {boolean} value - The value to set
		   */
		  set: function set$$1(value) {
			once = value;
		  }
		});

		WINDOW.addEventListener('test', listener, options);
		WINDOW.removeEventListener('test', listener, options);
	  }

	  return supported;
	}();

	/**
	 * Remove event listener from the target element.
	 * @param {Element} element - The event target.
	 * @param {string} type - The event type(s).
	 * @param {Function} listener - The event listener.
	 * @param {Object} options - The event options.
	 */
	function removeListener(element, type, listener) {
	  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	  var handler = listener;

	  type.trim().split(REGEXP_SPACES).forEach(function (event) {
		if (!onceSupported) {
		  var listeners = element.listeners;


		  if (listeners && listeners[event] && listeners[event][listener]) {
			handler = listeners[event][listener];
			delete listeners[event][listener];

			if (Object.keys(listeners[event]).length === 0) {
			  delete listeners[event];
			}

			if (Object.keys(listeners).length === 0) {
			  delete element.listeners;
			}
		  }
		}

		element.removeEventListener(event, handler, options);
	  });
	}

	/**
	 * Add event listener to the target element.
	 * @param {Element} element - The event target.
	 * @param {string} type - The event type(s).
	 * @param {Function} listener - The event listener.
	 * @param {Object} options - The event options.
	 */
	function addListener(element, type, listener) {
	  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	  var _handler = listener;

	  type.trim().split(REGEXP_SPACES).forEach(function (event) {
		if (options.once && !onceSupported) {
		  var _element$listeners = element.listeners,
			  listeners = _element$listeners === undefined ? {} : _element$listeners;


		  _handler = function handler() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			  args[_key2] = arguments[_key2];
			}

			delete listeners[event][listener];
			element.removeEventListener(event, _handler, options);
			listener.apply(element, args);
		  };

		  if (!listeners[event]) {
			listeners[event] = {};
		  }

		  if (listeners[event][listener]) {
			element.removeEventListener(event, listeners[event][listener], options);
		  }

		  listeners[event][listener] = _handler;
		  element.listeners = listeners;
		}

		element.addEventListener(event, _handler, options);
	  });
	}

	/**
	 * Dispatch event on the target element.
	 * @param {Element} element - The event target.
	 * @param {string} type - The event type(s).
	 * @param {Object} data - The additional event data.
	 * @returns {boolean} Indicate if the event is default prevented or not.
	 */
	function dispatchEvent(element, type, data) {
	  var event = void 0;

	  // Event and CustomEvent on IE9-11 are global objects, not constructors
	  if (isFunction(Event) && isFunction(CustomEvent)) {
		event = new CustomEvent(type, {
		  detail: data,
		  bubbles: true,
		  cancelable: true
		});
	  } else {
		event = document.createEvent('CustomEvent');
		event.initCustomEvent(type, true, true, data);
	  }

	  return element.dispatchEvent(event);
	}

	/**
	 * Get the offset base on the document.
	 * @param {Element} element - The target element.
	 * @returns {Object} The offset data.
	 */
	function getOffset(element) {
	  var box = element.getBoundingClientRect();

	  return {
		left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
		top: box.top + (window.pageYOffset - document.documentElement.clientTop)
	  };
	}

	/**
	 * Get transforms base on the given object.
	 * @param {Object} obj - The target object.
	 * @returns {string} A string contains transform values.
	 */
	function getTransforms(_ref) {
	  var rotate = _ref.rotate,
		  scaleX = _ref.scaleX,
		  scaleY = _ref.scaleY,
		  translateX = _ref.translateX,
		  translateY = _ref.translateY;

	  var values = [];

	  if (isNumber(translateX) && translateX !== 0) {
		values.push('translateX(' + translateX + 'px)');
	  }

	  if (isNumber(translateY) && translateY !== 0) {
		values.push('translateY(' + translateY + 'px)');
	  }

	  // Rotate should come first before scale to match orientation transform
	  if (isNumber(rotate) && rotate !== 0) {
		values.push('rotate(' + rotate + 'deg)');
	  }

	  if (isNumber(scaleX) && scaleX !== 1) {
		values.push('scaleX(' + scaleX + ')');
	  }

	  if (isNumber(scaleY) && scaleY !== 1) {
		values.push('scaleY(' + scaleY + ')');
	  }

	  var transform = values.length ? values.join(' ') : 'none';

	  return {
		WebkitTransform: transform,
		msTransform: transform,
		transform: transform
	  };
	}

	/**
	 * Get an image name from an image url.
	 * @param {string} url - The target url.
	 * @example
	 * // picture.jpg
	 * getImageNameFromURL('http://domain.com/path/to/picture.jpg?size=1280×960')
	 * @returns {string} A string contains the image name.
	 */
	function getImageNameFromURL(url) {
	  return isString(url) ? url.replace(/^.*\//, '').replace(/[?&#].*$/, '') : '';
	}

	var IS_SAFARI = WINDOW.navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(WINDOW.navigator.userAgent);

	/**
	 * Get an image's natural sizes.
	 * @param {string} image - The target image.
	 * @param {Function} callback - The callback function.
	 * @returns {HTMLImageElement} The new image.
	 */
	function getImageNaturalSizes(image, callback) {
	  var newImage = document.createElement('img');

	  // Modern browsers (except Safari)
	  if (image.naturalWidth && !IS_SAFARI) {
		callback(image.naturalWidth, image.naturalHeight);
		return newImage;
	  }

	  var body = document.body || document.documentElement;

	  newImage.onload = function () {
		callback(newImage.width, newImage.height);

		if (!IS_SAFARI) {
		  body.removeChild(newImage);
		}
	  };

	  newImage.src = image.src;

	  // iOS Safari will convert the image automatically
	  // with its orientation once append it into DOM
	  if (!IS_SAFARI) {
		newImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
		body.appendChild(newImage);
	  }

	  return newImage;
	}

	/**
	 * Get the related class name of a responsive type number.
	 * @param {string} type - The responsive type.
	 * @returns {string} The related class name.
	 */
	function getResponsiveClass(type) {
	  switch (type) {
		case 2:
		  return CLASS_HIDE_XS_DOWN;

		case 3:
		  return CLASS_HIDE_SM_DOWN;

		case 4:
		  return CLASS_HIDE_MD_DOWN;

		default:
		  return '';
	  }
	}

	/**
	 * Get the max ratio of a group of pointers.
	 * @param {string} pointers - The target pointers.
	 * @returns {number} The result ratio.
	 */
	function getMaxZoomRatio(pointers) {
	  var pointers2 = assign({}, pointers);
	  var ratios = [];

	  forEach(pointers, function (pointer, pointerId) {
		delete pointers2[pointerId];

		forEach(pointers2, function (pointer2) {
		  var x1 = Math.abs(pointer.startX - pointer2.startX);
		  var y1 = Math.abs(pointer.startY - pointer2.startY);
		  var x2 = Math.abs(pointer.endX - pointer2.endX);
		  var y2 = Math.abs(pointer.endY - pointer2.endY);
		  var z1 = Math.sqrt(x1 * x1 + y1 * y1);
		  var z2 = Math.sqrt(x2 * x2 + y2 * y2);
		  var ratio = (z2 - z1) / z1;

		  ratios.push(ratio);
		});
	  });

	  ratios.sort(function (a, b) {
		return Math.abs(a) < Math.abs(b);
	  });

	  return ratios[0];
	}

	/**
	 * Get a pointer from an event object.
	 * @param {Object} event - The target event object.
	 * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
	 * @returns {Object} The result pointer contains start and/or end point coordinates.
	 */
	function getPointer(_ref2, endOnly) {
	  var pageX = _ref2.pageX,
		  pageY = _ref2.pageY;

	  var end = {
		endX: pageX,
		endY: pageY
	  };

	  return endOnly ? end : assign({
		startX: pageX,
		startY: pageY
	  }, end);
	}

	/**
	 * Get the center point coordinate of a group of pointers.
	 * @param {Object} pointers - The target pointers.
	 * @returns {Object} The center point coordinate.
	 */
	function getPointersCenter(pointers) {
	  var pageX = 0;
	  var pageY = 0;
	  var count = 0;

	  forEach(pointers, function (_ref3) {
		var startX = _ref3.startX,
			startY = _ref3.startY;

		pageX += startX;
		pageY += startY;
		count += 1;
	  });

	  pageX /= count;
	  pageY /= count;

	  return {
		pageX: pageX,
		pageY: pageY
	  };
	}

	var render = {
	  render: function render() {
		this.initContainer();
		this.initViewer();
		this.initList();
		this.renderViewer();
	  },
	  initContainer: function initContainer() {
		this.containerData = {
		  width: window.innerWidth,
		  height: window.innerHeight
		};
	  },
	  initViewer: function initViewer() {
		var options = this.options,
			parent = this.parent;

		var viewerData = void 0;

		if (options.inline) {
		  viewerData = {
			width: Math.max(parent.offsetWidth, options.minWidth),
			height: Math.max(parent.offsetHeight, options.minHeight)
		  };

		  this.parentData = viewerData;
		}

		if (this.fulled || !viewerData) {
		  viewerData = this.containerData;
		}

		this.viewerData = assign({}, viewerData);
	  },
	  renderViewer: function renderViewer() {
		if (this.options.inline && !this.fulled) {
		  setStyle(this.viewer, this.viewerData);
		}
	  },
	  initList: function initList() {
		var _this = this;

		var element = this.element,
			options = this.options,
			list = this.list;

		var items = [];

		forEach(this.images, function (image, i) {
		  var src = image.src;

		  var alt = image.alt || getImageNameFromURL(src);
		  var url = options.url;


		  if (isString(url)) {
			url = image.getAttribute(url);
		  } else if (isFunction(url)) {
			url = url.call(_this, image);
		  }

		  if (src || url) {
			items.push('<li>' + '<img' + (' src="' + (src || url) + '"') + ' role="button"' + ' data-viewer-action="view"' + (' data-index="' + i + '"') + (' data-original-url="' + (url || src) + '"') + (' alt="' + alt + '"') + '>' + '</li>');
		  }
		});

		list.innerHTML = items.join('');
		this.items = list.getElementsByTagName('li');
		forEach(this.items, function (item) {
		  var image = item.firstElementChild;

		  setData(image, 'filled', true);

		  if (options.loading) {
			addClass(item, CLASS_LOADING);
		  }

		  addListener(image, EVENT_LOAD, function (event) {
			if (options.loading) {
			  removeClass(item, CLASS_LOADING);
			}

			_this.loadImage(event);
		  }, {
			once: true
		  });
		});

		if (options.transition) {
		  addListener(element, EVENT_VIEWED, function () {
			addClass(list, CLASS_TRANSITION);
		  }, {
			once: true
		  });
		}
	  },
	  renderList: function renderList(index) {
		var i = index || this.index;
		var width = this.items[i].offsetWidth || 30;
		var outerWidth = width + 1; // 1 pixel of `margin-left` width

		// Place the active item in the center of the screen
		setStyle(this.list, assign({
		  width: outerWidth * this.length
		}, getTransforms({
		  translateX: (this.viewerData.width - width) / 2 - outerWidth * i
		})));
	  },
	  resetList: function resetList() {
		var list = this.list;


		list.innerHTML = '';
		removeClass(list, CLASS_TRANSITION);
		setStyle(list, getTransforms({
		  translateX: 0
		}));
	  },
	  initImage: function initImage(done) {
		var _this2 = this;

		var options = this.options,
			image = this.image,
			viewerData = this.viewerData;

		var footerHeight = this.footer.offsetHeight;
		var viewerWidth = viewerData.width;
		var viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
		var oldImageData = this.imageData || {};
		var sizingImage = void 0;

		this.imageInitializing = {
		  abort: function abort() {
			sizingImage.onload = null;
		  }
		};

		sizingImage = getImageNaturalSizes(image, function (naturalWidth, naturalHeight) {
		  var aspectRatio = naturalWidth / naturalHeight;
		  var width = viewerWidth;
		  var height = viewerHeight;

		  _this2.imageInitializing = false;

		  if (viewerHeight * aspectRatio > viewerWidth) {
			height = viewerWidth / aspectRatio;
		  } else {
			width = viewerHeight * aspectRatio;
		  }

		  width = Math.min(width * 0.9, naturalWidth);
		  height = Math.min(height * 0.9, naturalHeight);

		  var imageData = {
			naturalWidth: naturalWidth,
			naturalHeight: naturalHeight,
			aspectRatio: aspectRatio,
			ratio: width / naturalWidth,
			width: width,
			height: height,
			left: (viewerWidth - width) / 2,
			top: (viewerHeight - height) / 2
		  };
		  var initialImageData = assign({}, imageData);

		  if (options.rotatable) {
			imageData.rotate = oldImageData.rotate || 0;
			initialImageData.rotate = 0;
		  }

		  if (options.scalable) {
			imageData.scaleX = oldImageData.scaleX || 1;
			imageData.scaleY = oldImageData.scaleY || 1;
			initialImageData.scaleX = 1;
			initialImageData.scaleY = 1;
		  }

		  _this2.imageData = imageData;
		  _this2.initialImageData = initialImageData;

		  if (done) {
			done();
		  }
		});
	  },
	  renderImage: function renderImage(done) {
		var _this3 = this;

		var image = this.image,
			imageData = this.imageData;


		setStyle(image, assign({
		  width: imageData.width,
		  height: imageData.height,
		  marginLeft: imageData.left,
		  marginTop: imageData.top
		}, getTransforms(imageData)));

		if (done) {
		  if ((this.viewing || this.zooming) && this.options.transition) {
			var onTransitionEnd = function onTransitionEnd() {
			  _this3.imageRendering = false;
			  done();
			};

			this.imageRendering = {
			  abort: function abort() {
				removeListener(image, EVENT_TRANSITION_END, onTransitionEnd);
			  }
			};

			addListener(image, EVENT_TRANSITION_END, onTransitionEnd, {
			  once: true
			});
		  } else {
			done();
		  }
		}
	  },
	  resetImage: function resetImage() {
		// this.image only defined after viewed
		if (this.viewing || this.viewed) {
		  var image = this.image;


		  if (this.viewing) {
			this.viewing.abort();
		  }

		  image.parentNode.removeChild(image);
		  this.image = null;
		}
	  }
	};

	var events = {
	  bind: function bind() {
		var element = this.element,
			viewer = this.viewer;


		addListener(viewer, EVENT_CLICK, this.onClick = this.click.bind(this));
		addListener(viewer, EVENT_WHEEL, this.onWheel = this.wheel.bind(this));
		addListener(viewer, EVENT_DRAG_START, this.onDragStart = this.dragstart.bind(this));
		addListener(this.canvas, EVENT_POINTER_DOWN, this.onPointerDown = this.pointerdown.bind(this));
		addListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onPointerMove = this.pointermove.bind(this));
		addListener(element.ownerDocument, EVENT_POINTER_UP, this.onPointerUp = this.pointerup.bind(this));
		addListener(element.ownerDocument, EVENT_KEY_DOWN, this.onKeyDown = this.keydown.bind(this));
		addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));
	  },
	  unbind: function unbind() {
		var element = this.element,
			viewer = this.viewer;


		removeListener(viewer, EVENT_CLICK, this.onClick);
		removeListener(viewer, EVENT_WHEEL, this.onWheel);
		removeListener(viewer, EVENT_DRAG_START, this.onDragStart);
		removeListener(this.canvas, EVENT_POINTER_DOWN, this.onPointerDown);
		removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onPointerMove);
		removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onPointerUp);
		removeListener(element.ownerDocument, EVENT_KEY_DOWN, this.onKeyDown);
		removeListener(window, EVENT_RESIZE, this.onResize);
	  }
	};

	var handlers = {
	  click: function click(_ref) {
		var target = _ref.target;
		var options = this.options,
			imageData = this.imageData;

		var action = getData(target, DATA_ACTION);

		switch (action) {
		  case 'mix':
			if (this.played) {
			  this.stop();
			} else if (options.inline) {
			  if (this.fulled) {
				this.exit();
			  } else {
				this.full();
			  }
			} else {
			  this.hide();
			}

			break;

		  case 'hide':
			this.hide();
			break;

		  case 'view':
			this.view(getData(target, 'index'));
			break;

		  case 'zoom-in':
			this.zoom(0.1, true);
			break;

		  case 'zoom-out':
			this.zoom(-0.1, true);
			break;

		  case 'one-to-one':
			this.toggle();
			break;

		  case 'reset':
			this.reset();
			break;

		  case 'prev':
			this.prev(options.loop);
			break;

		  case 'play':
			this.play(options.fullscreen);
			break;

		  case 'next':
			this.next(options.loop);
			break;

		  case 'rotate-left':
			this.rotate(-90);
			break;

		  case 'rotate-right':
			this.rotate(90);
			break;

		  case 'flip-horizontal':
			this.scaleX(-imageData.scaleX || -1);
			break;

		  case 'flip-vertical':
			this.scaleY(-imageData.scaleY || -1);
			break;

		  default:
			if (this.played) {
			  this.stop();
			}
		}
	  },
	  load: function load() {
		var _this = this;

		if (this.timeout) {
		  clearTimeout(this.timeout);
		  this.timeout = false;
		}

		var element = this.element,
			options = this.options,
			image = this.image,
			index = this.index,
			viewerData = this.viewerData;


		removeClass(image, CLASS_INVISIBLE);

		if (options.loading) {
		  removeClass(this.canvas, CLASS_LOADING);
		}

		image.style.cssText = 'height:0;' + ('margin-left:' + viewerData.width / 2 + 'px;') + ('margin-top:' + viewerData.height / 2 + 'px;') + 'max-width:none!important;' + 'position:absolute;' + 'width:0;';

		this.initImage(function () {
		  toggleClass(image, CLASS_MOVE, options.movable);
		  toggleClass(image, CLASS_TRANSITION, options.transition);

		  _this.renderImage(function () {
			_this.viewed = true;
			_this.viewing = false;

			if (isFunction(options.viewed)) {
			  addListener(element, EVENT_VIEWED, options.viewed, {
				once: true
			  });
			}

			dispatchEvent(element, EVENT_VIEWED, {
			  originalImage: _this.images[index],
			  index: index,
			  image: image
			});
		  });
		});
	  },
	  loadImage: function loadImage(e) {
		var image = e.target;
		var parent = image.parentNode;
		var parentWidth = parent.offsetWidth || 30;
		var parentHeight = parent.offsetHeight || 50;
		var filled = !!getData(image, 'filled');

		getImageNaturalSizes(image, function (naturalWidth, naturalHeight) {
		  var aspectRatio = naturalWidth / naturalHeight;
		  var width = parentWidth;
		  var height = parentHeight;

		  if (parentHeight * aspectRatio > parentWidth) {
			if (filled) {
			  width = parentHeight * aspectRatio;
			} else {
			  height = parentWidth / aspectRatio;
			}
		  } else if (filled) {
			height = parentWidth / aspectRatio;
		  } else {
			width = parentHeight * aspectRatio;
		  }

		  setStyle(image, assign({
			width: width,
			height: height
		  }, getTransforms({
			translateX: (parentWidth - width) / 2,
			translateY: (parentHeight - height) / 2
		  })));
		});
	  },
	  keydown: function keydown(e) {
		var options = this.options;


		if (!this.fulled || !options.keyboard) {
		  return;
		}

		switch (e.keyCode || e.which || e.charCode) {
		  // Escape
		  case 27:
			if (this.played) {
			  this.stop();
			} else if (options.inline) {
			  if (this.fulled) {
				this.exit();
			  }
			} else {
			  this.hide();
			}

			break;

		  // Space
		  case 32:
			if (this.played) {
			  this.stop();
			}

			break;

		  // ArrowLeft
		  case 37:
			this.prev(options.loop);
			break;

		  // ArrowUp
		  case 38:
			// Prevent scroll on Firefox
			e.preventDefault();

			// Zoom in
			this.zoom(options.zoomRatio, true);
			break;

		  // ArrowRight
		  case 39:
			this.next(options.loop);
			break;

		  // ArrowDown
		  case 40:
			// Prevent scroll on Firefox
			e.preventDefault();

			// Zoom out
			this.zoom(-options.zoomRatio, true);
			break;

		  // Ctrl + 0
		  case 48:
		  // Fall through

		  // Ctrl + 1
		  // eslint-disable-next-line no-fallthrough
		  case 49:
			if (e.ctrlKey) {
			  e.preventDefault();
			  this.toggle();
			}

			break;

		  default:
		}
	  },
	  dragstart: function dragstart(e) {
		if (e.target.tagName.toLowerCase() === 'img') {
		  e.preventDefault();
		}
	  },
	  pointerdown: function pointerdown(e) {
		var options = this.options,
			pointers = this.pointers;


		if (!this.viewed || this.showing || this.viewing || this.hiding) {
		  return;
		}

		// This line is required for preventing page zooming in iOS browsers
		e.preventDefault();

		if (e.changedTouches) {
		  forEach(e.changedTouches, function (touch) {
			pointers[touch.identifier] = getPointer(touch);
		  });
		} else {
		  pointers[e.pointerId || 0] = getPointer(e);
		}

		var action = options.movable ? ACTION_MOVE : false;

		if (Object.keys(pointers).length > 1) {
		  action = ACTION_ZOOM;
		} else if ((e.pointerType === 'touch' || e.type === 'touchstart') && this.isSwitchable()) {
		  action = ACTION_SWITCH;
		}

		if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
		  removeClass(this.image, CLASS_TRANSITION);
		}

		this.action = action;
	  },
	  pointermove: function pointermove(e) {
		var pointers = this.pointers,
			action = this.action;


		if (!this.viewed || !action) {
		  return;
		}

		e.preventDefault();

		if (e.changedTouches) {
		  forEach(e.changedTouches, function (touch) {
			assign(pointers[touch.identifier], getPointer(touch, true));
		  });
		} else {
		  assign(pointers[e.pointerId || 0], getPointer(e, true));
		}

		this.change(e);
	  },
	  pointerup: function pointerup(e) {
		var action = this.action,
			pointers = this.pointers;


		if (e.changedTouches) {
		  forEach(e.changedTouches, function (touch) {
			delete pointers[touch.identifier];
		  });
		} else {
		  delete pointers[e.pointerId || 0];
		}

		if (!action) {
		  return;
		}

		e.preventDefault();

		if (this.options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
		  addClass(this.image, CLASS_TRANSITION);
		}

		this.action = false;
	  },
	  resize: function resize() {
		var _this2 = this;

		if (!this.isShown || this.hiding) {
		  return;
		}

		this.initContainer();
		this.initViewer();
		this.renderViewer();
		this.renderList();

		if (this.viewed) {	// 当窗口 resize 时，如果是非全屏则重置图片大小。全屏时不重置
			if (!(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false)) {
				this.initImage(function () {
					_this2.renderImage();
					});
			}
		}

		if (this.played) {
		  if (this.options.fullscreen && this.fulled && !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			this.stop();
			return;
		  }

		  forEach(this.player.getElementsByTagName('img'), function (image) {
			addListener(image, EVENT_LOAD, _this2.loadImage.bind(_this2), {
			  once: true
			});
			dispatchEvent(image, EVENT_LOAD);
		  });
		}
	  },
	  wheel: function wheel(e) {
		var _this3 = this;

		if (!this.viewed) {
		  return;
		}

		e.preventDefault();

		// Limit wheel speed to prevent zoom too fast
		if (this.wheeling) {
		  return;
		}

		this.wheeling = true;

		setTimeout(function () {
		  _this3.wheeling = false;
		}, 50);

		var ratio = Number(this.options.zoomRatio) || 0.1;
		var delta = 1;

		if (e.deltaY) {
		  delta = e.deltaY > 0 ? 1 : -1;
		} else if (e.wheelDelta) {
		  delta = -e.wheelDelta / 120;
		} else if (e.detail) {
		  delta = e.detail > 0 ? 1 : -1;
		}

		this.zoom(-delta * ratio, true, e);
	  }
	};

	var methods = {
	  /** Show the viewer (only available in modal mode)
	   * @param {boolean} [immediate=false] - Indicates if show the viewer immediately or not.
	   * @returns {Viewer} this
	   */
	  show: function show() {
		var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var element = this.element,
			options = this.options;


		if (options.inline || this.showing || this.isShown || this.showing) {
		  return this;
		}

		if (!this.ready) {
		  this.build();

		  if (this.ready) {
			this.show(immediate);
		  }

		  return this;
		}

		if (isFunction(options.show)) {
		  addListener(element, EVENT_SHOW, options.show, {
			once: true
		  });
		}

		if (dispatchEvent(element, EVENT_SHOW) === false || !this.ready) {
		  return this;
		}

		if (this.hiding) {
		  this.transitioning.abort();
		}

		this.showing = true;
		this.open();

		var viewer = this.viewer;


		removeClass(viewer, CLASS_HIDE);

		if (options.transition && !immediate) {
		  var shown = this.shown.bind(this);

		  this.transitioning = {
			abort: function abort() {
			  removeListener(viewer, EVENT_TRANSITION_END, shown);
			  removeClass(viewer, CLASS_IN);
			}
		  };

		  addClass(viewer, CLASS_TRANSITION);

		  // Force reflow to enable CSS3 transition
		  // eslint-disable-next-line
		  viewer.offsetWidth;
		  addListener(viewer, EVENT_TRANSITION_END, shown, {
			once: true
		  });
		  addClass(viewer, CLASS_IN);
		} else {
		  addClass(viewer, CLASS_IN);
		  this.shown();
		}

		return this;
	  },


	  /**
	   * Hide the viewer (only available in modal mode)
	   * @param {boolean} [immediate=false] - Indicates if hide the viewer immediately or not.
	   * @returns {Viewer} this
	   */
	  hide: function hide() {
		var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var element = this.element,
			options = this.options;


		if (options.inline || this.hiding || !(this.isShown || this.showing)) {
		  return this;
		}

		if (isFunction(options.hide)) {
		  addListener(element, EVENT_HIDE, options.hide, {
			once: true
		  });
		}

		if (dispatchEvent(element, EVENT_HIDE) === false) {
		  return this;
		}

		if (this.showing) {
		  this.transitioning.abort();
		}

		this.hiding = true;

		if (this.played) {
		  this.stop();
		} else if (this.viewing) {
		  this.viewing.abort();
		}

		var viewer = this.viewer;


		if (options.transition && !immediate) {
		  var hidden = this.hidden.bind(this);
		  var hide = function hide() {
			addListener(viewer, EVENT_TRANSITION_END, hidden, {
			  once: true
			});
			removeClass(viewer, CLASS_IN);
		  };

		  this.transitioning = {
			abort: function abort() {
			  if (this.viewed) {
				removeListener(this.image, EVENT_TRANSITION_END, hide);
			  } else {
				removeListener(viewer, EVENT_TRANSITION_END, hidden);
			  }
			}
		  };

		  if (this.viewed) {
			addListener(this.image, EVENT_TRANSITION_END, hide, {
			  once: true
			});
			this.zoomTo(0, false, false, true);
		  } else {
			hide();
		  }
		} else {
		  removeClass(viewer, CLASS_IN);
		  this.hidden();
		}

		return this;
	  },


	  /**
	   * View one of the images with image's index
	   * @param {number} index - The index of the image to view.
	   * @returns {Viewer} this
	   */
	  view: function view() {
		var _this = this;

		var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		index = Number(index) || 0;

		if (!this.isShown) {
		  this.index = index;
		  return this.show();
		}

		if (this.hiding || this.played || index < 0 || index >= this.length || this.viewed && index === this.index) {
		  return this;
		}

		if (this.viewing) {
		  this.viewing.abort();
		}

		var element = this.element,
			options = this.options,
			title = this.title,
			canvas = this.canvas;

		var item = this.items[index];
		var img = item.querySelector('img');
		var url = getData(img, 'originalUrl');
		var alt = img.getAttribute('alt');
		var image = document.createElement('img');

		image.src = url;
		image.alt = alt;

		if (isFunction(options.view)) {
		  addListener(element, EVENT_VIEW, options.view, {
			once: true
		  });
		}

		if (dispatchEvent(element, EVENT_VIEW, {
		  originalImage: this.images[index],
		  index: index,
		  image: image
		}) === false || !this.isShown || this.hiding || this.played) {
		  return this;
		}

		this.image = image;
		removeClass(this.items[this.index], CLASS_ACTIVE);
		addClass(item, CLASS_ACTIVE);
		this.viewed = false;
		this.index = index;
		this.imageData = {};
		addClass(image, CLASS_INVISIBLE);

		if (options.loading) {
		  addClass(canvas, CLASS_LOADING);
		}

		canvas.innerHTML = '';
		canvas.appendChild(image);

		// Center current item
		this.renderList();

		// Clear title
		title.innerHTML = '';

		// Generate title after viewed
		var onViewed = function onViewed() {
		  var imageData = _this.imageData;


		  title.textContent = alt + ' (' + imageData.naturalWidth + ' \xD7 ' + imageData.naturalHeight + ')';
		};
		var onLoad = void 0;

		addListener(element, EVENT_VIEWED, onViewed, {
		  once: true
		});

		this.viewing = {
		  abort: function abort() {
			removeListener(element, EVENT_VIEWED, onViewed);

			if (image.complete) {
			  if (this.imageRendering) {
				this.imageRendering.abort();
			  } else if (this.imageInitializing) {
				this.imageInitializing.abort();
			  }
			} else {
			  removeListener(image, EVENT_LOAD, onLoad);

			  if (this.timeout) {
				clearTimeout(this.timeout);
			  }
			}
		  }
		};

		if (image.complete) {
		  this.load();
		} else {
		  addListener(image, EVENT_LOAD, onLoad = this.load.bind(this), {
			once: true
		  });

		  if (this.timeout) {
			clearTimeout(this.timeout);
		  }

		  // Make the image visible if it fails to load within 1s
		  this.timeout = setTimeout(function () {
			removeClass(image, CLASS_INVISIBLE);
			_this.timeout = false;
		  }, 1000);
		}

		return this;
	  },


	  /**
	   * View the previous image
	   * @param {boolean} [loop=false] - Indicate if view the last one
	   * when it is the first one at present.
	   * @returns {Viewer} this
	   */
	  prev: function prev() {
		var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		var index = this.index - 1;

		if (index < 0) {
		  index = loop ? this.length - 1 : 0;
		}

		this.view(index);
		return this;
	  },


	  /**
	   * View the next image
	   * @param {boolean} [loop=false] - Indicate if view the first one
	   * when it is the last one at present.
	   * @returns {Viewer} this
	   */
	  next: function next() {
		var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		var maxIndex = this.length - 1;
		var index = this.index + 1;

		if (index > maxIndex) {
		  index = loop ? 0 : maxIndex;
		}

		this.view(index);
		return this;
	  },


	  /**
	   * Move the image with relative offsets.
	   * @param {number} offsetX - The relative offset distance on the x-axis.
	   * @param {number} offsetY - The relative offset distance on the y-axis.
	   * @returns {Viewer} this
	   */
	  move: function move(offsetX, offsetY) {
		var imageData = this.imageData;


		this.moveTo(isUndefined(offsetX) ? offsetX : imageData.left + Number(offsetX), isUndefined(offsetY) ? offsetY : imageData.top + Number(offsetY));

		return this;
	  },


	  /**
	   * Move the image to an absolute point.
	   * @param {number} x - The x-axis coordinate.
	   * @param {number} [y=x] - The y-axis coordinate.
	   * @returns {Viewer} this
	   */
	  moveTo: function moveTo(x) {
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
		var imageData = this.imageData;


		x = Number(x);
		y = Number(y);

		if (this.viewed && !this.played && this.options.movable) {
		  var changed = false;

		  if (isNumber(x)) {
			imageData.left = x;
			changed = true;
		  }

		  if (isNumber(y)) {
			imageData.top = y;
			changed = true;
		  }

		  if (changed) {
			this.renderImage();
		  }
		}

		return this;
	  },


	  /**
	   * Zoom the image with a relative ratio.
	   * @param {number} ratio - The target ratio.
	   * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
	   * @param {Event} [_originalEvent=null] - The original event if any.
	   * @returns {Viewer} this
	   */
	  zoom: function zoom(ratio) {
		var hasTooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		var imageData = this.imageData;


		ratio = Number(ratio);

		if (ratio < 0) {
		  ratio = 1 / (1 - ratio);
		} else {
		  ratio = 1 + ratio;
		}

		this.zoomTo(imageData.width * ratio / imageData.naturalWidth, hasTooltip, _originalEvent);

		return this;
	  },


	  /**
	   * Zoom the image to an absolute ratio.
	   * @param {number} ratio - The target ratio.
	   * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
	   * @param {Event} [_originalEvent=null] - The original event if any.
	   * @param {Event} [_zoomable=false] - Indicates if the current zoom is available or not.
	   * @returns {Viewer} this
	   */
	  zoomTo: function zoomTo(ratio) {
		var hasTooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var _this2 = this;

		var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		var _zoomable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

		var element = this.element,
			options = this.options,
			pointers = this.pointers,
			imageData = this.imageData;


		ratio = Math.max(0, ratio);

		if (isNumber(ratio) && this.viewed && !this.played && (_zoomable || options.zoomable)) {
		  if (!_zoomable) {
			var minZoomRatio = Math.max(0.01, options.minZoomRatio);
			var maxZoomRatio = Math.min(100, options.maxZoomRatio);

			ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
		  }

		  if (_originalEvent && ratio > 0.95 && ratio < 1.05) {
			ratio = 1;
		  }

		  var newWidth = imageData.naturalWidth * ratio;
		  var newHeight = imageData.naturalHeight * ratio;
		  var oldRatio = imageData.width / imageData.naturalWidth;

		  if (isFunction(options.zoom)) {
			addListener(element, EVENT_ZOOM, options.zoom, {
			  once: true
			});
		  }

		  if (dispatchEvent(element, EVENT_ZOOM, {
			ratio: ratio,
			oldRatio: oldRatio,
			originalEvent: _originalEvent
		  }) === false) {
			return this;
		  }

		  this.zooming = true;

		  if (_originalEvent) {
			var offset = getOffset(this.viewer);
			var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
			  pageX: _originalEvent.pageX,
			  pageY: _originalEvent.pageY
			};

			// Zoom from the triggering point of the event
			imageData.left -= (newWidth - imageData.width) * ((center.pageX - offset.left - imageData.left) / imageData.width);
			imageData.top -= (newHeight - imageData.height) * ((center.pageY - offset.top - imageData.top) / imageData.height);
		  } else {
			// Zoom from the center of the image
			imageData.left -= (newWidth - imageData.width) / 2;
			imageData.top -= (newHeight - imageData.height) / 2;
		  }

		  imageData.width = newWidth;
		  imageData.height = newHeight;
		  imageData.ratio = ratio;
		  this.renderImage(function () {
			_this2.zooming = false;

			if (isFunction(options.zoomed)) {
			  addListener(element, EVENT_ZOOMED, options.zoomed, {
				once: true
			  });
			}

			dispatchEvent(element, EVENT_ZOOMED, {
			  ratio: ratio,
			  oldRatio: oldRatio,
			  originalEvent: _originalEvent
			});
		  });

		  if (hasTooltip) {
			this.tooltip();
		  }
		}

		return this;
	  },


	  /**
	   * Rotate the image with a relative degree.
	   * @param {number} degree - The rotate degree.
	   * @returns {Viewer} this
	   */
	  rotate: function rotate(degree) {
		this.rotateTo((this.imageData.rotate || 0) + Number(degree));

		return this;
	  },


	  /**
	   * Rotate the image to an absolute degree.
	   * @param {number} degree - The rotate degree.
	   * @returns {Viewer} this
	   */
	  rotateTo: function rotateTo(degree) {
		var imageData = this.imageData;


		degree = Number(degree);

		if (isNumber(degree) && this.viewed && !this.played && this.options.rotatable) {
		  imageData.rotate = degree;
		  this.renderImage();
		}

		return this;
	  },


	  /**
	   * Scale the image on the x-axis.
	   * @param {number} scaleX - The scale ratio on the x-axis.
	   * @returns {Viewer} this
	   */
	  scaleX: function scaleX(_scaleX) {
		this.scale(_scaleX, this.imageData.scaleY);

		return this;
	  },


	  /**
	   * Scale the image on the y-axis.
	   * @param {number} scaleY - The scale ratio on the y-axis.
	   * @returns {Viewer} this
	   */
	  scaleY: function scaleY(_scaleY) {
		this.scale(this.imageData.scaleX, _scaleY);

		return this;
	  },


	  /**
	   * Scale the image.
	   * @param {number} scaleX - The scale ratio on the x-axis.
	   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
	   * @returns {Viewer} this
	   */
	  scale: function scale(scaleX) {
		var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
		var imageData = this.imageData;


		scaleX = Number(scaleX);
		scaleY = Number(scaleY);

		if (this.viewed && !this.played && this.options.scalable) {
		  var changed = false;

		  if (isNumber(scaleX)) {
			imageData.scaleX = scaleX;
			changed = true;
		  }

		  if (isNumber(scaleY)) {
			imageData.scaleY = scaleY;
			changed = true;
		  }

		  if (changed) {
			this.renderImage();
		  }
		}

		return this;
	  },


	  /**
	   * Play the images
	   * @param {boolean} [fullscreen=false] - Indicate if request fullscreen or not.
	   * @returns {Viewer} this
	   */
	  play: function play() {
		var _this3 = this;

		var fullscreen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		if (!this.isShown || this.played) {
		  return this;
		}

		var options = this.options,
			player = this.player;

		var onLoad = this.loadImage.bind(this);
		var list = [];
		var total = 0;
		var index = 0;

		this.played = true;
		this.onLoadWhenPlay = onLoad;

		if (fullscreen) {
		  this.requestFullscreen();
		}

		addClass(player, CLASS_SHOW);
		forEach(this.items, function (item, i) {
		  var img = item.querySelector('img');
		  var image = document.createElement('img');

		  image.src = getData(img, 'originalUrl');
		  image.alt = img.getAttribute('alt');
		  total += 1;
		  addClass(image, CLASS_FADE);
		  toggleClass(image, CLASS_TRANSITION, options.transition);

		  if (hasClass(item, CLASS_ACTIVE)) {
			addClass(image, CLASS_IN);
			index = i;
		  }

		  list.push(image);
		  addListener(image, EVENT_LOAD, onLoad, {
			once: true
		  });
		  player.appendChild(image);
		});

		if (isNumber(options.interval) && options.interval > 0) {
		  var play = function play() {
			_this3.playing = setTimeout(function () {
			  removeClass(list[index], CLASS_IN);
			  index += 1;
			  index = index < total ? index : 0;
			  addClass(list[index], CLASS_IN);
			  play();
			}, options.interval);
		  };

		  if (total > 1) {
			play();
		  }
		}

		return this;
	  },


	  // Stop play
	  stop: function stop() {
		var _this4 = this;

		if (!this.played) {
		  return this;
		}

		var player = this.player;


		this.played = false;
		clearTimeout(this.playing);
		forEach(player.getElementsByTagName('img'), function (image) {
		  removeListener(image, EVENT_LOAD, _this4.onLoadWhenPlay);
		});
		removeClass(player, CLASS_SHOW);
		player.innerHTML = '';
		this.exitFullscreen();

		return this;
	  },


	  // Enter modal mode (only available in inline mode)
	  full: function full() {
		var _this5 = this;

		var options = this.options,
			viewer = this.viewer,
			image = this.image,
			list = this.list;


		if (!this.isShown || this.played || this.fulled || !options.inline) {
		  return this;
		}

		this.fulled = true;
		this.open();
		addClass(this.button, CLASS_FULLSCREEN_EXIT);

		if (options.transition) {
		  removeClass(list, CLASS_TRANSITION);

		  if (this.viewed) {
			removeClass(image, CLASS_TRANSITION);
		  }
		}

		addClass(viewer, CLASS_FIXED);
		viewer.setAttribute('style', '');
		setStyle(viewer, {
		  zIndex: options.zIndex
		});

		this.initContainer();
		this.viewerData = assign({}, this.containerData);
		this.renderList();

		if (this.viewed) {
		  this.initImage(function () {
			_this5.renderImage(function () {
			  if (options.transition) {
				setTimeout(function () {
				  addClass(image, CLASS_TRANSITION);
				  addClass(list, CLASS_TRANSITION);
				}, 0);
			  }
			});
		  });
		}

		return this;
	  },


	  // Exit modal mode (only available in inline mode)
	  exit: function exit() {
		var _this6 = this;

		var options = this.options,
			viewer = this.viewer,
			image = this.image,
			list = this.list;


		if (!this.isShown || this.played || !this.fulled || !options.inline) {
		  return this;
		}

		this.fulled = false;
		this.close();
		removeClass(this.button, CLASS_FULLSCREEN_EXIT);

		if (options.transition) {
		  removeClass(list, CLASS_TRANSITION);

		  if (this.viewed) {
			removeClass(image, CLASS_TRANSITION);
		  }
		}

		removeClass(viewer, CLASS_FIXED);
		setStyle(viewer, {
		  zIndex: options.zIndexInline
		});

		this.viewerData = assign({}, this.parentData);
		this.renderViewer();
		this.renderList();

		if (this.viewed) {
		  this.initImage(function () {
			_this6.renderImage(function () {
			  if (options.transition) {
				setTimeout(function () {
				  addClass(image, CLASS_TRANSITION);
				  addClass(list, CLASS_TRANSITION);
				}, 0);
			  }
			});
		  });
		}

		return this;
	  },


	  // Show the current ratio of the image with percentage
	  tooltip: function tooltip() {
		var _this7 = this;

		var options = this.options,
			tooltipBox = this.tooltipBox,
			imageData = this.imageData;


		if (!this.viewed || this.played || !options.tooltip) {
		  return this;
		}

		tooltipBox.textContent = Math.round(imageData.ratio * 100) + '%';

		if (!this.tooltipping) {
		  if (options.transition) {
			if (this.fading) {
			  dispatchEvent(tooltipBox, EVENT_TRANSITION_END);
			}

			addClass(tooltipBox, CLASS_SHOW);
			addClass(tooltipBox, CLASS_FADE);
			addClass(tooltipBox, CLASS_TRANSITION);

			// Force reflow to enable CSS3 transition
			// eslint-disable-next-line
			tooltipBox.offsetWidth;
			addClass(tooltipBox, CLASS_IN);
		  } else {
			addClass(tooltipBox, CLASS_SHOW);
		  }
		} else {
		  clearTimeout(this.tooltipping);
		}

		this.tooltipping = setTimeout(function () {
		  if (options.transition) {
			addListener(tooltipBox, EVENT_TRANSITION_END, function () {
			  removeClass(tooltipBox, CLASS_SHOW);
			  removeClass(tooltipBox, CLASS_FADE);
			  removeClass(tooltipBox, CLASS_TRANSITION);
			  _this7.fading = false;
			}, {
			  once: true
			});

			removeClass(tooltipBox, CLASS_IN);
			_this7.fading = true;
		  } else {
			removeClass(tooltipBox, CLASS_SHOW);
		  }

		  _this7.tooltipping = false;
		}, 1000);

		return this;
	  },


	  // Toggle the image size between its natural size and initial size
	  toggle: function toggle() {
		if (this.imageData.ratio === 1) {
		  this.zoomTo(this.initialImageData.ratio, true);
		} else {
		  this.zoomTo(1, true);
		}

		return this;
	  },


	  // Reset the image to its initial state
	  reset: function reset() {
		if (this.viewed && !this.played) {
		  this.imageData = assign({}, this.initialImageData);
		  this.renderImage();
		}

		return this;
	  },


	  // Update viewer when images changed
	  update: function update() {
		var element = this.element,
			options = this.options,
			isImg = this.isImg;

		// Destroy viewer if the target image was deleted

		if (isImg && !element.parentNode) {
		  return this.destroy();
		}

		var images = [];

		forEach(isImg ? [element] : element.querySelectorAll('img'), function (image) {
		  if (options.filter) {
			if (options.filter(image)) {
			  images.push(image);
			}
		  } else {
			images.push(image);
		  }
		});

		if (!images.length) {
		  return this;
		}

		this.images = images;
		this.length = images.length;

		if (this.ready) {
		  var indexes = [];

		  forEach(this.items, function (item, i) {
			var img = item.querySelector('img');
			var image = images[i];

			if (image) {
			  if (image.src !== img.src) {
				indexes.push(i);
			  }
			} else {
			  indexes.push(i);
			}
		  });

		  setStyle(this.list, {
			width: 'auto'
		  });

		  this.initList();

		  if (this.isShown) {
			if (this.length) {
			  if (this.viewed) {
				var index = indexes.indexOf(this.index);

				if (index >= 0) {
				  this.viewed = false;
				  this.view(Math.max(this.index - (index + 1), 0));
				} else {
				  addClass(this.items[this.index], CLASS_ACTIVE);
				}
			  }
			} else {
			  this.image = null;
			  this.viewed = false;
			  this.index = 0;
			  this.imageData = {};
			  this.canvas.innerHTML = '';
			  this.title.innerHTML = '';
			}
		  }
		} else {
		  this.build();
		}

		return this;
	  },


	  // Destroy the viewer
	  destroy: function destroy() {
		var element = this.element,
			options = this.options;


		if (!getData(element, NAMESPACE)) {
		  return this;
		}

		this.destroyed = true;

		if (this.ready) {
		  if (this.played) {
			this.stop();
		  }

		  if (options.inline) {
			if (this.fulled) {
			  this.exit();
			}

			this.unbind();
		  } else if (this.isShown) {
			if (this.viewing) {
			  if (this.imageRendering) {
				this.imageRendering.abort();
			  } else if (this.imageInitializing) {
				this.imageInitializing.abort();
			  }
			}

			if (this.hiding) {
			  this.transitioning.abort();
			}

			this.hidden();
		  } else if (this.showing) {
			this.transitioning.abort();
			this.hidden();
		  }

		  this.ready = false;
		  this.viewer.parentNode.removeChild(this.viewer);
		} else if (options.inline) {
		  if (this.delaying) {
			this.delaying.abort();
		  } else if (this.initializing) {
			this.initializing.abort();
		  }
		}

		if (!options.inline) {
		  removeListener(element, EVENT_CLICK, this.onStart);
		}

		removeData(element, NAMESPACE);
		return this;
	  }
	};

	var others = {
	  open: function open() {
		var body = this.body;


		addClass(body, CLASS_OPEN);

		body.style.paddingRight = this.scrollbarWidth + (parseFloat(this.initialBodyPaddingRight) || 0) + 'px';
	  },
	  close: function close() {
		var body = this.body;


		removeClass(body, CLASS_OPEN);
		body.style.paddingRight = this.initialBodyPaddingRight;
	  },
	  shown: function shown() {
		var element = this.element,
			options = this.options;


		this.fulled = true;
		this.isShown = true;
		this.render();
		this.bind();
		this.showing = false;

		if (isFunction(options.shown)) {
		  addListener(element, EVENT_SHOWN, options.shown, {
			once: true
		  });
		}

		if (dispatchEvent(element, EVENT_SHOWN) === false) {
		  return;
		}

		if (this.ready && this.isShown && !this.hiding) {
		  this.view(this.index);
		}
	  },
	  hidden: function hidden() {
		var element = this.element,
			options = this.options;


		this.fulled = false;
		this.viewed = false;
		this.isShown = false;
		this.close();
		this.unbind();
		addClass(this.viewer, CLASS_HIDE);
		this.resetList();
		this.resetImage();
		this.hiding = false;

		if (!this.destroyed) {
		  if (isFunction(options.hidden)) {
			addListener(element, EVENT_HIDDEN, options.hidden, {
			  once: true
			});
		  }

		  dispatchEvent(element, EVENT_HIDDEN);
		}
	  },
	  requestFullscreen: function requestFullscreen() {
		var document = this.element.ownerDocument;

		if (this.fulled && !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		  var documentElement = document.documentElement;


		  if (documentElement.requestFullscreen) {
			documentElement.requestFullscreen();
		  } else if (documentElement.msRequestFullscreen) {
			documentElement.msRequestFullscreen();
		  } else if (documentElement.mozRequestFullScreen) {
			documentElement.mozRequestFullScreen();
		  } else if (documentElement.webkitRequestFullscreen) {
			documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		  }
		}
	  },
	  exitFullscreen: function exitFullscreen() {
		if (this.fulled) {
		  var document = this.element.ownerDocument;

		  if (document.exitFullscreen) {
			document.exitFullscreen();
		  } else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		  } else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		  } else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		  }
		}
	  },
	  change: function change(e) {
		var options = this.options,
			pointers = this.pointers;

		var pointer = pointers[Object.keys(pointers)[0]];
		var offsetX = pointer.endX - pointer.startX;
		var offsetY = pointer.endY - pointer.startY;

		switch (this.action) {
		  // Move the current image
		  case ACTION_MOVE:
			this.move(offsetX, offsetY);
			break;

		  // Zoom the current image
		  case ACTION_ZOOM:
			this.zoom(getMaxZoomRatio(pointers), false, e);
			break;

		  case ACTION_SWITCH:
			{
			  this.action = 'switched';

			  var absoluteOffsetX = Math.abs(offsetX);

			  if (absoluteOffsetX > 1 && absoluteOffsetX > Math.abs(offsetY)) {
				// Empty `pointers` as `touchend` event will not be fired after swiped in iOS browsers.
				this.pointers = {};

				if (offsetX > 1) {
				  this.prev(options.loop);
				} else if (offsetX < -1) {
				  this.next(options.loop);
				}
			  }

			  break;
			}

		  default:
		}

		// Override
		forEach(pointers, function (p) {
		  p.startX = p.endX;
		  p.startY = p.endY;
		});
	  },
	  isSwitchable: function isSwitchable() {
		var imageData = this.imageData,
			viewerData = this.viewerData;


		return this.length > 1 && imageData.left >= 0 && imageData.top >= 0 && imageData.width <= viewerData.width && imageData.height <= viewerData.height;
	  }
	};

	var AnotherViewer = WINDOW.Viewer;

	var Viewer = function () {
	  /**
	   * Create a new Viewer.
	   * @param {Element} element - The target element for viewing.
	   * @param {Object} [options={}] - The configuration options.
	   */
	  function Viewer(element) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		classCallCheck(this, Viewer);

		if (!element || element.nodeType !== 1) {
		  throw new Error('The first argument is required and must be an element.');
		}

		this.element = element;
		this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
		this.action = false;
		this.fading = false;
		this.fulled = false;
		this.hiding = false;
		this.imageData = {};
		this.index = 0;
		this.isImg = false;
		this.isShown = false;
		this.length = 0;
		this.played = false;
		this.playing = false;
		this.pointers = {};
		this.ready = false;
		this.showing = false;
		this.timeout = false;
		this.tooltipping = false;
		this.viewed = false;
		this.viewing = false;
		this.wheeling = false;
		this.zooming = false;
		this.init();
	  }

	  createClass(Viewer, [{
		key: 'init',
		value: function init() {
		  var _this = this;

		  var element = this.element,
			  options = this.options;


		  if (getData(element, NAMESPACE)) {
			return;
		  }

		  setData(element, NAMESPACE, this);

		  var isImg = element.tagName.toLowerCase() === 'img';
		  var images = [];

		  forEach(isImg ? [element] : element.querySelectorAll('img'), function (image) {
			if (isFunction(options.filter)) {
			  if (options.filter.call(_this, image)) {
				images.push(image);
			  }
			} else {
			  images.push(image);
			}
		  });

		  if (!images.length) {
			return;
		  }

		  this.isImg = isImg;
		  this.length = images.length;
		  this.images = images;

		  var ownerDocument = element.ownerDocument;

		  var body = ownerDocument.body || ownerDocument.documentElement;

		  this.body = body;
		  this.scrollbarWidth = window.innerWidth - ownerDocument.documentElement.clientWidth;
		  this.initialBodyPaddingRight = window.getComputedStyle(body).paddingRight;

		  // Override `transition` option if it is not supported
		  if (isUndefined(document.createElement(NAMESPACE).style.transition)) {
			options.transition = false;
		  }

		  if (options.inline) {
			var count = 0;
			var progress = function progress() {
			  count += 1;

			  if (count === _this.length) {
				var timeout = void 0;

				_this.initializing = false;
				_this.delaying = {
				  abort: function abort() {
					clearTimeout(timeout);
				  }
				};

				// build asynchronously to keep `this.viewer` is accessible in `ready` event handler.
				timeout = setTimeout(function () {
				  _this.delaying = false;
				  _this.build();
				}, 0);
			  }
			};

			this.initializing = {
			  abort: function abort() {
				forEach(images, function (image) {
				  if (!image.complete) {
					removeListener(image, EVENT_LOAD, progress);
				  }
				});
			  }
			};

			forEach(images, function (image) {
			  if (image.complete) {
				progress();
			  } else {
				addListener(image, EVENT_LOAD, progress, {
				  once: true
				});
			  }
			});
		  } else {
			addListener(element, EVENT_CLICK, this.onStart = function (_ref) {
			  var target = _ref.target;

			  if (target.tagName.toLowerCase() === 'img') {
				_this.view(_this.images.indexOf(target));
			  }
			});
		  }
		}
	  }, {
		key: 'build',
		value: function build() {
		  if (this.ready) {
			return;
		  }

		  var element = this.element,
			  options = this.options;

		  var parent = element.parentNode;
		  var template = document.createElement('div');

		  template.innerHTML = TEMPLATE;

		  var viewer = template.querySelector('.' + NAMESPACE + '-container');
		  var title = viewer.querySelector('.' + NAMESPACE + '-title');
		  var toolbar = viewer.querySelector('.' + NAMESPACE + '-toolbar');
		  var navbar = viewer.querySelector('.' + NAMESPACE + '-navbar');
		  var button = viewer.querySelector('.' + NAMESPACE + '-button');
		  var canvas = viewer.querySelector('.' + NAMESPACE + '-canvas');

		  this.parent = parent;
		  this.viewer = viewer;
		  this.title = title;
		  this.toolbar = toolbar;
		  this.navbar = navbar;
		  this.button = button;
		  this.canvas = canvas;
		  this.footer = viewer.querySelector('.' + NAMESPACE + '-footer');
		  this.tooltipBox = viewer.querySelector('.' + NAMESPACE + '-tooltip');
		  this.player = viewer.querySelector('.' + NAMESPACE + '-player');
		  this.list = viewer.querySelector('.' + NAMESPACE + '-list');

		  addClass(title, !options.title ? CLASS_HIDE : getResponsiveClass(options.title));
		  addClass(navbar, !options.navbar ? CLASS_HIDE : getResponsiveClass(options.navbar));
		  toggleClass(button, CLASS_HIDE, !options.button);

		  if (options.backdrop) {
			addClass(viewer, NAMESPACE + '-backdrop');

			if (!options.inline && options.backdrop === true) {
			  setData(canvas, DATA_ACTION, 'hide');
			}
		  }

		  if (options.toolbar) {
			var list = document.createElement('ul');
			var custom = isPlainObject(options.toolbar);
			var zoomButtons = BUTTONS.slice(0, 3);
			var rotateButtons = BUTTONS.slice(7, 9);
			var scaleButtons = BUTTONS.slice(9);

			if (!custom) {
			  addClass(toolbar, getResponsiveClass(options.toolbar));
			}

			forEach(custom ? options.toolbar : BUTTONS, function (value, index) {
			  var deep = custom && isPlainObject(value);
			  var name = custom ? hyphenate(index) : value;
			  var show = deep && !isUndefined(value.show) ? value.show : value;

			  if (!show || !options.zoomable && zoomButtons.indexOf(name) !== -1 || !options.rotatable && rotateButtons.indexOf(name) !== -1 || !options.scalable && scaleButtons.indexOf(name) !== -1) {
				return;
			  }

			  var size = deep && !isUndefined(value.size) ? value.size : value;
			  var click = deep && !isUndefined(value.click) ? value.click : value;
			  var item = document.createElement('li');

			  item.setAttribute('role', 'button');
			  addClass(item, NAMESPACE + '-' + name);

			  if (!isFunction(click)) {
				setData(item, DATA_ACTION, name);
			  }

			  if (isNumber(show)) {
				addClass(item, getResponsiveClass(show));
			  }

			  if (['small', 'large'].indexOf(size) !== -1) {
				addClass(item, NAMESPACE + '-' + size);
			  } else if (name === 'play') {
				addClass(item, NAMESPACE + '-large');
			  }

			  if (isFunction(click)) {
				addListener(item, EVENT_CLICK, click);
			  }

			  list.appendChild(item);
			});

			toolbar.appendChild(list);
		  } else {
			addClass(toolbar, CLASS_HIDE);
		  }

		  if (!options.rotatable) {
			var rotates = toolbar.querySelectorAll('li[class*="rotate"]');

			addClass(rotates, CLASS_INVISIBLE);
			forEach(rotates, function (rotate) {
			  toolbar.appendChild(rotate);
			});
		  }

		  if (options.inline) {
			addClass(button, CLASS_FULLSCREEN);
			setStyle(viewer, {
			  zIndex: options.zIndexInline
			});

			if (window.getComputedStyle(parent).position === 'static') {
			  setStyle(parent, {
				position: 'relative'
			  });
			}

			parent.insertBefore(viewer, element.nextSibling);
		  } else {
			addClass(button, CLASS_CLOSE);
			addClass(viewer, CLASS_FIXED);
			addClass(viewer, CLASS_FADE);
			addClass(viewer, CLASS_HIDE);

			setStyle(viewer, {
			  zIndex: options.zIndex
			});

			var container = options.container;


			if (isString(container)) {
			  container = element.ownerDocument.querySelector(container);
			}

			if (!container) {
			  container = this.body;
			}

			container.appendChild(viewer);
		  }

		  if (options.inline) {
			this.render();
			this.bind();
			this.isShown = true;
		  }

		  this.ready = true;

		  if (isFunction(options.ready)) {
			addListener(element, EVENT_READY, options.ready, {
			  once: true
			});
		  }

		  if (dispatchEvent(element, EVENT_READY) === false) {
			this.ready = false;
			return;
		  }

		  if (this.ready && options.inline) {
			this.view();
		  }
		}

		/**
		 * Get the no conflict viewer class.
		 * @returns {Viewer} The viewer class.
		 */

	  }], [{
		key: 'noConflict',
		value: function noConflict() {
		  window.Viewer = AnotherViewer;
		  return Viewer;
		}

		/**
		 * Change the default options.
		 * @param {Object} options - The new default options.
		 */

	  }, {
		key: 'setDefaults',
		value: function setDefaults(options) {
		  assign(DEFAULTS, isPlainObject(options) && options);
		}
	  }]);
	  return Viewer;
	}();

	assign(Viewer.prototype, render, events, handlers, methods, others);

	return Viewer;

})));