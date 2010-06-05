(function($) {
  /****************************************************************************/
  /***  Degrading Script Tags : http://ejohn.org/blog/degrading-script-tags ***/
  /***  This block must never be used in an embedded script                 ***/
  /***  Determine Firebug options from this script tag                      ***/
  // var bootstrap = eval("(" + document.getElementsByTagName("script")[document.getElementsByTagName("script").length - 1].innerHTML + ")");
  /****************************************************************************/
  $.lumberjaq = {
    defaults: {
      debug: false,
      methods: ["log"]
    },
    getConsole: function() {
      return window.console;
    },
    init: function(settings) {
      $.each(settings.methods, function(index, method){
        $.fn[method] = function(){
          var context = this;
          var console = $.lumberjaq.getConsole();
          var args = $.makeArray(arguments);
          $.each(args, function(i, arg){
            if ($.isFunction(arg)){
              args[i] = arg.apply(context);
            }
          });

          if(args.length == 0) {
            console[method](context);
          } else {
            console[method].apply(window, args);
          }

          return this;
        };
      });
    }
  };

  var settings = $.extend({}, $.lumberjaq.defaults);
  $.lumberjaq.init(settings);
})(jQuery);
