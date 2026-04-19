/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.js ***!
  \*********************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{ var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ }),

/***/ "./src/ts/CheckDownloadCount.ts":
/*!**************************************!*\
  !*** ./src/ts/CheckDownloadCount.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);

// 这是一个 SW 脚本
// 每隔 24 小时查询一次下载记录数量，如果超过指定数量则向 Content Script 发送提示消息
// 不过 SW 被回收时不会检查，所以检查间隔经常会超过 24 小时
// 已知问题：查询下载记录时，Chrome 可以查询所有下载记录，但 Firefox 只会从活跃的下载记录里查询。
// 如果一些下载记录的时间较久，且文件已经不存在，那么 Firefox 通常不会返回它们，所以下载器查询不到这些记录
// 这意味着在 Firefox 上，查询结果的数量比实际数量少
const lastCheckKey = 'lastDownloadCountCheck';
const limit = 2000;
const interval = 24 * 60 * 60 * 1000;
// SW 每次启动时读取上一次检查到时间戳，如果超过 24 小时未检查则进行检查
setTimeout(async () => {
    const lastCheck = await loadLastCheckTime();
    const now = Date.now();
    if (!lastCheck || now - lastCheck.time > interval) {
        await queryDownloadCount();
    }
}, 5000);
// 检查下载记录数量是否超过指定值
async function queryDownloadCount() {
    try {
        const items = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().downloads.search({
            limit,
        });
        if (items.length >= limit) {
            await sendWarningToAllTabs();
        }
        // 无论是否触发警告，都保存本次检查时间戳
        await saveLastCheckTime();
    }
    catch (error) {
        console.error('检查下载记录数量时出错', error);
    }
}
// 保存本次检查时间戳到 storage.local
async function saveLastCheckTime() {
    await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.set({
        [lastCheckKey]: {
            time: Date.now(),
        },
    });
}
// 从 storage.local 读取上次检查时间戳
async function loadLastCheckTime() {
    const result = (await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.get(lastCheckKey));
    return result[lastCheckKey] || null;
}
// 向前台标签页发送消息
async function sendWarningToAllTabs() {
    const message = {
        message: 'highDownloadCountWarning',
        data: { count: limit },
    };
    const tabs = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.query({
        url: 'https://*.pixiv.net/*',
    });
    for (const tab of tabs) {
        if (tab.id !== undefined) {
            try {
                webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.sendMessage(tab.id, message);
            }
            catch (_) {
                // 该标签页没有监听器（未注入 content script），忽略
            }
        }
    }
}


/***/ }),

/***/ "./src/ts/ManageFollowing.ts":
/*!***********************************!*\
  !*** ./src/ts/ManageFollowing.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _backgroundAPI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./backgroundAPI */ "./src/ts/backgroundAPI.ts");


// 这是一个后台脚本，用于保存、维护、派发用户的关注列表
class ManageFollowing {
    constructor() {
        this.restore();
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.onInstalled.addListener(async () => {
            // 每次更新或刷新扩展时尝试读取数据，如果数据不存在则储存初始数据
            const data = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.get(this.store);
            if (data[this.store] === undefined ||
                Array.isArray(data[this.store]) === false) {
                this.storage();
            }
        });
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.onMessage.addListener(async (msg, sender) => {
            if (!this.isMsg(msg)) {
                return false;
            }
            if (msg.msg === 'requestFollowingData') {
                this.dispatchFollowingList(sender?.tab);
            }
            if (msg.msg === 'needUpdateFollowingData') {
                if (this.uploadStatus === 'locked') {
                    // 查询上次执行更新任务的标签页还是否存在，如果不存在，
                    // 则改为让这次发起请求的标签页执行更新任务
                    const tabs = await this.findAllPixivTab();
                    const find = tabs.find((tab) => tab.id === this.updateTaskTabID);
                    if (!find) {
                        this.updateTaskTabID = sender.tab.id;
                    }
                    else {
                        // 如果上次执行更新任务的标签页依然存在，且状态锁定，则拒绝这次请求
                        return;
                    }
                }
                else {
                    this.updateTaskTabID = sender.tab.id;
                }
                this.uploadStatus = 'locked';
                webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.sendMessage(this.updateTaskTabID, {
                    msg: 'updateFollowingData',
                });
            }
            if (msg.msg === 'setFollowingData') {
                // 当前台获取新的关注列表完成之后，会发送此消息。
                // 如果发送消息的页面和发起请求的页面是同一个，则解除锁定状态
                if (sender.tab.id === this.updateTaskTabID) {
                    this.uploadStatus = 'idle';
                }
                // 不管数据是否来自于发起请求的页面都更新数据。因为有些操作可能会直接更新数据，没有事先请求批准的环节
                // set 操作不会被放入等待队列中，而且总是会被立即执行
                // 这是因为在请求数据的过程中可能产生了其他操作，set 操作的数据可能已经是旧的了
                // 所以需要先应用 set 里的数据，然后再执行其他操作，在旧数据的基础上进行修改
                await this.setData(msg.data);
                // 如果队列中没有等待的操作，则立即派发数据并储存数据
                // 如果有等待的操作，则不派发和储存数据，因为稍后队列执行完毕后也会派发和储存数据
                // 这是为了避免重复派发和储存数据，避免影响性能
                if (this.queue.length === 0) {
                    this.dispatchFollowingList();
                    this.storage();
                }
            }
        });
        // 监听用户新增或取消一个关注的请求
        // 由于某些逻辑相似，就添加到一个监听器里了
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().webRequest.onBeforeRequest.addListener((details) => {
            if (details.method === 'POST') {
                if (details?.requestBody?.formData) {
                    let operate = {
                        action: '',
                        loggedUserID: '',
                        userID: '',
                    };
                    // 检查数据格式是否是自己需要的，以防这个 URL 有其他用途
                    const formData = details.requestBody.formData;
                    if (details.url.endsWith('bookmark_add.php')) {
                        const check = formData.mode &&
                            formData.mode[0] === 'add' &&
                            formData.user_id &&
                            formData.user_id[0];
                        if (check) {
                            operate.action = 'add';
                            operate.userID = formData.user_id[0];
                        }
                        else {
                            return;
                        }
                    }
                    if (details.url.endsWith('rpc_group_setting.php')) {
                        const check = formData.mode &&
                            formData.mode[0] === 'del' &&
                            formData.type &&
                            formData.type[0] === 'bookuser' &&
                            formData.id &&
                            formData.id[0];
                        if (check) {
                            operate.action = 'remove';
                            operate.userID = formData.id[0];
                        }
                        else {
                            return;
                        }
                    }
                    // 获取发起请求的标签页里的登录的用户 ID
                    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs
                        .sendMessage(details.tabId, {
                        msg: 'getLoggedUserID',
                    })
                        .then((response) => {
                        if (response?.loggedUserID) {
                            operate.loggedUserID = response.loggedUserID;
                            this.queue.push(operate);
                            this.executionQueue();
                        }
                    });
                }
            }
        }, {
            urls: [
                'https://*.pixiv.net/bookmark_add.php',
                'https://*.pixiv.net/rpc_group_setting.php',
            ],
            types: ['xmlhttprequest'],
        }, ['requestBody']);
        setInterval(() => {
            this.executionQueue();
        }, 1000);
        this.checkDeadlock();
        this.clearUnusedData();
    }
    store = 'following';
    data = [];
    uploadStatus = 'idle';
    updateTaskTabID = 0;
    /**当 uploadStatus 为 locked 时，如果需要增加或删除某个关注的用户，则将其放入等待队列 */
    queue = [];
    /** 是否已完成 restore */
    restored = false;
    async restore() {
        if (this.uploadStatus !== 'idle') {
            return;
        }
        this.uploadStatus = 'loading';
        const obj = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.get(this.store);
        if (obj[this.store] && Array.isArray(obj[this.store])) {
            this.data = obj[this.store];
            this.data.forEach((item) => {
                // followedUsersInfo 属性是在 18.4.0 版本添加的，在之前的版本里没有，所以需要添加它
                if (item.followedUsersInfo === undefined) {
                    item.followedUsersInfo = [];
                }
                // 18.3.1 版本添加了 deletedUsers 属性，但之后不再使用，所以需要移除它
                if (item.deletedUsers) {
                    delete item.deletedUsers;
                }
            });
            this.uploadStatus = 'idle';
            this.restored = true;
        }
    }
    /** 等待数据恢复完毕，然后再操作数据 */
    // SW 会在空闲 30 秒左右时被浏览器回收，当 SW 再次接到前台的消息时会被再次激活。
    // 此时需要等待数据恢复完毕再操作数据，否则会造成 BUG
    async waitRestored() {
        while (!this.restored) {
            await _backgroundAPI__WEBPACK_IMPORTED_MODULE_1__.backgroundAPI.sleep(100);
        }
    }
    // 收到消息时的类型守卫
    isMsg(msg) {
        return !!msg.msg;
    }
    /**向前台脚本派发数据
     * 可以指定向哪个 tab 派发
     * 如果未指定 tab，则向所有的 pixiv 标签页派发
     */
    async dispatchFollowingList(tab) {
        await this.waitRestored();
        if (tab?.id) {
            webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.sendMessage(tab.id, {
                msg: 'dispatchFollowingData',
                data: this.data,
            });
        }
        else {
            const tabs = await this.findAllPixivTab();
            for (const tab of tabs) {
                webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.sendMessage(tab.id, {
                    msg: 'dispatchFollowingData',
                    data: this.data,
                });
            }
        }
    }
    storage() {
        return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.set({ following: this.data });
    }
    /**执行队列中的所有操作 */
    async executionQueue() {
        if (this.uploadStatus !== 'idle' || this.queue.length === 0) {
            return;
        }
        while (this.queue.length > 0) {
            // set 操作不会在此处执行
            const queue = this.queue.shift();
            await this.addOrRemoveOne(queue);
        }
        // 队列中的所有操作完成后，派发和储存数据
        this.dispatchFollowingList();
        this.storage();
    }
    async setData(data) {
        await this.waitRestored();
        const index = this.data.findIndex((following) => following.user === data.user);
        if (index > -1) {
            // 更新当前登录的用户的关注数据
            this.data[index].following = data.following;
            this.data[index].total = data.total;
            this.data[index].time = Date.now();
            // 历史关注数据采用追加模式，而非直接覆盖
            data.followedUsersInfo.forEach((newUserInfo) => {
                const oldUserInfo = this.data[index].followedUsersInfo.find((userInfo) => userInfo.id === newUserInfo.id);
                if (oldUserInfo) {
                    oldUserInfo.name = newUserInfo.name;
                    oldUserInfo.avatar = newUserInfo.avatar;
                    oldUserInfo.deleteByUser = false;
                    oldUserInfo.exist = true;
                }
                else {
                    this.data[index].followedUsersInfo.push(newUserInfo);
                }
            });
        }
        else {
            // 如果之前没有保存过当前登录的用户的关注数据，就新增一份数据
            this.data.push({
                user: data.user,
                following: data.following,
                followedUsersInfo: data.followedUsersInfo,
                total: data.total,
                time: Date.now(),
            });
        }
    }
    async addOrRemoveOne(operate) {
        const i = this.data.findIndex((following) => following.user === operate.loggedUserID);
        if (i === -1) {
            return;
        }
        if (operate.action === 'add') {
            this.data[i].following.push(operate.userID);
            this.data[i].total = this.data[i].total + 1;
            // 当用户手动关注一个用户时，需要把这个用户的信息添加到 followedUsersInfo 里
            const userInfo = this.data[i].followedUsersInfo.find((user) => user.id === operate.userID);
            if (!userInfo) {
                try {
                    const userData = await _backgroundAPI__WEBPACK_IMPORTED_MODULE_1__.backgroundAPI.getUserProfile(operate.userID, '0');
                    this.data[i].followedUsersInfo.push({
                        id: operate.userID,
                        name: userData.body.name || '',
                        avatar: userData.body.imageBig || userData.body.image || '',
                        deleteByUser: false,
                        exist: true,
                    });
                }
                catch (error) {
                    console.log(`addOrRemoveOne: 获取用户 ${operate.userID} 的信息时出错了`, error);
                }
            }
            else {
                userInfo.deleteByUser = false;
                userInfo.exist = true;
            }
        }
        else if (operate.action === 'remove') {
            // 更新关注列表和总数
            const index = this.data[i].following.findIndex((id) => id === operate.userID);
            if (index > -1) {
                this.data[i].following.splice(index, 1);
                this.data[i].total = this.data[i].total - 1;
            }
            // 更新 followedUsersInfo 里的状态
            const userInfo = this.data[i].followedUsersInfo.find((user) => user.id === operate.userID);
            if (userInfo) {
                userInfo.deleteByUser = true;
                userInfo.exist = true;
            }
        }
        else {
            return;
        }
        this.data[i].time = Date.now();
    }
    async findAllPixivTab() {
        const tabs = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.query({
            url: 'https://*.pixiv.net/*',
        });
        return tabs;
    }
    /**解除死锁
     * 一个标签页在执行更新任务时可能会被用户关闭，这会导致锁死
     * 定时检查执行更新任务的标签页是否还存在，如果不存在则解除死锁
     */
    checkDeadlock() {
        setInterval(async () => {
            if (this.uploadStatus === 'locked') {
                const tabs = await this.findAllPixivTab();
                const find = tabs.find((tab) => tab.id === this.updateTaskTabID);
                if (!find) {
                    this.uploadStatus = 'idle';
                }
            }
        }, 30000);
    }
    /**如果某个用户的关注数据 30 天没有修改过，则清除对应的数据 */
    clearUnusedData() {
        setInterval(() => {
            const day30ms = 2592000000;
            const beforeLen = this.data.length;
            this.data = this.data.filter((item) => Date.now() - item.time <= day30ms);
            if (this.data.length !== beforeLen) {
                this.dispatchFollowingList();
                this.storage();
            }
        }, 3600000);
    }
}
new ManageFollowing();


/***/ }),

/***/ "./src/ts/backgroundAPI.ts":
/*!*********************************!*\
  !*** ./src/ts/backgroundAPI.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   backgroundAPI: () => (/* binding */ backgroundAPI)
/* harmony export */ });
class backgroundAPI {
    /** 获取用户信息。full=0 获取简略信息，full=1 获取完整信息 */
    // 如果这个用户不存在了，获取他的数据时会返回 403 状态码，例如：
    // https://www.pixiv.net/ajax/user/16689973?full=0
    static async getUserProfile(id, full = '1') {
        const url = `https://www.pixiv.net/ajax/user/${id}?full=${full}`;
        return this.fetch(url);
    }
    static async fetch(url) {
        const response = await fetch(url);
        if (response.ok) {
            // 请求成功，直接返回数据
            const data = await response.json();
            return data;
        }
        else {
            // 请求成功,但状态码异常
            console.error(`Status Code: ${response.status}`);
            throw {
                status: response.status,
                statusText: response.statusText,
            };
        }
    }
    static async sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************************!*\
  !*** ./src/ts/background.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ManageFollowing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageFollowing */ "./src/ts/ManageFollowing.ts");
/* harmony import */ var _CheckDownloadCount__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CheckDownloadCount */ "./src/ts/CheckDownloadCount.ts");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_2__);



// 当点击扩展图标时，显示/隐藏下载面板
webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().action.onClicked.addListener(function (tab) {
    // 如果在本程序没有权限的页面上点击扩展图标，url 始终是 undefined，此时不发送消息
    if (!tab.url) {
        return;
    }
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().tabs.sendMessage(tab.id, {
        msg: 'click_icon',
    });
});
// 当扩展被安装、被更新、或者浏览器升级时，初始化数据
webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().runtime.onInstalled.addListener(() => {
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().storage.local.set({ batchNo: {}, idList: {} });
});
// 存储每个下载任务的数据，这是因为下载完成的顺序和前台发送的顺序可能不一致，所以需要把数据保存起来以供使用
const dlData = {};
/** 使用每个标签页的 tabId 作为索引，储存此标签页里当前下载任务的编号。用来判断不同批次的下载 */
let batchNo = {};
/** 使用每个标签页的 tabId 作为索引，储存此标签页发送到 SW 的每个下载请求的作品 id，用来判断重复的任务 */
let idList = {};
// batchNo 和 idList 需要持久化存储（但是当浏览器关闭并重新启动时可以清空，因为此时前台的下载任务必然和浏览器关闭之前的不是同一批了，所以旧的数据已经没用了）
// 如果不进行持久化存储，如果前台任务处于下载途中，后台 SW 被回收了，那么变量也会被清除。之后前台传递过来的可能还是同一批下载里的任务，但是后台却丢失了记录。这可能会导致下载出现重复文件等异常。
// 实际上，下载时后台 SW 会持续存在很长时间，不会轻易被回收的。持久化存储只是为了以防万一
async function setData(data) {
    return webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().storage.local.set(data);
}
// 类型守卫，这是为了通过类型检查，所以只要求有 msg 属性
// 如果检查了其他属性，那么对于只有 msg 属性的简单消息就会不通过。所以不检查其他属性
function isMsg(msg) {
    return !!msg.msg;
}
webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().runtime.onMessage.addListener(async function (msg, sender) {
    // msg 是 SendToBackEndData 类型，但是 webextension-polyfill 的 msg 是 unknown，
    // 不能直接在上面设置类型为 msg: SendToBackEndData，否则会报错。因此需要使用类型守卫，真麻烦
    if (!isMsg(msg)) {
        console.warn('收到了无效的消息:', msg);
        return false;
    }
    const tabId = sender.tab.id;
    // 当存在同名文件时，默认覆写，但前台也可以指定处理方式
    const conflictAction = msg.conflictAction || 'overwrite';
    // 下载作品的文件
    if (msg.msg === 'save_work_file') {
        // 当处于初始状态时，或者变量被回收了，就从存储中读取数据储存在变量中
        // 之后每当要使用这两个数据时，从变量读取，而不是从存储中获得。这样就解决了数据不同步的问题，而且性能更高
        if (Object.keys(batchNo).length === 0) {
            const data = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().storage.local.get(['batchNo', 'idList']);
            batchNo = data.batchNo;
            idList = data.idList;
        }
        // 如果开始了新一批的下载，重设批次编号，并清空下载索引
        if (batchNo[tabId] !== msg.taskBatch) {
            batchNo[tabId] = msg.taskBatch;
            idList[tabId] = [];
            setData({ batchNo, idList });
            // 这里存储数据时不需要使用 await，因为后面使用的是全局变量，所以不需要关心存储数据的同步问题
        }
        // 检查任务是否重复，不重复则下载
        if (!idList[tabId].includes(msg.id)) {
            // 储存该任务的索引
            idList[tabId].push(msg.id);
            setData({ idList });
            // 开始下载
            const _url = await getFileURL(msg);
            webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().downloads
                .download({
                url: _url,
                filename: msg.fileName,
                conflictAction,
                saveAs: false,
            })
                .then((id) => {
                // id 是新建立的下载项的 id，使用它作为 key 保存数据
                dlData[id] = {
                    blobURLFront: msg.blobURL,
                    blobURLBack: _url.startsWith('blob:') ? _url : '',
                    id: msg.id,
                    tabId: tabId,
                    uuid: false,
                };
            });
        }
    }
    // 有些文件本身不在抓取结果 store.result 里，所以也不会出现在下载进度条上
    // 对于这些文件直接下载，不需要返回下载结果
    if (msg.msg === 'save_description_file' ||
        msg.msg === 'save_novel_cover_file' ||
        msg.msg === 'save_novel_embedded_image' ||
        msg.msg === 'save_novel_series_file') {
        const _url = await getFileURL(msg);
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().downloads
            .download({
            url: _url,
            filename: msg.fileName,
            conflictAction,
            saveAs: false,
        })
            .then((id) => {
            dlData[id] = {
                blobURLFront: msg.blobURL,
                blobURLBack: _url.startsWith('blob:') ? _url : '',
                id: msg.id,
                tabId: tabId,
                uuid: false,
                noReply: true,
            };
        });
    }
    // 使用 a.download 来下载文件时，不调用 downloads API，并且直接返回下载成功的模拟数据
    if (msg.msg === 'save_work_file_a_download') {
        const tabId = sender.tab.id;
        const data = {
            msg: 'downloaded',
            data: {
                url: '',
                id: msg.id,
                tabId,
                uuid: false,
            },
            err: '',
        };
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().tabs.sendMessage(tabId, data);
    }
    if (msg.msg === 'clearDownloadsTempData') {
        if (sender.tab?.id) {
            const tabId = sender.tab.id;
            delete idList[tabId];
            delete batchNo[tabId];
            setData({ batchNo, idList });
        }
    }
    return false;
});
const isFirefox = navigator.userAgent.includes('Firefox');
async function getFileURL(msg) {
    // 在 Chrome 的隐私窗口里，使用 dataURL
    if (msg.dataURL) {
        return msg.dataURL;
    }
    // 在 Firefox 里，使用 blob 并生成 blob URL
    if (isFirefox && msg.blob) {
        return URL.createObjectURL(msg.blob);
    }
    // 在 Chrome 的正常窗口里，使用 blob URL
    if (msg.blobURL) {
        return msg.blobURL;
    }
    console.error('没有找到可用的下载 URL 或数据');
    return '';
}
function revokeBlobURL(url) {
    if (url && url.startsWith('blob:')) {
        if (typeof URL !== 'undefined' &&
            typeof URL.revokeObjectURL === 'function') {
            URL.revokeObjectURL(url);
        }
    }
}
// 判断文件名是否变成了 UUID 格式。因为文件名处于整个绝对路径的中间，所以没加首尾标记 ^ $
const UUIDRegexp = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/;
// 监听下载变化事件
// 每个下载会触发两次 onChanged 事件
webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().downloads.onChanged.addListener(async function (detail) {
    // 根据 detail.id 取出保存的数据
    const _dlData = dlData[detail.id];
    if (_dlData) {
        let msg = '';
        let err = '';
        // 判断当前文件名是否正常。下载时必定会有一次 detail.filename.current 有值
        if (detail.filename && detail.filename.current) {
            const changedName = detail.filename.current;
            if (changedName.match(UUIDRegexp) !== null) {
                // 文件名是 UUID
                _dlData.uuid = true;
            }
            _dlData.browserSetFilename = changedName;
        }
        if (detail.state && detail.state.current === 'complete') {
            msg = 'downloaded';
        }
        if (detail.error && detail.error.current) {
            msg = 'download_err';
            err = detail.error.current;
            // 当保存一个文件出错时，从任务记录列表里删除它，以便前台重试下载
            const idIndex = idList[_dlData.tabId].findIndex((val) => val === _dlData.id);
            idList[_dlData.tabId][idIndex] = '';
            setData({ idList });
        }
        if (msg) {
            // 返回信息
            if (!_dlData.noReply) {
                webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().tabs.sendMessage(_dlData.tabId, { msg, data: _dlData, err });
            }
            // 吊销前后台生成的 blob URL
            revokeBlobURL(_dlData?.blobURLFront);
            revokeBlobURL(_dlData?.blobURLBack);
            // 删除保存的数据
            delete dlData[detail.id];
            dlData[detail.id] = null;
        }
    }
});
// 清除不需要的数据，避免数据体积越来越大
async function clearData() {
    for (const key of Object.keys(idList)) {
        const tabId = parseInt(key);
        try {
            await webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().tabs.get(tabId);
        }
        catch (error) {
            // 如果建立下载任务的标签页已经不存在，则会触发错误，如：
            // Unchecked runtime.lastError: No tab with id: 1943988409.
            // 此时删除对应的数据
            delete idList[tabId];
            delete batchNo[tabId];
        }
    }
    setData({ batchNo, idList });
}
setInterval(() => {
    clearData();
}, 3600000);

})();

/******/ })()
;
//# sourceMappingURL=background.js.map