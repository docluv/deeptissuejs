/// <reference path="jquery-1.6.2.js" />
/// <reference path="qunit.js" />

assertContains = function (array, fun, message) {
  var arrayToTest = array.subscribe === undefined ? array : array();
  var hasAny = $.grep(arrayToTest, fun).length > 0;
  ok(hasAny, message + "\n fun: " + fun);
};

assertNotContains = function (array, fun, message) {
  var arrayToTest = array.subscribe === undefined ? array : array();
  var hasAny = $.grep(arrayToTest, fun).length > 0;
  ok(!hasAny, message + "\n fun: " + fun);
};

atLeast = function(actual, value, message) {

    if(!actual){
        QUnit.push(false, actual, message);
        return;
    }

    QUnit.push(actual >= value, actual, message);
};

noMoreThan = function(actual, value, message) {
    QUnit.push(actual <= value, actual, message);
};

greaterThan = function(actual, value, message) {
    QUnit.push(actual > value, actual, message);
};

lessThan = function(actual, value, message) {
    QUnit.push(actual < value, actual, message);
};

eitherOr = function(actual, value1, value2, message) {
    QUnit.push((actual === value1 || actual === value2), actual, message);
};

anyOf = function(actual, values, message) {

    var hasValue = false,
        i = 0;

    for(i = values.length - 1; i >= 0; i--){
        if(actual === values[i]){
            hasValue = true;
            i = -1;
        }
    }

    QUnit.push(hasValue, actual, message);
};


arrayContains = function(actual, value, message) {

    if(!actual){
        QUnit.push(false, actual, message);
        return;
    }

    var hasValue = false,
        i = 0;

    for(i = actual.length - 1; i >= 0; i--){

          if(value === actual[i]){
              hasValue = true;
          }

      };

    QUnit.push(hasValue, actual, message);
};

arrayDoesContain = function(actual, value, message) {

    var hasValue = true,
        i = 0;

    for(i = actual.length - 1; i >= 0; i--){

          if(value === actual[i]){
              hasValue = false;
          }

      };

    QUnit.push(hasValue, actual, message);
};


(function( $ ){

  function escapeHtml(s) {
      if (!s) {
          return "";
      }
      s = s + "";
      return s.replace(/[\&"<>\\]/g, function(s) {
          switch(s) {
              case "&": return "&amp;";
              case "\\": return "\\\\";
              case '"': return '\"';
              case "<": return "&lt;";
              case ">": return "&gt;";
              default: return s;
          }
      }).replace(/(\r\n|\n|\r)/gm, "<br />");
  }

  function pushSelectorAssertToQunit(result, message, content, expectedMessage, expectedValue){
      QUnit.log({
            result: result,
            message: message,
            actual: content,
            expected: expectedMessage + " " + expectedValue
        });

      QUnit.config.current.assertions.push({
          result: !!result,
          message: message || ("<code><pre>" + escapeHtml(style_html(content)) + "</pre></code> <br /> <div class=\"test-expected\">" + expectedMessage + " " + expectedValue + "</div>")
      });  
  }

  $.fn.assertContains = function(selector, message) {
    pushSelectorAssertToQunit($(selector, this).length > 0, message, this.html(), "should contains", selector);
    return this;
  };

  $.fn.assertNotContains = function(selector, message) {
    pushSelectorAssertToQunit($(selector, this).length === 0, message, this.html(), "should not contains", selector);
    return this;
  };

  $.fn.assertContainsText = function(text, message) {
    pushSelectorAssertToQunit(this.is(":contains('" + text + "')"), message, this.html(), "should contains text", text);
    return this;
  };

  $.fn.assertNotContainsText = function(text, message) {
    pushSelectorAssertToQunit(!this.is(":contains('" + text + "')"), message, this.html(), "should not contains text", text);
    return this;
  };

  $.fn.assertIsVisible = function (message){
      QUnit.push(this.is(":visible"), this.is(":visible") ? "visible" : "hidden", "visible", message);
      return this;
  };

   $.fn.assertIsHidden = function (message){
      QUnit.push(this.is(":hidden"), this.is(":hidden") ? "hidden" : "visible", "hidden", message);
      return this;
   };

  $.fn.assertEventBound = function(eventName, message) {

    $.each(this, function(i, e){
      //looping through because a selector might have multiple elements
      var hasEvent = false;

      $.each($(e).data('events'), function(j, evt){

          //looping through because an element could contain multiple bindings.
          if(eventName === j.toString()){
              hasEvent = true;
          }

      });

      QUnit.push(hasEvent, "event " + eventName + " bound", message);

    });

    return this;
  };


})( jQuery );

