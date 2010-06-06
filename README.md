
# Lumberjaq

Lumberjaq is an API wrapper for modern browsers that support javascript console output. It's chainable, making it very helpful for debugging without having to break up existing jquery method chains.

## Usage

Logging the current jquery object to console
`$("#my_selector").find(".some_children").log().hide('slow');`

Logging a string to console
`$("#my_selector").log("Hello");`

Logging the result of a function (note: the function parameters are called in the context of the jquery object)
`$("#my_selector").log(function() {
  var els = []
  $(this).each(function() {
    els.push($(this).doSomethingNeat());
  })
  return els.join("\n");
});`

Logging with multiple parameters
`$("#my_selector").log("Hello", function() { return " World!"}, [1,2,3]);`

## License

(The MIT License)

Copyright (c) 2009 Your Name &lt;Your Email&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.