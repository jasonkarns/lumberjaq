(function($) {
  $.lumberjaq = {
    defaults: {
      debug: false,
      methods: ["log"]
    },
    getConsole: function() {
      return window.console;
    },
    isDebugMode: function() {
      return (window.location.hash == "#debug")? true : $.lumberjaq.settings.debug;
    },
    init: function() {
      $.each($.lumberjaq.settings.methods, function(index, method){
        $.fn[method] = function(){
          if(!$.lumberjaq.isDebugMode()) {
            return this;
          }

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

  $.lumberjaq.settings = $.extend({}, $.lumberjaq.defaults);
  $.lumberjaq.init();
})(jQuery);
