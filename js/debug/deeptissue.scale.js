(function (window, deeptissue, undefined) {

    "use strict";

    deeptissue.fn.scale = function (callback) {

        this.setupIndicator(callback, "scaleCallback", 0,
                                "", "scaleIndicator");
        return this;

    };


} (window, deeptissue));



