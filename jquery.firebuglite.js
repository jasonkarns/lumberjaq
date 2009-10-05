/*global jQuery */
if (window.DEBUG === undefined) {
    window.DEBUG = true;
}
(function ($) {
    var methods = {"assert": {},
                "log": {}, "debug": {}, "info": {}, "warn": {}, "error": {}, "dir": {}, "dirxml": {},
                "count": {}, "trace": {}, "group": {}, "groupEnd": {}, "time": {}, "timeEnd": {}, "profile": {}, "profileEnd": {}};

    // if there's no window console, create a dummy to trap errors
    if (!window.console) {
        window.console = methods;
    }
    
    // if there's no Firebug, dynamically include Firebug Lite if possible
    if (!console.firebug && window.DEBUG) {
        // used DOM methods not jQuery because jQuery's append() method didn't make the script element available to FirebugLite via scripts[] array
        var s = document.createElement("script");
        s.setAttribute("type", "text/javascript");
        s.setAttribute("src", "firebuglite/firebug.js");
        document.getElementsByTagName("head")[0].appendChild(s);
    }

    // foreach Firebug method, create an associated jQuery function
    for (var method in methods) {
        if (methods.hasOwnProperty(method)) {
            switch (method) {
            case "log":
            case "debug":
            case "info":
            case "warn":
            case "error":
            case "dir":
            case "dirxml":
                $.fn[method] = function (method) {
                    return function () {
                        if (console.group && console.groupEnd) {
                            console.group.apply(console, arguments);
                            this.each(function (i) {
                                if (console[method]) {
                                    console[method](this);
                                }
                            });
                            console.groupEnd();
                        }
                        else {
                            this.each(function (i) {
                                if (console[method]) {
                                    console[method](this);
                                }
                            });
                            
                        }
                        return this;
                    };
                }(method);
                break;
            case "count":
            case "trace":
            case "group":
            case "groupEnd":
            case "time":
            case "timeEnd":
            case "profile":
            case "profileEnd":
                $.fn[method] = function (method) {
                    return function () {
                        if (console[method]) {
                            console[method].apply(console, arguments);
                        }
                        return this;
                    };
                }(method);
                break;
            case "assert":
                $.fn[method] = function (method) {
                    return function () {
                        var expr = arguments[0];
                        if (!expr) {
                            var args = $.makeArray(arguments);
                            args.shift();
                            args.unshift("Assertion Failed: ");
                            if (console.group && console.groupEnd) {
                                console.group.apply(console, args);
                                this.each(function (i) {
                                    try {
                                        console.assert(expr, this);
                                    } 
                                    catch (error) {
                                    // not sure if I should be catching exceptions here
                                    // but not catching them kills the rest of the program
                                    }
                                });
                                console.groupEnd();
                            }
                            else {
                                this.each(function (i) {
                                    try {
                                        console.assert(expr, this);
                                    } 
                                    catch (error) {
                                    // not sure if I should be catching exceptions here
                                    // but not catching them kills the rest of the program
                                    }
                                });
                                
                            }
                        }
                        return this;
                    };
                }(method);
                break;
            default:
                break;
            }
        }
    }
})(jQuery);
