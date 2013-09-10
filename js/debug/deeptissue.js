;

(function (window, $, undefined) {

    "use strict";

    HTMLElement.prototype.ha = HTMLElement.prototype.hasAttribute;

    var querySelector = document.querySelector,


    deeptissue = function (node, customSettings) {

        return new deeptissue.fn.init(node, customSettings);
    };

    deeptissue.fn = deeptissue.prototype = {

        constructor: deeptissue,

        init: function (node, customSettings) {

            if (!node) {
                return node;
            }

            if ("length" in node) {  //rude detection for nodeList
                this.node = node;
            } else {
                this.node = [node];
            }

            this["settings"] = $.extend({}, this["settings"], customSettings);

            $.buildVendorNames();

            this.touchType = window.navigator.msPointerEnabled ? "pointer" :
                                "ontouchstart" in window ? "touch" : "mouse";

            this.hasMouse = ("ontouchstart" in window && "onmousedown" in window);

            this.touchStart = this.touchType === "pointer" ? "MSPointerDown" :
                            this.touchType === "touch" ? "touchstart" : "mousedown";

            this.touchEnd = this.touchType === "pointer" ? "MSPointerUp" :
                            this.touchType === "touch" ? "touchend" : "mouseup";

            this.touchOut = this.touchType === "pointer" ? "MSPointerOut" :
                            this.touchType === "touch" ? "touchcancel" : "mouseout";

            this.touchMove = this.touchType === "pointer" ? "MSPointerMove" :
                            this.touchType === "touch" ? "touchmove" : "mousemove";

            this.touchCancel = this.touchType === "pointer" ? "MSPointerCancel" :
                            this.touchType === "touch" ? "touchcancel" : "mouseout";

            if (this.hasmsGesture) {
                this.setupMSGesture();
            } else {
                this.setUpTouchGestures();
                this.setupTouch();
            }

            return this;
        },

        version: "0.0.5",

        hasMouse: "",
        touchType: "",
        touchStart: "",
        touchEnd: "",
        touchOut: "",
        touchMove: "",
        touchCancel: "",

        hasmsGesture: (window.MSGesture),

        //right now these would be for iOS, maybe Android will step up someday
        setUpTouchGestures: function () {

            var that = this;

            try {

                [].forEach.call(this.node, function (el) {

                    el.addEventListener("gesturestart", function (evt) {

                        evt.preventDefault();

                    });

                    el.addEventListener("gesturechange", function (evt) {

                        that.gestureChange.call(that, evt);

                    });

                    el.gStartScale = 1.0;
                    el.gStartRotation = 0;

                });

            } catch (ex) {

                console.error("setUpTouchGestures is broken \r\n" + tl.innerText);

                return false;
            }

        },

        setupMSGesture: function () {

            var that = this,
                settings = this.settings;

            try {

                [].forEach.call(this.node, function (el) {

                    var t = new MSGesture();

                    if (t) {

                        t.target = el;

                        el.addEventListener("MSPointerDown", function (evt) {

                            // adds the current mouse, pen, or touch contact for gesture recognition
                            t.addPointer(evt.pointerId);

                            that.setupSwipe(evt, el, settings);

                        });

                        el.addEventListener("MSGestureChange", function (evt) {
                            that.msGestureChange.call(that, evt);
                        });

                        ///Double Tap functionality
                        el.addEventListener("MSPointerDown", function (evt) {
                            that.doDoubleTap(evt, el, settings);
                        });

                        ///Double Tap functionality
                        el.addEventListener("MSGestureEnd", function (evt) {
                            console.info("MSGestureEnd");
                            that.endGesture();
                        });

                    }

                });

            } catch (ex) {
                return false;
            }

        },

        endGesture: function () {

            this.swipping = false;

            this.swipeX = null;
            this.swipeY = null;

        },

        swipeRightCallback: $.noop,
        swipeLeftCallback: $.noop,
        swipeUpCallback: $.noop,
        swipeDownCallback: $.noop,
        moveCallback: $.noop,
        moveHorizontalCallback: $.noop,
        moveVerticalCallback: $.noop,
        rotateCallback: $.noop,
        scaleCallback: $.noop,
        tapCallback: $.noop,
        doubleTapCallback: $.noop,

        processGestureChange: function (e, m) {

            var that = this,
                settings = this.settings,
                el = e.target;

            if (el.ha(settings.rotateIndicator) &&
                Math.abs(e.rotation) > settings.rotateThreshold) {

                if (settings.autoRotate) {
                    el.style.transform = m.rotate(e.rotation * 180 / Math.PI); // Apply Rotation    
                }

                this.rotateCallback(e, m);
            }

            if (el.ha(settings.scaleIndicator) && Math.abs(e.scale) > settings.scaleThreshold) {

                if (settings.autoScale) {
                    el.style.transform = m.scale(e.scale); // Apply Rotation
                }

                this.scaleCallback(e, m);
            }

            if (el.ha(settings.moveIndicator) &&
                    (Math.abs(e.translationX) > settings.moveThreshold ||
                     Math.abs(e.translationY) > settings.moveThreshold)) {

                if (settings.autoMove) {
                    el.style.transform = m.translate(e.translationX, e.translationY, 0); // Apply Translation;
                }

                this.moveCallback(e, m);
            }

            if (el.ha(settings.horizontalIndicator) &&
                    Math.abs(e.translationX) > settings.moveThreshold) {

                if (settings.autoHorizontalMove) {
                    e.target.style.transform = m.translate(e.translationX, 0, 0); // Apply Translation;
                }

                this.moveHorizontalCallback(e, m);
            }

            if (el.ha(settings.verticalIndicator) &&
                    Math.abs(e.translationY) > settings.moveThreshold) {

                if (settings.autoVerticalMove) {
                    e.target.style.transform = m.translate(0, e.translationY, 0); // Apply Translation;
                }

                this.moveVerticalCallback(e, m);
            }

            that.processSwipe(el, e, settings, m);

        },
        
        processSwipe: function (el, e, settings, m) {

            var that = this,
                horizontal = false,
                vertical = false;

            m = m || {};

            //if (that.swipeX !== null || that.swipeY !== null) {
            //    horizontal = Math.abs((e.clientX - that.swipeX)) >
            //                Math.abs((e.clientY - that.swipeY));
            //    vertical = !horizontal;
            //}

            if (el.ha(settings.swipeRight) && !that.swipping) {

                if (that.swipeX === null) {
                    that.swipeX = e.clientX;
                } else if (el.ha(settings.swipeRightInit) &&
                    (e.clientX > that.swipeX) &&
                    (e.clientX - that.swipeX) > settings.swipeRightThreshold) {

                    if (!that.swipping) {
                        console.info("swipeRight");

                        that.swipping = true;

                        that.swipeX = null;
                        that.swipeY = null;
                        that.swipeRightCallback(e, m);
                    }

                }

            }

            if (el.ha(settings.swipeLeft) && !that.swipping) {

                if (that.swipeX === null) {
                    that.swipeX = e.clientX;
                } else if (el.ha(settings.swipeLeftInit) &&
                    (e.clientX < that.swipeX) &&
                        (e.clientX - that.swipeX) < settings.swipeLeftThreshold) {

                    if (!that.swipping) {
                        console.info("swipe Left");

                        that.swipping = true;

                        that.swipeX = null;
                        that.swipeY = null;

                        that.swipeLeftCallback(e, m);
                    }

                }

            }

            if (el.ha(settings.swipeUp) && !that.swipping) {

                if (that.swipeY === null) {
                    that.swipeY = e.clientY;
                } else {

                    //can get a negative value if the finger goes above the window
                    var clientY = (e.clientY >= 0) ? e.clientY : 0;

                    if (el.ha(settings.swipeUpInit) &&
                    (e.clientY < that.swipeY) &&
                        (clientY - that.swipeY) < settings.swipeUpThreshold) {

                        if (!that.swipping) {
                            console.info("swipeUp");

                            that.swipping = true;

                            that.swipeX = null;
                            that.swipeY = null;

                            that.swipeUpCallback(e, m);
                        }
                    }

                }

            }

            if (el.ha(settings.swipeDown) && !that.swipping) {

                if (that.swipeY === null) {
                    that.swipeY = e.clientY;
                } else if (el.ha(settings.swipeDownInit) &&
                    (e.clientY > that.swipeY) &&
                    (e.clientY - that.swipeY) > settings.swipeDownThreshold) {

                    if (!that.swipping) {
                        console.info("swipe Down");
                        that.swipping = true;

                        that.swipeY = null;
                        that.swipeX = null;
                        that.swipeDownCallback(e, m);
                    }

                }

            }

        },

        swipping: false,
        swipeX: null,
        swipeY: null,

        gestureChange: function (e) {

            var el = e.target,
                settings = this.settings;

            e.preventDefault();

            console.info("gesture Change \r\n" +
                            el.ha(settings.rotateIndicator) + "\r\n");

            if (el.ha(settings.rotateIndicator) &&
                    Math.abs(e.rotation) > settings.rotateThreshold) {
                //probably going to remove this or make it an optional setting to trigger
                el.style.webkitTransform =
                        'rotate(' + (el.gStartRotation + e.rotation) + 'deg)';

                this.rotateCallback(e, m);
            }

            if (el.ha(settings.scaleIndicator) &&
                    Math.abs(e.scale) > settings.scaleThreshold) {
                //probably going to remove this or make it an optional setting to trigger
                el.style.webkitTransform =
                        'scale(' + (el.gStartScale * e.scale) + ') ';
                this.scaleCallback(e, m);
            }

        },

        msGestureChange: function (e) {

            if (window.MSCSSMatrix) {
                this.processGestureChange(e, new MSCSSMatrix(e.target.style.transform));
            }

        },

        calculateTranslation: function (start, end) {

            return {
                translationX: end.x - start.x,
                translationY: end.y - start.y
            };
        },

        setupIndicator: function (callback, callbackName, threshold, threshholdName, indicator) {

            var that = this,
                settings = that.settings;

            if (callback !== undefined) {
                that[callbackName] = callback;
            }

            if (threshold) {
                that.settings[threshholdName] = threshold;
            }

            [].forEach.call(that.node, function (el) {
                el.setAttribute(settings[indicator], "true");
            });

        },

        PreventDefaultManipulationAndMouseEvent: function (evtObj) {

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

        },

        getTouchPoints: function (e) {

            var that = this,
                touchPoints = (typeof e.changedTouches != 'undefined') ?
                                e.changedTouches : [e],
                touchPoint = touchPoints[touchPoints.length - 1],
                tp;

            if (that.touchType === "pointer") {
                tp = { x: touchPoint.x, y: touchPoint.y };
            } else if (that.touchType === "touch") {
                tp = { x: touchPoint.pageX, y: touchPoint.pageY };
            } else {//mouse
                tp = { x: e.pageX, y: e.pageY };
            }

            return tp;
        },

        node: undefined,

        div: undefined,
        support: {},

        //DoubleTap Handler
        doDoubleTap: function (evt, el, settings) {

            var that = this;

            if (el.ha(settings.doubleTapIndicator) &&
                    el.ha(settings.doubleTapStart)) {

                el.removeAttribute(settings.doubleTapStart);
                clearTimeout(el.getAttribute(settings.doubleTapStart));
                that.doubleTapCallback(evt);

            }

            if (el.ha(settings.doubleTapIndicator) &&
                    !el.ha(settings.doubleTapStart)) {

                el.setAttribute(settings.doubleTapStart,
                                setTimeout(function () {
                                    el.removeAttribute(settings.doubleTapStart);
                                    clearTimeout(el.getAttribute(settings.doubleTapStart));
                                }, settings.doubleTapThreshold));

            }

        },

        setupSwipe: function (evt, el, settings) {

            var that = this;

            if (el.ha(settings.swipeRight)) {

                el.removeAttribute(settings.swipeRightEnd);

                if (!el.ha(settings.swipeRightInit)) {

                    el.setAttribute(settings.swipeRightInit,
                                JSON.stringify(that.getTouchPoints(evt)));

                }

            }

            if (el.ha(settings.swipeLeft)) {

                el.removeAttribute(settings.swipeLeftEnd);

                if (!el.ha(settings.swipeLeftInit)) {

                    el.setAttribute(settings.swipeLeftInit,
                                JSON.stringify(that.getTouchPoints(evt)));

                }

            }

            if (el.ha(settings.swipeUp)) {

                el.removeAttribute(settings.swipeUpEnd);

                if (!el.ha(settings.swipeUpInit)) {

                    el.setAttribute(settings.swipeUpInit,
                                JSON.stringify(that.getTouchPoints(evt)));

                }

            }

            if (el.ha(settings.swipeDown)) {

                el.removeAttribute(settings.swipeDownEnd);

                if (!el.ha(settings.swipeDownInit)) {

                    el.setAttribute(settings.swipeDownInit,
                                JSON.stringify(that.getTouchPoints(evt)));

                }

            }

        },

        //Touch event handlers
        setupTouch: function () {

            var that = this,
                settings = this.settings;

            [].forEach.call(this.node, function (el) {

                var moveHandler = function (evt) {

                    evt.preventDefault();
                    that.touchMoveHandler.call(that, evt, el, settings);
                },
                    endHandler = function (evt) {

                        evt.preventDefault();
                        that.endTouchHandler.call(that, evt, el, settings);
                    },
                    startHandler = function (evt) {

                        evt.preventDefault();
                        that.startTouchHandler.call(that, evt, el, settings);
                    };

                el.addEventListener(that.touchStart, startHandler);
                el.addEventListener(that.touchMove, moveHandler);
                el.addEventListener(that.touchEnd, endHandler);
                el.addEventListener(that.touchCancel, endHandler);

                el.addEventListener("mouseout", endHandler);
                el.addEventListener("mouseup", endHandler);

                el.addEventListener(that.touchEnd, function () {
                    console.info("touchEnd");
                });

                el.addEventListener("mouseout", function () {
                    console.info("mouseout");
                });

                el.addEventListener("mouseup", function () {
                    console.info("mouseup");
                });

                el.addEventListener(that.touchCancel, function () {
                    console.info("touchCancel");
                });

                el.addEventListener(that.touchOut, function () {
                    console.info("touchOut");
                });

                if (that.hasMouse) {

                    el.addEventListener("mousedown", startHandler);
                    el.addEventListener("mousemove", moveHandler);
                    el.addEventListener("mouseup", endHandler);

                }

            });

        },

        startTouchHandler: function (evt, el, settings) {

            var that = this;
            settings = this.settings;

            evt.preventDefault();

            console.info("touch start");

            if (el.ha(settings.moveIndicator)) {

                el.removeAttribute(settings.moveTouchEnded);

                if (!el.ha(settings.moveTouchInitial)) {

                    el.setAttribute(settings.moveTouchInitial,
                                        JSON.stringify(that.getTouchPoints(evt)));
                }

            }

            if (el.ha(settings.horizontalIndicator)) {

                el.removeAttribute(settings.horizontalTouchEnd);

                if (!el.ha(settings.horizontalTouchInit)) {

                    el.setAttribute(settings.horizontalTouchInit, JSON.stringify(that.getTouchPoints(evt)));
                }

            }

            if (el.ha(settings.verticalIndicator)) {

                el.removeAttribute(settings.verticalTouchEnd);

                if (!el.ha(settings.verticalTouchInit)) {

                    el.setAttribute(settings.verticalTouchInit, JSON.stringify(that.getTouchPoints(evt)));
                }

            }

            that.setupSwipe(evt, el, settings);

            if (el.ha(settings.tapIndicator) &&
                    !el.ha(settings.tapStart)) {

                el.setAttribute(settings.tapStart,
                                setTimeout(function () {
                                    clearTimeout(el.getAttribute(settings.tapStart));
                                    el.removeAttribute(settings.doubleTapStart);
                                }, 700));

            }

            that.doDoubleTap(evt, el, settings);

        },

        endTouchHandler: function (evt, el, settings) {

            var that = this;
            settings = this.settings;

            evt.preventDefault();

            if (el.ha(settings.moveTouchInitial)) {
                el.setAttribute(settings.moveTouchEnded, "true");
            }

            if (el.ha(settings.horizontalIndicator)) {
                el.setAttribute(settings.horizontalTouchEnd, "true");
            }

            if (el.ha(settings.verticalIndicator)) {
                el.setAttribute(settings.verticalTouchEnd, "true");
            }

            if (el.ha(settings.swipeRight)) {
                that.swipping = false;
                el.setAttribute(settings.swipeRightEnd, "true");
                el.removeAttribute(settings.swipeRightInit);
            }

            if (el.ha(settings.swipeLeft)) {
                that.swipping = false;
                el.setAttribute(settings.swipeLeftEnd, "true");
                el.removeAttribute(settings.swipeLeftInit);
            }

            if (el.ha(settings.swipeUp)) {
                that.swipping = false;
                el.setAttribute(settings.swipeUpEnd, "true");
                el.removeAttribute(settings.swipeUpInit);
            }

            if (el.ha(settings.swipeDown)) {
                that.swipping = false;
                el.setAttribute(settings.swipeDownEnd, "true");
                el.removeAttribute(settings.swipeDownInit);
            }

            if (el.ha(settings.tapIndicator) &&
                el.ha(settings.tapStart)) {

                that.tapCallback(evt);
                clearTimeout(el.getAttribute(settings.tapStart));
                el.removeAttribute(settings.tapStart);

            }

        },

        touchMoveHandler: function (evt, el, settings) {

            var that = this;
            settings = this.settings;

            evt.preventDefault();

            if (el.ha(settings.moveIndicator)) {

                if (!el.ha(settings.moveTouchEnded) &&
                            el.ha(settings.moveTouchInitial)) {

                    start = JSON.parse(el.getAttribute(settings.moveTouchInitial)),
                                end = that.getTouchPoints(evt),
                                translate = that.calculateTranslation(start, end);

                    el.style[that.support.transform] = "translate3D(" + translate.translationX + "px, " +
                                                    translate.translationY + "px, 0)";

                    //                    console.log(that.support.transform + ": " + el.style[that.support.transform]);

                }

            }

            if (el.ha(settings.horizontalIndicator)) {

                if (!el.ha(settings.horizontalTouchEnd) &&
                                el.ha(settings.horizontalTouchInit)) {

                    console.log("should -horizontal move");

                    var start = JSON.parse(el.getAttribute(settings.horizontalTouchInit)),
                                    end = that.getTouchPoints(evt),
                                    translate = that.calculateTranslation(start, end);

                    if (Math.abs(translate.translationX) > that.settings.moveThreshold) {

                        el.style[that.support.transform] =
                                        "translate3D(" + translate.translationX + "px, 0, 0)";

                    }

                }

            }

            if (el.ha(settings.verticalIndicator)) {

                if (!el.ha(settings.verticalTouchEnd) &&
                            el.ha(settings.verticalTouchInit)) {

                    var start = JSON.parse(el.getAttribute(settings.verticalTouchInit)),
                                end = that.getTouchPoints(evt),
                                translate = that.calculateTranslation(start, end);

                    if (Math.abs(translate.translationY) > that.settings.moveThreshold) {

                        el.style[that.support.transform] =
                                    "translate3D(0, " + translate.translationY + "px, 0)";

                    }

                }

            }

            if (el.ha(settings.swipeRightInit) ||
                    el.ha(settings.swipeLefttInit) ||
                    el.ha(settings.swipeUpInit) ||
                    el.ha(settings.swipeDownInit)) {

                if (evt.touches) {
                    evt.clientX = evt.touches[0].clientX;
                    evt.clientY = evt.touches[0].clientY;
                }

                that.processSwipe(el, evt, settings);

            }

        },

        //swipe methods
        swipeRight: function (callback, threshold) {

            this.setupIndicator(callback, "swipeRightCallback", threshold,
                                "swipeRightThreshold", "swipeRight");
            return this;
        },

        swipeLeft: function (callback, threshold) {

            this.setupIndicator(callback, "swipeLeftCallback", threshold, "swipeLeftThreshold", "swipeLeft");
            return this;
        },

        swipeUp: function (callback, threshold) {

            this.setupIndicator(callback, "swipeUpCallback", threshold, "swipeUpThreshold", "swipeUp");
            return this;
        },

        swipeDown: function (callback, threshold) {

            this.setupIndicator(callback, "swipeDownCallback", threshold, "swipeDownThreshold", "swipeDown");
            return this;
        },

        //move
        //may add a threshold value, but for now just assume it should always fire.
        move: function (callback) {

            this.setupIndicator(callback, "moveCallback", 0,
                                    "", "moveIndicator");
            return this;

        },

        horizontalMove: function (callback) {

            this.setupIndicator(callback, "moveHorizontalCallback", 0,
                                    "", "horizontalIndicator");
            return this;

        },

        verticalMove: function (callback) {

            this.setupIndicator(callback, "moveVerticalCallback", 0,
                                    "", "verticalIndicator");
            return this;

        },

        //rotate
        rotate: function (callback) {

            this.setupIndicator(callback, "rotateCallback", 0,
                                    "", "rotateIndicator");
            return this;

        },

        //scale
        scale: function (callback) {

            this.setupIndicator(callback, "scaleCallback", 0,
                                    "", "scaleIndicator");
            return this;

        },

        //Tap
        tap: function (callback) {

            var that = this;

            if (!callback) {
                callback = $.noop;
            }

            if (that.hasmsGesture) {

                [].forEach.call(this.node, function (el) {
                    el.addEventListener("MSGestureTap", callback, false);
                });

            } else {

                this.setupIndicator(callback, "tapCallback", 0,
                                    "", "tapIndicator");

            }

            return this;

        },

        //Double Tap Members

        dblTap: function (callback) {

            var that = this,
                settings = this.settings,
                tl = document.querySelector(".touch-log");

            if (callback) {
                settings.doubleTapCallback = callback;
            }

            this.setupIndicator(callback, "doubleTapCallback", 0,
                                "", "doubleTapIndicator");

            return this;

        },

        //Tap Hold Members
        tapHold: function (callback, endcallback, cancelcallback) {

            var that = this;

            if (callback) {
                that.tapHoldBeginCallback = callback;
            }

            if (this.hasmsGesture) {

                that.tapHoldBeginCallback = callback;
                that.tapHoldEndCallback = endcallback;
                that.tapHoldCancelCallback = cancelcallback;

                [].forEach.call(this.node, function (el) {

                    that.preventTapHoldContext(el);

                    el.addEventListener("MSGestureHold", function (evt) {
                        that.tapHoldCallback.call(that, evt);
                    }, false);

                });

            } else {

                [].forEach.call(this.node, function (el) {

                    that.preventTapHoldContext(el);

                    el.addEventListener(that.touchStart, function (evt) {
                        that.setupTapHold(el, evt);
                    });

                    if (that.hasMouse) {
                        el.addEventListener("mousedown", function (evt) {
                            that.setupTapHold(el, evt);
                        });
                    }

                }, false);

            }

            return this;
        },

        preventTapHoldContext: function (elm) {

            elm.addEventListener("contextmenu", function (e) {
                e.preventDefault();    // Disables system menu
            }, false);

        },

        setupTapHold: function (el, evt) {

            var that = this,
                tht;

            tht = setTimeout(function () {
                that.tapHoldBeginCallback.call(that, evt);
                clearTimeout(tht);
            }, 500);

            el.addEventListener(that.touchEnd, function (evt) {
                clearTimeout(tht);
            }, false);

            el.addEventListener(that.touchCancel, function (evt) {
                clearTimeout(tht);
            }, false);

        },

        tapHoldBeginCallback: $.noop,
        tapHoldEndCallback: $.noop,
        tapHoldCancelCallback: $.noop,

        tapHoldCallback: function (evt) {

            var that = this;

            evt.preventDefault();

            // console.info("evt.detail - " + evt.detail);

            if (evt.detail & evt.MSGESTURE_FLAG_BEGIN) {

                // Begin signals the start of a gesture. For the Hold gesture, this means the user has been holding long enough in place that the gesture will become a complete press & hold if the finger is lifted.
                that.tapHoldBeginCallback.call(that, evt);
            }

            if (evt.detail & evt.MSGESTURE_FLAG_END) {

                // End signals the end of the gesture.
                that.tapHoldEndCallback.call(that, evt);
            }

            if (evt.detail & evt.MSGESTURE_FLAG_CANCEL) {

                // Cancel signals the user started the gesture but cancelled it. For hold, this occurs when the user drags away before lifting. This flag is sent together with the End flag, signaling the gesture recognition is complete.
                that.tapHoldCancelCallback.call(that, evt);
            }

        },

        settings: {
            allowPageScroll: true,
            logging: false,
            swipeRightThreshold: 25,
            swipeLeftThreshold: -25,
            swipeUpThreshold: -25,
            swipeDownThreshold: 25,
            moveThreshold: 0,
            rotateThreshold: 0,
            scaleThreshold: 0,

            doubleTapThreshold: 700,

            //magic strings be gone!
            tapIndicator: "data-tap",
            tapStart: "data-tap-start",
            tapEnded: "data-tap-end",

            doubleTapIndicator: "data-dbltap",
            doubleTapStart: "data-dbltap-start",
            doubleTapEnded: "data-dbltap-end",


            rotateIndicator: "data-rotate",
            rotateEnded: "data-rotate-ended",
            rotateInitial: "data-rotate-initial",

            scaleIndicator: "data-scale",
            scaleEnded: "data-scale-ended",
            scaleInitial: "data-scale-initial",

            moveIndicator: "data-move",
            moveTouchEnded: "data-move-touch-ended",
            moveTouchInitial: "data-move-touch-initial",

            swipeRight: "data-swiperight",
            swipeRightInit: "data-swiperight-init",
            swipeRightEnd: "data-swiperight-end",

            swipeLeft: "data-swipeleft",
            swipeLeftInit: "data-swipeLeft-init",
            swipeLeftEnd: "data-swipeleft-end",

            swipeUp: "data-swipeup",
            swipeUpInit: "data-swipeup-init",
            swipeUpEnd: "data-swipeup-end",

            swipeDown: "data-swipedown",
            swipeDownInit: "data-swipedown-init",
            swipeDownEnd: "data-swipedown-end",

            horizontalIndicator: "data-move-horizontal",
            horizontalTouchInit: "data-horizontal-touch-initial",
            horizontalTouchEnd: "data-horizontal-touch-ended",

            verticalIndicator: "data-move-vertical",
            verticalTouchInit: "data-vertical-touch-initial",
            verticalTouchEnd: "data-vertical-touch-ended",

            autoMove: true,
            autoRotate: true,
            autoScale: true,
            autoHorizontalMove: true,
            autoVerticalMove: true

        }

    };

    // Give the init function the deeptissue prototype for later instantiation
    deeptissue.fn.init.prototype = deeptissue.fn;


    return (window.deeptissue = deeptissue);

}(window, $));
