describe 'Lumberjaq'
  before
    window.el = $("<div id='test_el'>").appendTo("body")
  end
  
  after
    window.el.remove()
  end
  
  describe 'init'
    it 'should attach $.log'
      (typeof window.el.log).should_be typeof Function
    end
    it 'should use the default settings'
      var defaults = {
        debug: false,
        methods: ["log"]
      }
      $.lumberjaq.settings.should_eql defaults
    end
  end
  
  describe '$.log'
    before_each
      window.mockConsole = {
        log: function() {
          return true
        }
      }
      $.lumberjaq.getConsole = function() {
        return window.mockConsole
      }
    end
    describe 'not in debug mode'
      before_each
        $.lumberjaq.settings.debug = false
      end
      it 'should return self'
        var actual = window.el.log()
        actual.should_equal window.el
      end
      it 'should not write to the console'
        window.mockConsole.should_not.receive('log')
        window.el.log()
      end
    end
    describe 'in debug mode'
      before_each
        $.lumberjaq.settings.debug = true
      end
      it 'should return self'
        var actual = window.el.log()
        actual.should_equal window.el
      end
      describe 'with no params'
        it 'should log $(this) to console'
          window.mockConsole.should.receive('log').with_args(window.el)
          window.el.log()
        end
      end
      describe 'with a single param'
        it 'should log a string param to console'
          var param = "hello"
          window.mockConsole.should.receive('log').with_args(param)
          window.el.log(param)
        end
        it 'should log a number param to console'
          var param = 5
          window.mockConsole.should.receive('log').with_args(param)
          window.el.log(param)
        end
        it 'should log a object param to console'
          var param = {key: 'value'}
          window.mockConsole.should.receive('log').with_args(param)
          window.el.log(param)
        end
        it 'should log a array param to console'
          var param = [1,2,3,"hi"]
          window.mockConsole.should.receive('log').with_args(param)
          window.el.log(param)
        end
        describe 'that is a function'
          it 'should log the result of the function to console'
            var param = function() {
              return "hello"
            }
            window.mockConsole.should.receive('log').with_args("hello")
            window.el.log(param)
          end
          it 'should set the context of the function to the current context'
            var param = function() {
              this.should_equal window.el
            }
            window.el.log(param)
          end
        end
      end
    
      describe 'with multiple params'
        it 'should concat them to console'
          window.mockConsole.should.receive('log').with_args("hello", " world #", 1)
          window.el.log(function() {
            return "hello"
          }, " world #", 1)
        end
      end
    end
  end
end