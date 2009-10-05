
function firebug(){
    var debugIdStack = ["DBG_LOG"];
    var timerStack = [];
    var groupStack = [];
    
    $(document).ready(function(){
        $(document.body).append('<div id="DEBUG"><span id="DBG_BAR"><a id="DBG_CLOSE" title="close the debug log">Close</a><a id="DBG_CLEAR" title="clear the debug log">Clear</a></span><ol id="DBG_LOG"></ol></div>');
        $("head").append("        <style type=\"text/css\">" +
        "            body {padding-bottom:225px; position:relative;}" +
        "            #DEBUG { position:absolute; bottom:0; left:0; right:0; padding:0; margin:0; border-top:5px solid gray; background-color:#CCC; }" +
        "            #DBG_BAR { display:block; border-bottom:1px solid #888; }" +
        "            #DBG_LOG { height:200px; overflow:auto; margin:0; }" +
        "            #DEBUG li { border-top:1px solid #888; padding-left:16px; list-style-type:none;}" +
        "            #DEBUG > li:first-child { border-top-width:0; }" +
        "            #DEBUG li.info { background: left 4px no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGeSURBVHjajFJNKERRFP7efc%2BYMTNhpIaFmmRkZeFna0E2pGjULK1GykYUZaukxGIWkgVlg41SFiKllLKwIgthITUbmfE3P557nfNmHm8k%2Beq755zb%2Bc6577yjKaVgo7RpXicTI%2FYRqwvXt8T17OXEDhzQbCGJhihcld5mSHc9lCjLJ5gpiPQFROZ6m8IlKrD%2FJSTRqDIq4mZFD5SrBpV%2BYHksX3l4EXh8BgmvYCT3AJnpJPGhIFEAmh43A%2F2WiNHSAAx25Mk%2BQ7obYJZ3szvCh8HOh68Nyqj6ev%2FBGTC18u3bkJ4wZLo%2BQs36BMUR6Q47vxuTUepEV10teeuE9DSyiXDHkNLL8RP8TEalr%2Fhe6X42dQK%2FYG4Df8CS6HwmNPmK%2F0L7sHITLNwVmZt%2FC0XWyt1l4ZL%2BckKVnoqGYyPW6%2BiWu4N4Oz%2Bi%2F7hmL8CUctXOvgcGqKTbmqRzKPxLNDMJ42GLG0RJuOlcuRklvNPS1wrpCkKVBGmE7xC5BHW6h%2F56xvE4iRaKdrUgDhU2o50XiJgmnhKPC3uasnM%2FBRgAWJKYVu7pMGEAAAAASUVORK5CYII%3D); }" +
        "            #DEBUG li.warn { background: left 4px no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGWSURBVHjaYvz%2F%2Fz8DDKzu5mEGUmlA7AfEolDh%2B0C8OLT0yyYGJMAI0wjUlMDIyDBfSf83g5TKXwZ2Loj41w9MDA%2BvsTA8u8O8HsidDjRgN1gCpHFVF3fOttmc%2F98%2BYwJx%2F585w%2FC%2Fo4Ph%2F927YGkwfnKL%2Bf%2BGSVz%2FgWqdwJYBGUJrern%2Ff3zDBFfk4sIAsg6sGSYGwo9vsIA0rgZxmIAKMtVNfzPwCf9jIARk1P%2BAvBEC9JYfSGMISIBYIKMGVhsC0qjIzf8fRdLYGEIrKWFq5OIDq5VjwmaqoCAqjRINjGCKGaTxxY%2BvjAz4DEAGULUvWIDE1uf3mNV5hRCBk5aG6mRkAFQLoraCbJx%2B7Rgrw7dPCFtXr2Zg2LOHgeHsWVRNrx8zMzy4wnIQmAgWMAGJO79%2FMlae2MzB8OsHRDNIEwzDwJf3TAyntrGDmNPRk1wLB%2Ff%2FajWT3wxMXP8Y7j35x%2BBgx8Dw7gUTw5snzAx3zrMw%2FPnFWAy0qA9FI1SzIihBALEZyItA%2FB2ITwHxEWg6%2FQhTCxBgAB4kvHiHyye8AAAAAElFTkSuQmCC); }" +
        "            #DEBUG li.error { background: left 4px no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFbSURBVHjafJI9SwNBEIZnE8HKRrDQNAr6Cw78AZI6IBzYploQrKz8ATYprCWVhaWgEkWUa1JYieksRCEWKhaBi1%2FBr2J952Yntx6YhSc7OzNvZmZvjXOOdB0YU8ZmQQ1Mefcd2F12rkXBMiqEqG6IdmZhT4NxnzAA9%2BAJKdi28QdJFmDhPtHaGcyUj%2F%2FwCI4BcpeyYjAmD%2BF4HSFSHkS4x8ISiq4u4GeCy1erkmJtPgzb7EOsImPEGKs2BjuuaFK3S9TvEzWbuZBt9nEMa0bmjbnV5%2B%2BwpShyLk3dcLHNPh%2FvSbvtEhVXp0PUaORnttmnn0G2Mle8fgsrWptX0srsK1wQC7duwzbD9sK2fbuXIqyzcP4Ih4EKk%2BTPTKFP53MSyR7ARhvm14hv%2BA5ORbgyFHrx5gmON%2F7mfsAnwNW7K9AS0brmm8Ijn%2BMHARZBBD7ABTj37%2FRFc38FGACwGjGO2PzGygAAAABJRU5ErkJggg%3D%3D); }" +
        "            #DEBUG li.group, #DEBUG li.trace  { background: left 7px no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAJhJREFUGFdj3HP61tnbzxgwgLGqFEPnsgP%2FsQGgOEju798%2FqOj3jx9foXI%2FfnwHo28Q9Pnzu5fPHkDlvn%2F%2FjGbdk4c3oXJfvnz8%2FPn9hw%2Bv37979e7tixdP7z%2B8ewUq9%2BLZ%2FUf3rt%2B7dfHuzQt3b5y%2FeeXU9YtHoXI3r5w8f2LX6cNbTx%2FeAkSnDm0%2Bc2QbSA7oPyCFiYDiAARGquRxdyGpAAAAAElFTkSuQmCC); }" +
        "            #DEBUG li.group.open, #DEBUG li.trace.open  { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAJtJREFUGFdj3HP61tnbzxgwgLGqFEPnsgP%2FsQGgOEju798%2FEATUDGb8%2FvHjK1Tux4%2FvYPQNKAckP39%2B9%2FLZA6jc9%2B%2Bf0ax78vAmVO7Ll4%2BfP7%2F%2F8OE1UMW7ty9ePL3%2F8O4VqNyLZ%2Fcf3bt%2B79ZFoNzdG%2BdvXjl1%2FeJRqNzNKyfPn9h1%2BvDW04e3ANGpQ5vPHNkGkgP6D0hhIqA4AGnFn7ufC8vaAAAAAElFTkSuQmCC); }" +
        "            #DBG_BAR a { margin-left:1em; color:blue; cursor:pointer; cursor:hand; }" +
        "        </style>");
        $("#DEBUG").click(function(e){
            $(e.target).toggleClass("open");
            $("ul, ol, dl", e.target).slideToggle("slow");
        });
        $("#DBG_CLOSE").click(function(e){
            $("#DBG_LOG").slideToggle("slow");
            $(this).text($(this).text() === "Open" ? "Close" : "Open");
            return false;
        });
        $("#DBG_CLEAR").click(function(e){
            $("#DBG_LOG").children().remove();
            return false;
        });
        
    });
    
    function getFunctionName(theFunction){
        // mozilla makes it easy. I love mozilla.
        if (theFunction.name) {
            return theFunction.name;
        }
        // try to parse the function name from the defintion 
        var definition = theFunction.toString();
        var name = definition.substring(definition.indexOf('function') + 9, definition.indexOf('('));
        if (name) {
            return name;
        }
        // dynamic/anonymous functions 
        return "_anonymous";
    }
    
    function printArguments(args){
        var msg = "";
        for (var arg = 0; arg < args.length; arg += 1) {
            // print DOM elements
            if (args[arg].nodeType && args[arg].nodeType === 1) {
                msg += "&lt;" + args[arg].nodeName.toLowerCase();
                if (args[arg].hasAttributes && args[arg].hasAttributes()) {
                    if (args[arg].getAttribute('id')) {
                        msg += ' id="' + args[arg].getAttribute('id') + '"';
                    }
                    if (args[arg].getAttribute('class')) {
                        msg += ' class="' + args[arg].getAttribute('class') + '"';
                    }
                    if (args[arg].getAttribute('title')) {
                        msg += ' title="' + args[arg].getAttribute('title') + '"';
                    }
                }
                msg += "&gt;";
            }
            // print functions
            else 
                if (typeof args[arg] === 'function') {
                    var funcName = getFunctionName(args[arg]) || "function";
                    msg += funcName + "()";
                }
                // print booleans
                else 
                    if (typeof args[arg] === 'boolean') {
                        msg += args[arg] + " ";
                    }
                    // print numbers and strings
                    else 
                        if (typeof args[arg] === 'number' || typeof args[arg] === 'string' || args[arg].constructor.toString().match(/string/i)) {
                            msg += args[arg] + " ";
                        }
                        // print source for arrays/objects
                        else {
                            // use toSource() if available
                            if (args[arg].toSource) {
                                msg += args[arg].toSource();
                            }
                            // arrays
                            else 
                                if (args[arg].constructor.toString().match(/array/i)) {
                                    msg += "[ " + args[arg].join() + " ] ";
                                }
                                else {
                                    var tmp = [];
                                    for (var p in args[arg]) {
                                        tmp.push(" '" + p + "' : '" + args[arg][p] + "'");
                                    }
                                    if (tmp.length) {
                                        msg += "{ " + tmp.join() + " } ";
                                    }
                                    else {
                                        msg += "[ " + typeof args[arg] + " ] ";
                                    }
                                }
                        }
        }
        return "<code>" + msg + "</code> ";
    }
    
    function printDOM(DOM, space){
        var msg = "";
        if (!DOM.nodeType) {
            return;
        }
        switch (DOM.nodeType) {
            case 1:// element
                msg += space + "&lt;" + DOM.nodeName;
                if (DOM.hasAttributes && DOM.hasAttributes()) {
                    if (DOM.getAttribute('id')) {
                        msg += ' id="' + DOM.getAttribute('id') + '"';
                    }
                    if (DOM.getAttribute('class')) {
                        msg += ' class="' + DOM.getAttribute('class') + '"';
                    }
                    if (DOM.getAttribute('title')) {
                        msg += ' title="' + DOM.getAttribute('title') + '"';
                    }
                }
                msg += "&gt;<br/>";
                for (var n = 0; n < DOM.childNodes.length; n += 1) {
                    msg += printDOM(DOM.childNodes[n], space + "&nbsp;&nbsp;&nbsp;&nbsp;");
                }
                msg += space + "&lt;/" + DOM.nodeName + "&gt;<br/>";
                break;
            case 2:// attribute
                // already taken care of (@id and @class only)
                break;
            case 3:// text
                if (/\S/.test(DOM.nodeValue)) {
                    msg += space + DOM.nodeValue + "<br/>";
                }
                break;
            case 4:// cdata section
                msg += space + "&lt;![CDATA[" + DOM.data + "]]&gt;<br/>";
                break;
            case 7:// processing instruction
                msg += space + "&lt;?" + DOM.target + DOM.data + "?&gt;<br/>";
                break;
            case 8:// comment
                msg += space + "&lt;!--" + DOM.data + "--&gt;<br/>";
                break;
        }
        return "<code>" + msg + "</code>";
    }
    
    function printObject(obj){
        var msg = "";
        for (var p in obj) {
            msg += "<dt><code>" + p + "</code></dt><dd><code>" + obj[p] + "</code></dd>";
        }
        return "<dl>" + msg + "</dl>";
    }
    
    function stackTrace(nextCaller){
        var msg = "";
        while (nextCaller) {
            msg += "<li><code>" + getFunctionName(nextCaller) + "(" + nextCaller.arguments.join() + ")" + "</code></li>";
            nextCaller = nextCaller.caller;
        }
        return "Stack Trace:<ol>" + msg + "</ol>";
    }
    
    // foreach Firebug method, create our own function for printing useful data
    for (var method in methods) {
        if (!window.console[methods[method]]) {
            window.console[methods[method]] = function(method){
                return (function(){
                    var msg = "";
                    switch (method) {
                        case "log":
                        case "debug":
                        case "info":
                        case "warn":
                        case "error":
                        case "assert":
                            msg = printArguments(arguments);
                            $('<li class="' + method + '">' + msg + '</li>').appendTo('#' + debugIdStack[debugIdStack.length - 1]);
                            break;
                        case "dir":
                            msg = printObject(arguments[0]);
                            $('<li class="' + method + '">' + msg + '</li>').appendTo('#' + debugIdStack[debugIdStack.length - 1]);
                            break;
                        case "dirxml":
                            msg = printDOM(arguments[0]);
                            $('<li class="' + method + '">' + msg + '</li>').appendTo('#' + debugIdStack[debugIdStack.length - 1]);
                            break;
                        case "trace":
                            msg = stackTrace(arguments.callee);
                            $('<li class="' + method + '">' + msg + '</li>').appendTo('#' + debugIdStack[debugIdStack.length - 1]);
                            break;
                        case "group":
                            msg = printArguments(arguments);
                            var li = $('<li class="' + method + '">' + msg + '</li>').appendTo('#' + debugIdStack[debugIdStack.length - 1]);
                            debugIdStack.push("dbg" + (new Date()).getTime());
                            $(li).append('<ol id="' + debugIdStack[debugIdStack.length - 1] + '"></ol>');
                            break;
                        case "groupEnd":
                            debugIdStack.pop();
                            break;
                        case "time":
                            timerStack[arguments[0]] = [];
                            timerStack[arguments[0]].push((new Date()).getTime());
                            break;
                        case "timeEnd":
                            if (!timerStack[arguments[0]]) {
                                return console.error("Timer '" + arguments[0] + "' has not been started.");
                            }
                            var sec = ((new Date()).getTime() - timerStack[arguments[0]].pop()) / 1000;
                            $('<li class="' + method + '">Timer "' + arguments[0] + '": ' + sec + ' seconds.</li>').appendTo('#' + debugIdStack[debugIdStack.length - 1]);
                            break;
                        case "profile":
                        case "profileEnd":
                        case "count":
                            break;
                        default:
                            break;
                    }
                });
            }(methods[method]);
        }
    }
}

