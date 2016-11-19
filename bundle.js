/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _easyTyped = __webpack_require__(3);

	var _easyTyped2 = _interopRequireDefault(_easyTyped);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DEFINITION = {
	    name: String,
	    surname: String,
	    age: Number
	};

	var INITITAL_TARGET = {
	    name: 'Francesco'
	};

	var person = (0, _easyTyped2.default)({
	    target: INITITAL_TARGET,
	    definition: DEFINITION });

	var printToDOM = function printToDOM() {
	    document.getElementById('data').innerText = JSON.stringify(person, undefined, 2);
	    document.getElementById('error').innerText = "";
	};

	var setSurname = function setSurname(surname) {
	    person.surname = surname;
	    printToDOM();
	};

	var setAge = function setAge(age) {
	    person.age = age;
	    printToDOM();
	};

	var onerror = function onerror(event) {
	    document.getElementById('error').innerText = event;
	    return false;
	};

	Object.assign(window, {
	    setAge: setAge,
	    setSurname: setSurname,
	    onerror: onerror
	});

	printToDOM();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/*
	 * Copyright 2016 Google Inc. All rights reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
	 * use this file except in compliance with the License. You may obtain a copy of
	 * the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
	 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
	 * License for the specific language governing permissions and limitations under
	 * the License.
	 */

	'use strict';


	(function(scope) {
	  if (scope['Proxy']) {
	    return;
	  }
	  let lastRevokeFn = null;

	  /**
	   * @param {*} o
	   * @return {boolean} whether this is probably a (non-null) Object
	   */
	  function isObject(o) {
	    return o ? (typeof o == 'object' || typeof o == 'function') : false;
	  }

	  /**
	   * @constructor
	   * @param {!Object} target
	   * @param {{apply, construct, get, set}} handler
	   */
	  scope.Proxy = function(target, handler) {
	    if (!isObject(target) || !isObject(handler)) {
	      throw new TypeError('Cannot create proxy with a non-object as target or handler');
	    }

	    // Construct revoke function, and set lastRevokeFn so that Proxy.revocable can steal it.
	    // The caller might get the wrong revoke function if a user replaces or wraps scope.Proxy
	    // to call itself, but that seems unlikely especially when using the polyfill.
	    let throwRevoked = function() {};
	    lastRevokeFn = function() {
	      throwRevoked = function(trap) {
	        throw new TypeError(`Cannot perform '${trap}' on a proxy that has been revoked`);
	      };
	    };

	    // Fail on unsupported traps: Chrome doesn't do this, but ensure that users of the polyfill
	    // are a bit more careful. Copy the internal parts of handler to prevent user changes.
	    let unsafeHandler = handler;
	    handler = {'get': null, 'set': null, 'apply': null, 'construct': null};
	    for (let k in unsafeHandler) {
	      if (!(k in handler)) {
	        throw new TypeError(`Proxy polyfill does not support trap '${k}'`);
	      }
	      handler[k] = unsafeHandler[k];
	    }
	    if (typeof unsafeHandler == 'function') {
	      // Allow handler to be a function (which has an 'apply' method). This matches what is
	      // probably a bug in native versions. It treats the apply call as a trap to be configured.
	      handler.apply = unsafeHandler.apply.bind(unsafeHandler);
	    }

	    // Define proxy as this, or a Function (if either it's callable, or apply is set).
	    // TODO(samthor): Closure compiler doesn't know about 'construct', attempts to rename it.
	    let proxy = this;
	    let isMethod = false;
	    let targetIsFunction = typeof target == 'function';
	    if (handler.apply || handler['construct'] || targetIsFunction) {
	      proxy = function Proxy() {
	        let usingNew = (this && this.constructor === proxy);
	        throwRevoked(usingNew ? 'construct' : 'apply');

	        if (usingNew && handler['construct']) {
	          return handler['construct'].call(this, target, arguments);
	        } else if (!usingNew && handler.apply) {
	          return handler.apply(target, this, arguments);
	        } else if (targetIsFunction) {
	          // since the target was a function, fallback to calling it directly.
	          if (usingNew) {
	            // inspired by answers to https://stackoverflow.com/q/1606797
	            let all = Array.prototype.slice.call(arguments);
	            all.unshift(target);  // pass class as first arg to constructor, although irrelevant
	            // nb. cast to convince Closure compiler that this is a constructor
	            let f = /** @type {!Function} */ (target.bind.apply(target, all));
	            return new f();
	          }
	          return target.apply(this, arguments);
	        }
	        throw new TypeError(usingNew ? 'not a constructor' : 'not a function');
	      };
	      isMethod = true;
	    }

	    // Create default getters/setters. Create different code paths as handler.get/handler.set can't
	    // change after creation.
	    let getter = handler.get ? function(prop) {
	      throwRevoked('get');
	      return handler.get(this, prop, proxy);
	    } : function(prop) {
	      throwRevoked('get');
	      return this[prop];
	    };
	    let setter = handler.set ? function(prop, value) {
	      throwRevoked('set');
	      let status = handler.set(this, prop, value, proxy);
	      if (!status) {
	        // TODO(samthor): If the calling code is in strict mode, throw TypeError.
	        // It's (sometimes) possible to work this out, if this code isn't strict- try to load the
	        // callee, and if it's available, that code is non-strict. However, this isn't exhaustive.
	      }
	    } : function(prop, value) {
	      throwRevoked('set');
	      this[prop] = value;
	    };

	    // Clone direct properties (i.e., not part of a prototype).
	    let propertyNames = Object.getOwnPropertyNames(target);
	    let propertyMap = {};
	    propertyNames.forEach(function(prop) {
	      if (isMethod && prop in proxy) {
	        return;  // ignore properties already here, e.g. 'bind', 'prototype' etc
	      }
	      let real = Object.getOwnPropertyDescriptor(target, prop);
	      let desc = {
	        enumerable: !!real.enumerable,
	        get: getter.bind(target, prop),
	        set: setter.bind(target, prop),
	      };
	      Object.defineProperty(proxy, prop, desc);
	      propertyMap[prop] = true;
	    });

	    // Set the prototype, or clone all prototype methods (always required if a getter is provided).
	    // TODO(samthor): We don't allow prototype methods to be set. It's (even more) awkward.
	    // An alternative here would be to _just_ clone methods to keep behavior consistent.
	    let prototypeOk = true;
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(proxy, Object.getPrototypeOf(target));
	    } else if (proxy.__proto__) {
	      proxy.__proto__ = target.__proto__;
	    } else {
	      prototypeOk = false;
	    }
	    if (handler.get || !prototypeOk) {
	      for (let k in target) {
	        if (propertyMap[k]) {
	          continue;
	        }
	        Object.defineProperty(proxy, k, {get: getter.bind(target, k)});
	      }
	    }

	    // The Proxy polyfill cannot handle adding new properties. Seal the target and proxy.
	    Object.seal(target);
	    Object.seal(proxy);

	    return proxy;  // nb. if isMethod is true, proxy != this
	  };

	  scope.Proxy.revocable = function(target, handler) {
	    let p = new scope.Proxy(target, handler);
	    return {'proxy': p, 'revoke': lastRevokeFn};
	  };

	  scope.Proxy['revocable'] = scope.Proxy.revocable;
	  scope['Proxy'] = scope.Proxy;
	})(typeof module !== 'undefined' && module['exports'] ? global : window);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var typeOfValidatorFactory = function typeOfValidatorFactory(expectation) {
	    return function (value, name) {
	        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== expectation) {
	            throw new Error(value.constructor.name + ' is not a valid for \'' + name + '\' property. Should be String');
	        }
	    };
	};

	var validators = {
	    'String': typeOfValidatorFactory('string'),
	    'Number': typeOfValidatorFactory('number'),
	    'Boolean': typeOfValidatorFactory('boolean')
	};

	exports.default = function (_ref) {
	    var target = _ref.target,
	        definition = _ref.definition;

	    var proxy = void 0;

	    var set = function set(target, name, value) {
	        var currentDefinition = definition[name];

	        if (!currentDefinition) {
	            throw new Error(name + ' is not a valid property for this object');
	        }

	        var validator = validators[currentDefinition.name] || function () {};

	        validator(value, name);

	        target[name] = value;

	        return true;
	    };

	    var handler = {
	        set: set
	    };

	    proxy = new Proxy(target, handler);

	    return proxy;
	};

/***/ }
/******/ ]);