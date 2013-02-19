localStorage.clear();

var target,
    foo = function(){};

module("DeepTissue Unit Tests", {
    setup: function () {

        target = document.querySelectorAll("#testtarget");

    },
    teardown: function () {

    }
});


test("Verify We Have deep tissue with expected members", function () {

    //basic sainty assertions to know members are present
    ok(deeptissue, "movie object should exist");
    ok(deeptissue.fn.move, "move function should exist");
    ok(deeptissue.fn.horizontalMove, "horizontalMove function should exist");
    ok(deeptissue.fn.verticalMove, "verticalMove function should exist");
    ok(deeptissue.fn.rotate, "rotate function should exist");
    ok(deeptissue.fn.scale, "scale function should exist");
    ok(deeptissue.fn.swipeRight, "swipeRight function should exist");
    ok(deeptissue.fn.swipeLeft, "swipeLeft function should exist");
    ok(deeptissue.fn.swipeUp, "swipeUp function should exist");
    ok(deeptissue.fn.swipeDown, "swipeDown function should exist");
    ok(deeptissue.fn.tap, "tap function should exist");
    ok(deeptissue.fn.dblTap, "dblTap function should exist");
    ok(deeptissue.fn.tapHold, "tapHold function should exist");

});

test("Verify can a new deeptissue instance and the node member is the target element", function () {

    var dt = deeptissue(target);

    equal(typeof dt, "object", "deeptissue object should exist");
    equal(dt.node, target, "should be the target node");

});

test("Verify move method applies desired data- attributes and callback setup", function () {

    var dt = deeptissue(target).move(foo);
        
    equal(dt.moveCallback, foo, "moveCallback should be foo");
    ok(target[0].hasAttribute(dt.settings.moveIndicator), "should have moveIndicator");
    //ok(dt.hasAttribute(dt.settings.moveIndicator), "should have moveIndicator");
    //ok(dt.hasAttribute(dt.settings.moveIndicator), "should have moveIndicator");
    //ok(dt.hasAttribute(dt.settings.moveIndicator), "should have moveIndicator");

});

