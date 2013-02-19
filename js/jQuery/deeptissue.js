var log = log || $.noop;

$.fn.deeptissue = {};

$.fn.deeptissue["touchType"] = window.navigator.msPointerEnabled ? "pointer" : "ontouchstart" in window ? "touch" : "mouse";
$.fn.deeptissue["touchStart"] = $.fn.deeptissue.touchType === "pointer" ? "MSPointerDown" : $.fn.deeptissue.touchType === "touch" ? "touchstart" : "mousedown";
$.fn.deeptissue["touchEnd"] = $.fn.deeptissue.touchType === "pointer" ? "MSPointerUp" : $.fn.deeptissue.touchType === "touch" ? "touchend" : "mouseup";
$.fn.deeptissue["touchOut"] = $.fn.deeptissue.touchType === "pointer" ? "MSPointerOut" : $.fn.deeptissue.touchType === "touch" ? "touchcancel" : "mouseout";
$.fn.deeptissue["touchMove"] = $.fn.deeptissue.touchType === "pointer" ? "MSPointerMove" : $.fn.deeptissue.touchType === "touch" ? "touchmove" : "mousemove";
$.fn.deeptissue["touchCancel"] = $.fn.deeptissue.touchType === "pointer" ? "MSPointerCancel" : $.fn.deeptissue.touchType === "touch" ? "touchcancel" : "mouseout";

$.fn.deeptissue.hasmsGesture = false;

$.fn.deeptissue.msGesture = function () {

    try {
        var t = new MSGesture();
        this.hasmsGesture = (t !== undefined);
        return this.hasmsGesture;
    } catch (ex) {
        this.hasmsGesture = false;
        return this.hasmsGesture;
    }
};

$.fn.deeptissue.log = function (value) {

    if ($.fn.deeptissue.options.logging) {
        console.log(value);
    }

};

$.fn.deeptissue.options = {
    allowPageScroll: true,
    logging: false
};

/**
* Calcualte the angle of the swipe
*/
$.fn.caluculateAngle = function () {
    var X = start.x - end.x;
    var Y = end.y - start.y;
    var r = Math.atan2(Y, X); //radians
    var angle = Math.round(r * 180 / Math.PI); //degrees

    //ensure value is positive
    if (angle < 0)
        angle = 360 - Math.abs(angle);

    return angle;
}

/**
* Calcualte the direction of the swipe
* This will also call caluculateAngle to get the latest angle of swipe
*/

$.fn.calculateDirection = function () {
    var angle = caluculateAngle();

    if ((angle <= 45) && (angle >= 0))
        return LEFT;

    else if ((angle <= 360) && (angle >= 315))
        return LEFT;

    else if ((angle >= 135) && (angle <= 225))
        return RIGHT;

    else if ((angle > 45) && (angle < 135))
        return DOWN;

    else
        return UP;
}

$.fn.PreventDefaultManipulationAndMouseEvent = function (evtObj) {

    if (evtObj.preventDefault) {
        evtObj.preventDefault();
        return;
    }

    if (evtObj.preventManipulation) {
        evtObj.preventManipulation();
        return;
    }

    if (evtObj.preventMouseEvent) {
        evtObj.preventMouseEvent();
        return;
    }

};


/*
This is something I (Chris) have been testing on the side to handle a single tap or click. 
This should perform better than the native click event handler on the touch devices because
the click event is a delayed fire where touchstart/end is instant.
*/

$.fn.caluculateDistance = function (start, end) {
    return Math.round(Math.sqrt(Math.pow(end.pageX - start.pageX, 2) + Math.pow(end.pageY - start.pageY, 2)));
}

var touchType = window.navigator.msPointerEnabled ? "pointer" : "ontouchstart" in window ? "touch" : "mouse",
        ts = touchType === "pointer" ? "MSPointerDown" : touchType === "touch" ? "touchstart" : "mousedown",
        te = touchType === "pointer" ? "MSPointerUp" : touchType === "touch" ? "touchend" : "mouseup",
        tm = touchType === "pointer" ? "MSPointerMove" : touchType === "touch" ? "touchmove" : "mousemove",
        tc = touchType === "pointer" ? "MSPointerCancel" : touchType === "touch" ? "touchcancel" : "mouseout";


// Handle event binding
$.fn["tap"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    if (fn == null) {
        fn = data;
        data = null;
    }

        var end = { pageX: 0, pageY: 0 };

    return $(this).each(function () {

        var target = $(this);

        if (arguments.length === 0) {
            target.trigger("tap");
        } else {

            target.bind("tap", data, fn);
            target.data("tt", undefined);
            target.data("t", false);

            target.bind(ts, function (e) {

                if (!$.fn.tap.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? 
                                    e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                log("touchpoint - " + touchPoint.pageX + ": " + touchPoint.pageY);

                if (touchType === "pointer") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else if (touchType === "touch") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else {//moouse
                    u.data("txy", { pageX: e.pageX, pageY: e.pageY });
                }

                u.data("tt", setTimeout(function () {
                    clearTimeout(u.data("tt"));
                    u.data("tt", undefined);
                    u.data("t", false);
                }, 700));

                u.data("t", true);

                end.pageX = touchPoint.pageX;
                end.pageY = touchPoint.pageY;

                target.bind(tc, function (e) {

                    if (!$.fn.tap.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var u = $(this),
                    touchPoints = (typeof e.changedTouches != 'undefined') ? e.changedTouches : [e],
                    touchPoint = touchPoints[touchPoints.length - 1];

                    end.pageX = touchPoint.pageX;
                    end.pageY = touchPoint.pageY;

                    log("canceled");

                    if (u.data("t")) {

                        clearTimeout(u.data("tt"));
                        u.data("tt", undefined);
                        u.data("t", false);

                    }

                    u.unbind(tc);

                });

            });

            target.bind(tm, function (e) {

                if (!$.fn.tap.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                var touchPoints = (typeof e.changedTouches != 'undefined') ? e.changedTouches : [e],
                    touchPoint = touchPoints[touchPoints.length - 1];

                end.pageX = touchPoint.pageX;
                end.pageY = touchPoint.pageY;

            });

            target.bind(te, function (e) {

                if (!$.fn.tap.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                if (!touchPoint.pageX) {
                    touchPoint.pageX = e.pageX;
                    touchPoint.pageY = e.pageY;
                }

                if (u.data("t")) {

                    clearTimeout(u.data("tt"));
                    u.data("tt", undefined);
                    u.data("t", false);
                    var txy = u.data("txy");

                    log("txy - " + txy.pageX + ": " + txy.pageY);
                    log("end - " + end.pageX + ": " + end.pageY);
                    log("touchPoint - " + touchPoint.pageX + ": " + touchPoint.pageY);
                    log("distance- " + $.fn.caluculateDistance(txy, touchPoint));

                    if ($.fn.caluculateDistance(txy, touchPoint) < 15) {
                        fn.call(this, e);
                    }

                }

                u.unbind(tc);

            });

        }

    });

};

$.fn.tap.options = {
    allowPageScroll: true
};


$.fn["untap"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    return $(this).each(function () {

        $(this).unbind(ts).unbind(te).unbind(tc);

    });

    return this;

};


// Handle event binding
$.fn["tapHold"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    if (fn == null) {
        fn = data;
        data = null;
    }

    return $(this).each(function () {

        log("doing tap Hold");

        var target = $(this);

        if (arguments.length === 0) {

            log("triggering tapHold");

            target.trigger("tapHold");
        } else {

            target.bind("tapHold", data, fn);
            target.data("tht", undefined);
            target.data("th", false);

            target.bind(Modernizr.touch ? "touchstart" : "mousedown", function (e) {

                $.fn.PreventDefaultManipulationAndMouseEvent(e);

                log("touchstart taphold");

                var u = $(this);

                u.data("tht", setTimeout(function () {

                    fn(e);

                    clearTimeout(u.data("tht"));
                    u.data("tht", undefined);
                    u.data("th", false);
                }, 750));
                u.data("th", true);

            });

            target.bind(Modernizr.touch ? "touchend" : "mouseup", function (e) {

                $.fn.PreventDefaultManipulationAndMouseEvent(e);

                log("touchend taphold");

                var u = $(this);

                if (u.data("th")) {

                    clearTimeout(u.data("tht"));
                    u.data("tht", undefined);
                    u.data("th", false);

                }

            });

        }

    });

    return this;

};

$.fn["untapHold"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    return $(this).each(function () {

        $(this).unbind(ts).unbind(te);

    });

    return this;

};


// Handle event binding
$.fn["swipeToSelect"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    if (fn == null) {
        fn = data;
        data = null;
    }

    return $(this).each(function () {

        log("doing swipe To Select");

        var target = $(this);

        if (arguments.length === 0) {

            log("triggering swipeToSelect");

            target.trigger("swipeToSelect");
        } else {

            target.bind("swipeToSelect", data, fn);
            target.data("tht", undefined);
            target.data("th", false);

            target.bind(Modernizr.touch ? "touchstart" : "mousedown", function (e) {

                $.fn.PreventDefaultManipulationAndMouseEvent(e);

                log("touchstart swipeToSelect");

                var u = $(this);

                u.bind(Modernizr.touch ? "touchmove" : "mousemove", function (e) {

                    $.fn.PreventDefaultManipulationAndMouseEvent(e);



                });

            });

            target.bind(Modernizr.touch ? "touchend" : "mouseup", function (e) {

                $.fn.PreventDefaultManipulationAndMouseEvent(e);

                log("touchend swipeToSelect");

                var u = $(this);

                u.unbind(Modernizr.touch ? "touchmove" : "mousemove");

            });


        }

    });

    return this;
     
};

if ($.attrFn) {

    $.attrFn["swipeToSelect"] = true;
    $.attrFn["unswipeToSelect"] = true;

}


// Handle event binding
$.fn["tapHold"] = function(data, fn) {

    if(this.length === 0) {
        return;
    }

    if(fn == null) {
        fn = data;
        data = null;
    }

    var that = $.fn.deeptissue,
        end = { pageX: 0, pageY: 0 };

    return $(this).each(function() {

        var target = $(this);

        if(arguments.length === 0) {
            target.trigger("tapHold");
        } else {

            target.bind("tapHold", data, fn);
            target.data("tt", undefined);
            target.data("t", false);

            target.bind(that.touchStart, function(e) {

                if(!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                that.log("touchpoint - " + touchPoint.pageX + ": " + touchPoint.pageY);

                if(that.touchType === "pointer") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else if(that.touchType === "touch") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else {//mouse
                    u.data("txy", { pageX: e.pageX, pageY: e.pageY });
                }

                u.data("tt", setTimeout(function() {

                    fn.call(this, e);

                    clearTimeout(u.data("tt"));
                    u.data("tt", undefined);
                    u.data("t", false);

                    target.untapHold();
                }, 1400));

                u.data("t", false);

                end.pageX = touchPoint.pageX;
                end.pageY = touchPoint.pageY;

                target.bind(that.touchMove, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var u = $(this),
                    touchPoints = (typeof e.changedTouches != 'undefined') ? e.changedTouches : [e],
                    touchPoint = touchPoints[touchPoints.length - 1],
                    txy = u.data("txy"); ;

                    if($.fn.caluculateDistance(txy, touchPoint) < 15) {

                        clearTimeout(u.data("tt"));
                        u.data("tt", undefined);
                        u.data("t", false);
                        target.untapHold();

                    }

                });

                target.bind(that.touchEnd, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                    if(!touchPoint.pageX) {
                        touchPoint.pageX = e.pageX;
                        touchPoint.pageY = e.pageY;
                    }

                    if(u.data("t")) {

                        that.log("txy - " + txy.pageX + ": " + txy.pageY);
                        that.log("end - " + end.pageX + ": " + end.pageY);
                        that.log("touchPoint - " + touchPoint.pageX + ": " + touchPoint.pageY);
                        that.log("distance- " + $.fn.caluculateDistance(txy, touchPoint));

                        if($.fn.caluculateDistance(txy, touchPoint) < 15) {
                            clearTimeout(u.data("tt"));
                            u.data("tt", undefined);
                            u.data("t", false);
                            var txy = u.data("txy");
                        }

                    }

                    u.unbind(that.touchCancel);

                });


                target.bind(that.touchCancel, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var u = $(this),
                    touchPoints = (typeof e.changedTouches != 'undefined') ? e.changedTouches : [e],
                    touchPoint = touchPoints[touchPoints.length - 1];

                    end.pageX = touchPoint.pageX;
                    end.pageY = touchPoint.pageY;

                    that.log("canceled");

                    clearTimeout(u.data("tt"));

                    if(u.data("t")) {

                        u.data("tt", undefined);
                        u.data("t", false);

                    }

                    target.untapHold();

                });

            });

        }

    });

};



$.fn["untapHold"] = function(data, fn) {

    if(this.length === 0) {
        return;
    }

    return $(this).each(function() {

        $(this).unbind($.fn.deeptissue.touchStart)
                .unbind($.fn.deeptissue.touchEnd)
                .unbind($.fn.deeptissue.touchCancel);

    });

    return this;

};




// Handle event binding
$.fn["tap"] = function(data, fn) {

    if(this.length === 0) {
        return;
    }

    if(fn == null) {
        fn = data;
        data = null;
    }

    var that = $.fn.deeptissue,
        end = { pageX: 0, pageY: 0 };

    return $(this).each(function() {

        var target = $(this);

        if(arguments.length === 0) {
            target.trigger("tap");
        } else {

            target.on("tap", data, fn);
            target.data("tt", undefined);
            target.data("t", false);

            target.on(that.touchStart, function(e) {

                if(!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                that.log("touchpoint - " + touchPoint.pageX + ": " + touchPoint.pageY);

                if(that.touchType === "pointer") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else if(that.touchType === "touch") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else {//moouse
                    u.data("txy", { pageX: e.pageX, pageY: e.pageY });
                }

                u.data("tt", setTimeout(function() {
                    clearTimeout(u.data("tt"));
                    u.data("tt", undefined);
                    u.data("t", false);
                }, 700));

                u.data("t", true);

                end.pageX = touchPoint.pageX;
                end.pageY = touchPoint.pageY;

                target.on(that.touchMove, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var touchPoints = (typeof e.changedTouches != 'undefined') ? e.changedTouches : [e],
                    touchPoint = touchPoints[touchPoints.length - 1];

                    end.pageX = touchPoint.pageX;
                    end.pageY = touchPoint.pageY;

                });

                target.on(that.touchEnd, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                    if(!touchPoint.pageX) {
                        touchPoint.pageX = e.pageX;
                        touchPoint.pageY = e.pageY;
                    }

                    if(u.data("t")) {

                        clearTimeout(u.data("tt"));
                        u.data("tt", undefined);
                        u.data("t", false);
                        var txy = u.data("txy");

                        that.log("txy - " + txy.pageX + ": " + txy.pageY);
                        that.log("end - " + end.pageX + ": " + end.pageY);
                        that.log("touchPoint - " + touchPoint.pageX + ": " + touchPoint.pageY);
                        that.log("distance- " + $.fn.caluculateDistance(txy, touchPoint));

                        if($.fn.caluculateDistance(txy, touchPoint) < 15) {
                            fn.call(this, e);
                        }

                    }

                    u.unbind(that.touchCancel);

                });

                target.on(that.touchCancel, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var u = $(this),
                    touchPoints = (typeof e.changedTouches != 'undefined') ? e.changedTouches : [e],
                    touchPoint = touchPoints[touchPoints.length - 1];

                    end.pageX = touchPoint.pageX;
                    end.pageY = touchPoint.pageY;

                    that.log("canceled");

                    if(u.data("t")) {

                        clearTimeout(u.data("tt"));
                        u.data("tt", undefined);
                        u.data("t", false);

                    }

                    u.unbind(that.touchCancel);

                });

            });

        }

    });

};


$.fn["untap"] = function(data, fn) {

    if(this.length === 0) {
        return;
    }

    return $(this).each(function() {

        $(this).unbind($.fn.deeptissue.touchStart)
                .unbind($.fn.deeptissue.touchEnd)
                .unbind($.fn.deeptissue.touchCancel);

    });

    return this;

};


if($.attrFn) {
    $.attrFn["tap"] = true;
    $.attrFn["untap"] = true;
}


if ($.attrFn) {

    $.attrFn["doubleTap"] = true;
    $.attrFn["undoubleTap"] = true;

}



if ($.attrFn) {
    $.attrFn["twoswipe"] = true;
    $.attrFn["untwoswipe"] = true;

}


if ($.attrFn) {

    $.attrFn["pinch"] = true;
    $.attrFn["unpinch"] = true;

}

if ($.attrFn) {
    $.attrFn["tap"] = true;
    $.attrFn["untap"] = true;
    $.attrFn["doubleTap"] = true;
    $.attrFn["undoubleTap"] = true;
    $.attrFn["tapHold"] = true;
    $.attrFn["untapHold"] = true;
    $.attrFn["swipeToSelect"] = true;
    $.attrFn["unswipeToSelect"] = true;
    $.attrFn["swipe"] = true;
    $.attrFn["unswipe"] = true;
    $.attrFn["twoswipe"] = true;
    $.attrFn["untwoswipe"] = true;
    $.attrFn["pinch"] = true;
    $.attrFn["unpinch"] = true;
    $.attrFn["rotate"] = true;
    $.attrFn["unrotate"] = true;

}




$.fn["swipe"] = function(data, fn, mindistance) {

    if(this.length === 0) {
        return;
    }

    if(fn == null || mindistance == null) {
        mindistance = fn;
        fn = data;
        data = null;
    }

    var that = $.fn.deeptissue,
        end = { pageX: 0, pageY: 0 };

    return $(this).each(function() {

        var target = $(this);

        if(arguments.length === 0) {
            target.trigger("swipe");
        } else {

            target.bind("swipe", data, fn);
            target.data("tt", undefined);
            target.data("t", false);

            target.bind(that.touchStart, function(e) {

                if(!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                that.log("touchpoint - " + touchPoint.pageX + ": " + touchPoint.pageY);

                if(that.touchType === "pointer") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else if(that.touchType === "touch") {
                    u.data("txy", { pageX: touchPoint.pageX, pageY: touchPoint.pageY });
                } else {//moouse
                    u.data("txy", { pageX: e.pageX, pageY: e.pageY });
                }

                end.pageX = touchPoint.pageX;
                end.pageY = touchPoint.pageY;

                target.bind(that.touchMove, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var touchPoints = (typeof e.changedTouches != 'undefined') ? e.changedTouches : [e.originalEvent],
                        touchPoint = touchPoints[touchPoints.length - 1];

                    if(!touchPoint.pageX) {
                        touchPoint.pageX = e.pageX;
                        touchPoint.pageY = e.pageY;
                    }

                    var txy = u.data("txy");

                    that.log("txy - " + txy.pageX + ": " + txy.pageY);
                    that.log("touchPoint - " + touchPoint.pageX + ": " + touchPoint.pageY);
                    that.log("distance- " + $.fn.caluculateDistance(txy, touchPoint));

                    if($.fn.caluculateDistance(txy, touchPoint) < mindistance) {
                        fn.call(this, e);
                    }

                });

                target.bind(that.touchEnd + " " + that.touchCancel, function(e) {

                    if(!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ? e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                    if(!touchPoint.pageX) {
                        touchPoint.pageX = e.pageX;
                        touchPoint.pageY = e.pageY;
                    }

                    var txy = u.data("txy");

                    that.log("txy - " + txy.pageX + ": " + txy.pageY);
                    that.log("touchPoint - " + touchPoint.pageX + ": " + touchPoint.pageY);
                    that.log("distance- " + $.fn.caluculateDistance(txy, touchPoint));

                    if($.fn.caluculateDistance(txy, touchPoint) < mindistance) {
                        fn.call(this, e);
                    }

                    target.unswipe();

                });

            });

        }

    });

};

$.fn["unswipe"] = function(data, fn) {

    if(this.length === 0) {
        return;
    }

    return $(this).each(function() {

        $(this).unbind($.fn.deeptissue.touchEnd)
                .unbind($.fn.deeptissue.touchCancel);

    });

    return this;

};

if ( $.attrFn ) {

    $.attrFn["swipe"] = true;
    $.attrFn["unswipe"] = true;
}


$.fn["move"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    if (data !== null && fn === undefined) {
        fn = data;
        data = undefined;
    }

    var that = $.fn.deeptissue;

    return $(this).each(function () {

        var target = $(this);

        if (arguments.length === 0) {
            target.trigger("move");
        } else {

            target.bind("move", data, fn);
            target.data("tt", undefined);
            target.data("t", false);

            target.on(that.touchStart, function (e) {

                if (!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                var u = $(this),
                    touchPoints = (typeof e.originalEvent.changedTouches != 'undefined') ?
                        e.originalEvent.changedTouches : [e.originalEvent],
                    touchPoint = touchPoints[touchPoints.length - 1];

                if (that.touchType === "pointer" || that.touchType === "touch") {
                    u.data("txy", { x: touchPoint.pageX, y: touchPoint.pageY });
                } else {//mouse
                    u.data("txy", { x: e.pageX, y: e.pageY });
                }

                target.on(that.touchMove, function (e) {

                    that.log("move - " + e.type);

                    if (!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    var touchPoints = (typeof e.changedTouches != 'undefined') ?
                                                    e.changedTouches : [e.originalEvent],
                        otp = touchPoints[touchPoints.length - 1],
                        touchPoint = touchPoints[touchPoints.length - 1],
                        ms = new Date().getTime();

                    that.log("ticks " + target.data("ms") + " - " + (ms - parseInt(target.data("ms"), 10)));

                    if (ms - parseInt(target.data("ms"), 10) > 500) {
                        target.off(that.touchMove + " " + that.touchEnd + " " + that.touchCancel + " " + that.touchOut);
                        target.removeData("ms");
                        return;
                    }

                    if (!touchPoint.pageX) {
                        touchPoint.pageX = e.pageX;
                        touchPoint.pageY = e.pageY;
                    }

                    var txy = u.data("txy"),
                        td = {
                            original: txy,
                            current: {
                                x: touchPoint.pageX,
                                y: touchPoint.pageY
                            },
                            delta: {
                                x: -(txy.x - touchPoint.pageX),
                                y: -(txy.y - touchPoint.pageY)
                            }
                        };

                    that.log("td - " + JSON.stringify(td));

                    target.data("ms", ms);

                    fn.call(this, td);

                });

                target.on(that.touchEnd + " " + that.touchCancel /*+ " " + that.touchOut*/, function (e) {

                    that.log("cancel - " + e.type);

                    if (!that.options.allowPageScroll) {
                        $.fn.PreventDefaultManipulationAndMouseEvent(e);
                    }

                    target.off(that.touchMove + " " + that.touchEnd + " " + that.touchCancel + " " + that.touchOut);

                });

            });

        }

    });


};


$.fn["unmove"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    return $(this).each(function () {

        $(this).unbind($.fn.deeptissue.touchMove)
                .unbind($.fn.deeptissue.touchMove);

    });

    return this;

};



if ($.attrFn) {

    $.attrFn["move"] = true;
    $.attrFn["unmove"] = true;
}

// Handle event binding
$.fn["gtap"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    if (fn == null) {
        fn = data;
        data = null;
    }

    var that = $.fn.deeptissue;

    return $(this).each(function () {

        var target = $(this),
            myGesture = new MSGesture();

        myGesture.target = this;

        if (arguments.length === 0) {
            target.trigger("gtap");
        } else {

            target[0].addEventListener("MSGestureTap", function (e) {

                fn.call(this, e);

            });


            target.on(that.touchStart, function (e) {

                if (!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                myGesture.addPointer(e.originalEvent.pointerId);

                target.off(that.touchStart);
            });

        }

    });

};


$.fn["guntap"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    return $(this).each(function () {

        $(this).unbind($.fn.deeptissue.touchStart)
                .unbind($.fn.deeptissue.touchEnd)
                .unbind($.fn.deeptissue.touchCancel);

    });

    return this;

};


if ($.attrFn) {
    $.attrFn["gtap"] = true;
    $.attrFn["guntap"] = true;
}

// Handle event binding
$.fn["gHold"] = function (data, initFn, endFn) {

    if (this.length === 0) {
        return;
    }

    if (endFn === undefined && initFn !== undefined) {
        endFn = initFn;
        initFn = data;
        data = null;
    }

    var that = $.fn.deeptissue;

    return $(this).each(function () {

        var target = $(this),
            myGesture = new MSGesture();

        myGesture.target = this;

        if (arguments.length === 0) {
            target.trigger("tapHold");
        } else {

            target[0].addEventListener("MSGestureHold", function (e) {

                that.log(e.detail);

                if (e.detail & e.MSGESTURE_FLAG_BEGIN) {
                    if (initFn) {
                        initFn.call(this, e);
                    }
                } else {

                    if (endFn) {
                        endFn.call(this, e);
                    }

                }

            });

            target.bind(that.touchStart, function (e) {

                if (!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                myGesture.addPointer(e.originalEvent.pointerId);

            });
        }

    });

};

$.fn["ungHold"] = function(data, fn) {

    if(this.length === 0) {
        return;
    }

    return $(this).each(function() {

        $(this).unbind($.fn.deeptissue.touchStart)
                .unbind($.fn.deeptissue.touchEnd)
                .unbind($.fn.deeptissue.touchCancel);

    });

    return this;

};

if($.attrFn) {

    $.attrFn["gHold"] = true;
    $.attrFn["ungHold"] = true;

}

// Handle event binding
$.fn["gDoubleTap"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    if (fn == null) {
        fn = data;
        data = null;
    }

    var that = $.fn.deeptissue;

    return $(this).each(function () {

        var target = $(this),
            myGesture = new MSGesture();

        myGesture.target = this;

        if (arguments.length === 0) {
            target.trigger("gDoubleTap");
        } else {

            target[0].addEventListener("MSGestureDoubleTap", function (e) {

                if (fn) {
                    fn.call(this, e);
                }

            });


            target.on(that.touchStart, function (e) {

                if (!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                myGesture.addPointer(e.originalEvent.pointerId);

            });

        }

    });

};


$.fn["gunDoubleTap"] = function (data, fn) {

    if (this.length === 0) {
        return;
    }

    return $(this).each(function () {

        $(this).unbind($.fn.deeptissue.touchStart)
                .unbind($.fn.deeptissue.touchEnd)
                .unbind($.fn.deeptissue.touchCancel);

    });

    return this;

};


if ($.attrFn) {
    $.attrFn["gDoubleTap"] = true;
    $.attrFn["gunDoubleTap"] = true;
}




// Handle event binding
$.fn["gChange"] = function (data, initFn, endFn) {

    if (this.length === 0) {
        return;
    }

    if (endFn === undefined && initFn !== undefined) {
        endFn = initFn;
        initFn = data;
        data = null;
    }

    var that = $.fn.deeptissue;

    return $(this).each(function () {

        var target = $(this),
            myGesture = new MSGesture();

        myGesture.target = this;

        if (arguments.length === 0) {
            target.trigger("gChange");
        } else {

            target[0].addEventListener("MSGestureChange", function (e) {

                var m = new MSCSSMatrix(e.target.style.transform); // Get the latest CSS transform on the element
                    e.target.style.transform = m
                    //.translate(e.offsetX, e.offsetY) // Move the transform origin under the center of the gesture
                    //.rotate(e.rotation * 180 / Math.PI) // Apply Rotation
                    //.scale(e.scale) // Apply Scale
                    .translate(0, e.translationY) // Apply Translation
                    //.translate(-e.offsetX, -e.offsetY)
                    ; // Move the transform origin back


            });

            target.bind(that.touchStart, function (e) {

                if (!that.options.allowPageScroll) {
                    $.fn.PreventDefaultManipulationAndMouseEvent(e);
                }

                myGesture.addPointer(e.originalEvent.pointerId);

            });
        }

    });

};

$.fn["ungChange"] = function(data, fn) {

    if(this.length === 0) {
        return;
    }

    return $(this).each(function() {

        $(this).unbind($.fn.deeptissue.touchStart)
                .unbind($.fn.deeptissue.touchEnd)
                .unbind($.fn.deeptissue.touchCancel);

    });

    return this;

};

if($.attrFn) {

    $.attrFn["gChange"] = true;
    $.attrFn["ungChange"] = true;

}



if($.attrFn) {

    $.attrFn["tapHold"] = true;
    $.attrFn["untapHold"] = true;

}




if ($.attrFn) {

    $.attrFn["rotate"] = true;
    $.attrFn["unrotate"] = true;

}