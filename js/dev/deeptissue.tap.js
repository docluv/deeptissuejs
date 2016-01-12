(function (window, deeptissue, undefined) {

    "use strict";

    //Tap
    deeptissue.fn.tap = function (callback) {

        var that = this;

        if (!callback) {
            callback = function () { };
        }

        if (that.hasmsGesture) {

            [ ].forEach.call(this.node, function (el) {
                el.addEventListener("MSGestureTap", callback, false);
            });

        } else {

            this.setupIndicator(callback, "tapCallback", 0,
                                "", "tapIndicator");

        }

        return this;

    };

    //Double Tap Members

    deeptissue.fn.dblTap = function (callback) {

        var that = this,
            settings = this.settings,
            tl = document.querySelector(".touch-log");

        if (callback) {
            settings.doubleTapCallback = callback;
        }

        this.setupIndicator(callback, "doubleTapCallback", 0,
                            "", "doubleTapIndicator");

        return this;

    };

    //Tap Hold Members
    deeptissue.fn.tapHold = function (callback, endcallback, cancelcallback) {

        var that = this;

        if (callback) {
            that.tapHoldBeginCallback = callback;
        }

        if (this.hasmsGesture) {

            [ ].forEach.call(this.node, function (el) {
                el.addEventListener("MSGestureHold", function (evt) {
                    that.tapHoldCallback.call(that, evt);
                }, false);
            });

        } else {

            [ ].forEach.call(this.node, function (el) {

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
    };

    deeptissue.fn.setupTapHold = function (el, evt) {

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

    };

    deeptissue.fn.tapHoldBeginCallback = function () { };
    deeptissue.fn.tapHoldEndCallback = function () { };
    deeptissue.fn.tapHoldCancelCallback = function () { };

    deeptissue.fn.tapHoldCallback = function (evt) {

        console.info("evt.detail - " + evt.detail);

        if (evt.detail & evt.MSGESTURE_FLAG_BEGIN) {

            // Begin signals the start of a gesture. For the Hold gesture, this means the user has been holding long enough in place that the gesture will become a complete press & hold if the finger is lifted.
            this.tapHoldBeginCallback.call(this, evt);
        }

        if (evt.detail & evt.MSGESTURE_FLAG_END) {

            // End signals the end of the gesture.
            this.tapHoldEndCallback.call(this, evt);
        }

        if (evt.detail & evt.MSGESTURE_FLAG_CANCEL) {

            // Cancel signals the user started the gesture but cancelled it. For hold, this occurs when the user drags away before lifting. This flag is sent together with the End flag, signaling the gesture recognition is complete.
            this.tapHoldCancelCallback.call(this, evt);
        }

    };


} (window, deeptissue));


