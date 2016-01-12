(function (window, deeptissue, undefined) {

    "use strict";

    deeptissue.fn.swipeRight = function (callback, threshold) {

        this.setupIndicator(callback, "swipeRightCallback", threshold,
                                "swipeRightThreshold", "swipeRight");
        return this;
    };

    deeptissue.fn.swipeLeft = function (callback, threshold) {

        this.setupIndicator(callback, "swipeLeftCallback", threshold, "swipeLeftThreshold", "swipeLeft");
        return this;
    };

    deeptissue.fn.swipeUp = function (callback, threshold) {

        this.setupIndicator(callback, "swipeUpCallback", threshold, "swipeUpThreshold", "swipeUp");
        return this;
    };

    deeptissue.fn.swipeDown = function (callback, threshold) {

        this.setupIndicator(callback, "swipeDownCallback", threshold, "swipeDownThreshold", "swipeDown");
        return this;
    };

} (window, deeptissue));

