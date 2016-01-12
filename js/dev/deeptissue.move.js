(function (window, deeptissue, undefined) {

    "use strict";

    //may add a threshold value, but for now just assume it should always fire.
    deeptissue.fn.move = function (callback) {

        this.setupIndicator(callback, "moveCallback", 0,
                                "", "moveIndicator");
        return this;

    };

    deeptissue.fn.horizontalMove = function (callback) {

        this.setupIndicator(callback, "moveHorizontalCallback", 0,
                                "", "horizontalIndicator");
        return this;

    };

    deeptissue.fn.verticalMove = function (callback) {

        this.setupIndicator(callback, "moveVerticalCallback", 0,
                                "", "verticalIndicator");
        return this;

    };

} (window, deeptissue));

