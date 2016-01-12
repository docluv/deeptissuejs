(function (window, deeptissue, undefined) {

    "use strict";

    deeptissue.fn.rotate = function (callback) {

        this.setupIndicator(callback, "rotateCallback", 0,
                                "", "rotateIndicator");
        return this;

    };


} (window, deeptissue));



