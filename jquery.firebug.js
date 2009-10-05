/*global jQuery */

/* TODO:
 *
 * map native console commands to accept multiple arguments
 * 
 * weird issue with
 * 
 * handle firebug.inspect method
 *
 * better grouping in FbLite
 * 
 * support FbLite firebug.d.console.cmd fallbacks
 * 
 * string formatting doesn't work
 * 
 * support console utility methods (open/close, minimize/maximize, clear, run)
 * 
 * reconfigure log() behavior
 * 
 * allow runtime changes in settings
 * 
 * support groupCollapsed()
 */

(function ($) {
    /****************************************************************************/
    /***  Degrading Script Tags : http://ejohn.org/blog/degrading-script-tags ***/
    /***  This block must never be used in an embedded script                 ***/
    /***  Determine Firebug options from this script tag                      ***/
    var bootstrap = eval("(" + document.getElementsByTagName("script")[document.getElementsByTagName("script").length - 1].innerHTML + ")");
    /****************************************************************************/

    $.firebug = {
        defaults: {
            debug: false,
            lite: {
				override: false,
				// absolute or relative (to document) URI
				src: "http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js",
				//css: "firebuglite/firebug-lite.css",
                minimized: true,
				height: 295,
                watchXHR: true
            },
            methods: ["assert", "log", "debug", "info", "warn", "error", "dir", "dirxml", "count", "trace", "group", "groupEnd", "time", "timeEnd", "profile", "profileEnd"],
			enumerateContents: false
        },

        mountFirebugLite: function (options) {
            var settings = $.extend(true, {}, $.firebug.defaults, options);

            $(document).ready(function () {
				window.firebug = window.firebug || {}
				$.extend(window.firebug.env, settings.lite);
                var firebug = document.createElement('script');
                firebug.setAttribute('src', settings.lite.src);
                document.body.appendChild(firebug);
				(function(){
                    if (window.firebug && window.firebug.version) {
                        // Firebug Lite has been imported
						$.extend(window.firebug.env, settings.lite);
						
						// @TEMP fix for overwriting window.console
						if (window.firebug.env.override) {
							window.console = {"provider": "Firebug Lite"};
							for (var command in firebug.d.console.cmd) {
								window.console[command] = firebug.lib.util.Curry(firebug.d.console.run, window, command);
							};
							
							window.onerror = function(_message, _file, _line){
								firebug.d.console.run('error', firebug.lib.util.String.format('{0} ({1},{2})', _message, firebug.getFileName(_file), _line));
							};
						}
						// #end @TEMP fix
						
                        window.firebug.init();
						
                        // Open to desired state - window.firebug.win.close();
                        if (settings.lite.minimized) {
							window.firebug.win.minimize();
						}
						else {
							window.firebug.win.maximize();
						}
                        
                        // add watchXHR support
                        $.ajaxSetup({watch: settings.lite.watchXHR});
                        $.ajax = function (ajax_super) {
                            return function (options) {
                                var opts = $.extend(true, {}, $.ajaxSettings, options);
                                var xhr = ajax_super.apply(this, arguments);
                                if (opts && opts.watch) {
                                    window.firebug.watchXHR(xhr);
                                }
                                return xhr;
                            };
                        }($.ajax);

                        // re-map missing console commands to Firebug Lite commands
                        var groupStack = [];
                        for (var method in settings.methods) {
                            if (settings.methods.hasOwnProperty(method)) {
                                switch (settings.methods[method]) {
                                // use log() to form a sort of group
                                case "group":
                                    window.console.group = function () {
                                        return function () {
                                            // replace the jQuery object as first argument because its useless when printed in FirebugLite
                                            var args = $.makeArray(arguments);
                                            args[0] = "Group Start: ";
                                            groupStack.push(args);
                                            window.console.log.apply(window.console, args);
                                        };
                                    }();
                                    break;
                                // use log() to form a sort of group
                                case "groupEnd":
                                    window.console.groupEnd = function () {
                                        return function () {
                                            var args = groupStack.pop();
                                            args[0] = "Group End: ";
                                            window.console.log.apply(window.console, args);
                                        };
                                    }();
                                    break;
                                // use log() for assert
                                case "assert":
                                    window.console.assert = function () {
                                        return function () {
                                            // drop the 'false' argument
                                            var args = $.makeArray(arguments);
                                            args.shift();
											window.console.error("Assertion Failed: ");
											if (args.length) {
												window.console.error.apply(window.console, args);
											}
                                        };
                                    }();
                                    break;
                                default:
                                    break;
                                }
                            }
                        }

                    }
                    else {
                        setTimeout(arguments.callee);
                    }
				})();
//                    void (firebug);
            });
        },

        mountFirebug: function (options) {
            var settings = $.extend({}, $.firebug.defaults, options);
			
            // foreach Firebug method, create an associated jQuery function
            for (var method in settings.methods) {
                if (settings.methods.hasOwnProperty(method)) {
                    // set a blank function foreach console method to avoid 'function undefined' errors
//                    if (!window.console[settings.methods[method]]) {
//                        window.console[settings.methods[method]] = (function() {
//							return function () {};
//						});
//                    }
                    switch (settings.methods[method]) {
                    case "log":
                    case "debug":
                    case "info":
                    case "warn":
                    case "error":
                        $.fn[settings.methods[method]] = function (settings, method) {
                            return function () {
                                // parse out jQuery '.method' commands to call on jQuery object
                                $.each(arguments, function(self, args){
                                    return function(key, value){
                                        var found = false;
                                        if (value && value.match && (found = value.match(/^\.(([a-zA-Z]+[a-zA-Z0-9_\-]*)(?:\(.*\))?)$/))) {
                                            if ($(self)[found[2]]) {
                                                with ($(self)) {
                                                    args[key] = eval(found[1]);
                                                }
                                            }
                                        }
										else if(value == "this"){
											args[key] = $(self);
										}
                                    };
                                }(this, arguments));
                                if (arguments.length) {
                                    window.console[method].apply(window.console, arguments);
                                }

								if (settings.enumerateContents) {
									// group this jQuery object, calling the method on each item
									window.console.group(this);
									this.each(function(i){
										window.console[method](this);
									});
									window.console.groupEnd();
								}
                                return this;
                            };
                        }(settings, settings.methods[method]);
                        break;
                    case "dir":
                    case "dirxml":
                        $.fn[settings.methods[method]] = function (settings, method) {
                            return function () {
                                if (arguments.length) {
                                    window.console[method].apply(window.console, arguments);
                                }

								if (settings.enumerateContents) {
									// group this jQuery object, calling the method on each item
									window.console.group(this);
									this.each(function(i){
										window.console.group(this);
										window.console[method](this);
										window.console.groupEnd();
									});
									window.console.groupEnd();
								}
                                return this;
                            };
                        }(settings, settings.methods[method]);
                        break;
                    case "assert":
                        // group the jQuery object and call assert on each item
                        $.fn[settings.methods[method]] = function (settings, method) {
                            return function () {
								if (arguments.length && !arguments[0]) {
									window.console[method].apply(window.console, arguments);
									
									if (settings.enumerateContents) {
										window.console.group(this);
										this.each(function(i){
											window.console.error(this);
										});
										window.console.groupEnd();
									}
								}
                                return this;
                            };
                        }(settings, settings.methods[method]);
                        break;
                    case "time":
                    case "timeEnd":
                    case "group":
                    case "groupEnd":
                        // apply these commands directly (add jQuery object as arg0), return the jQuery object
                        $.fn[settings.methods[method]] = function (settings, method) {
                            return function () {
                                var args = (arguments.length? arguments : [this]);
                                window.console[method].apply(window.console, args);
                                return this;
                            };
                        }(settings, settings.methods[method]);
                        break;
                    case "trace":
                        // apply these commands directly, returning the jQuery object
                        $.fn[settings.methods[method]] = function (settings, method) {
                            return function () {
                                window.console.group("Trace: ", this);
                                window.console[method].apply(window.console, arguments);
                                window.console.groupEnd();
                                return this;
                            };
                        }(settings, settings.methods[method]);
                        break;
                    case "count":
                    case "profile":
                    case "profileEnd":
                        // apply these commands directly, returning the jQuery object
                        $.fn[settings.methods[method]] = function (settings, method) {
                            return function () {
                                window.console[method].apply(window.console, arguments);
                                return this;
                            };
                        }(settings, settings.methods[method]);
                        break;
                    default:
                        break;
                    }
                }
            }
        },

		mountConsole: function (options, baseMethod) {
			var settings = $.extend(true, {}, $.firebug.defaults, options);
		    
		    if (!window.console) {
				if(!window.opera || !window.opera.postError){
					// Safari and Chrome have console.log
					// Opera has opera.postError
					// IE (with addons) has console
					// Firefox (with Firebug) has console
					// All others need Firebug Lite to create console
					return false;
				}
				window.console = {};
			}

			// for Opera
			if(window.opera && window.opera.postError){
			    for (var method in settings.methods) {
					if (settings.methods.hasOwnProperty(method)) {
						window.console[settings.methods[method]] = (function(method){
							return function(){
								var msg = method + ": " + arguments.join(" ");
								window.opera.postError(msg);
							};
						})(settings.methods[method]);
					}
				}
			}
			// for Safari, Chrome, IE
			else {
				// set log() method as base method
				if(!window.console.log){
					window.console.log = baseMethod || function(){};
				}
				
			    for (var method in settings.methods) {
					if (settings.methods.hasOwnProperty(method)) {
						switch(settings.methods[method]){
		                case "log":
		                case "debug":
		                case "info":
		                case "warn":
		                case "error":
							if (window.console[settings.methods[method]]) {
								window.console["_" + settings.methods[method]] = window.console[settings.methods[method]];
								window.console[settings.methods[method]] = (function(method){
									return function(){
										window.console["_" + method]($.makeArray(arguments).join(" "));
									};
								})(settings.methods[method]);
							}
							else {
								window.console[settings.methods[method]] = function(){
									var msg = $.makeArray(arguments).join(" ");
									window.console.log(msg);
								};
							}
							break;
						case "assert":
	                    case "dir":
	                    case "dirxml":
	                    case "time":
	                    case "timeEnd":
	                    case "group":
	                    case "groupEnd":
						case "trace":
	                    case "count":
	                    case "profile":
	                    case "profileEnd":
						default:
							if (!window.console[settings.methods[method]]) {
								window.console[settings.methods[method]] = (function(method){
									return function(){
										var msg = method + ": " + $.makeArray(arguments).join(" ");
										window.console.log(msg);
									};
								})(settings.methods[method]);
							}
							break;
						}
					}
				}
			}
		}
    };

	bootstrap = $.extend(true, {}, $.firebug.defaults, bootstrap);

	$.firebug.mountConsole(bootstrap);
	if (!window.console) {
		$.firebug.mountFirebugLite(bootstrap);
	}
	$.firebug.mountFirebug(bootstrap);
})(jQuery);
