/*
Extending the functionality of the Mobile Boilerplate helper object.
*/

var _gaq = _gaq || undefined,
    $ = $ || {};

(function (document, $) {

    "use strict";

    window.$ = $ || {};

    // If we split this up into two functions we can reuse
    // this function if we aren't doing full page reloads.

    // If we cache this we don't need to re-calibrate everytime we call
    // the hide url bar
    $.BODY_SCROLL_TOP = false;

    // So we don't redefine this function everytime we
    // we call hideUrlBar
    $.getScrollTop = function () {
        var win = window;
        var doc = document;

        return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    };

    // It should be up to the mobile
    $.hideUrlBar = function () {
        var win = window;

        // if there is a hash, or $.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
        if (!location.hash && $.BODY_SCROLL_TOP !== false) {
            win.scrollTo(0, $.BODY_SCROLL_TOP === 1 ? 0 : 1);
        }
    };

    $.hideUrlBarOnLoad = function () {
        var win = window;
        var doc = win.document;
        var bodycheck;

        // If there's a hash, or addEventListener is undefined, stop here
        if (!location.hash && win.addEventListener) {

            // scroll to 1
            window.scrollTo(0, 1);
            $.BODY_SCROLL_TOP = 1;

            // reset to 0 on bodyready, if needed
            bodycheck = setInterval(function () {
                if (doc.body) {
                    clearInterval(bodycheck);
                    $.BODY_SCROLL_TOP = $.getScrollTop();
                    $.hideUrlBar();
                }
            }, 15);

            win.addEventListener('load', function () {
                setTimeout(function () {
                    // at load, if user hasn't scrolled more than 20 or so...
                    if ($.getScrollTop() < 20) {
                        // reset to hide addr bar at onload
                        $.hideUrlBar();
                    }
                }, 0);
            });
        }
    };


    //simple version of the jQuery function
    $.extend = function () {

        var target = arguments[0] || {},
            i = 1,
            src,
            name,
            copy,
            options,
            length = arguments.length;

        for (i = 1; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) !== null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;

    };

    $.loadScript = function (id, url, callback) {

        if (!document.getElementById(id)) {

            var script = document.createElement("script");

            script.type = "text/javascript";
            script.id = id;

            if (script.readyState) {  //IE

                script.onreadystatechange = function () {

                    if (script.readyState === "loaded" ||

                        script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback();

                    }

                };

            } else {  //Others
                script.onload = function () {
                    callback();
                };
            }

            script.src = url;
            document.body.appendChild(script);

        } else {
            callback();
        }
    };

    $.getVendorPropertyName = function (prop) {

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'],
                    vendorProp, i,
                    div = document.createElement('div'),
                    prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        if (prop in div.style) {
            return prop;
        }

        for (i = 0; i < prefixes.length; ++i) {

            vendorProp = prefixes[i] + prop_;

            if (vendorProp in div.style) {
                return vendorProp;
            }

        }

        // Avoid memory leak in IE.
        this.div = null;
    };

    $.checkTransform3dSupport = function () {

        var div = document.createElement('div'),
            transform = $.getVendorPropertyName('transform');

        div.style[transform] = '';
        div.style[transform] = 'rotateY(90deg)';
        return div.style[transform] !== '';

    };

    $.buildVendorNames = function () {

        return {
            // Check for the browser's transitions support.
            transition: $.getVendorPropertyName('transition'),
            transitionDelay: $.getVendorPropertyName('transitionDelay'),
            transform: $.getVendorPropertyName('transform'),
            transformOrigin: $.getVendorPropertyName('transformOrigin'),
            transform3d: $.checkTransform3dSupport()

        };

    };

    window.AddEvent = function (ele, evt, callback, useCapture) {

        useCapture = useCapture || false;

        if (!callback || !evt || !ele) {
            return; //nothing to do here
        }

        if (ele.addEventListener) {
            ele.addEventListener(evt, callback, useCapture);
        } else if (ele.attachEvent) {
            ele.attachEvent(evt, callback);
        }

    };

    //helps with old Android and iOS web apps
    $.parseLocalStorage = function (key) {

        var value = localStorage.getItem(key);

        if (!value) {
            return {};
        }

        return JSON.parse(value) || {};

    };

    $.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    };

    $.guid = function () {
        return $.s4() + $.s4() + '-' + $.s4() + '-' + $.s4() + '-' +
               $.s4() + '-' + $.s4() + $.s4() + $.s4();
    };

    $.data = function (view, name, val) {

        val = val || "";

        return (view.hasAttribute("data-" + name) ? view.getAttribute("data-" + name) : val);

    };

    $.removeClass = function(view, cssClass){

        view.className = view.className
                            .replace(" " + cssClass + " ", " ")
                            .replace(" " + cssClass, "")
                            .replace(cssClass + " ", "");

    };

    $.addClass = function (view, cssClass) {

        if (!view || !cssClass) {
            return;
        }

        if (view.classList) {

            view.classList.add(cssClass);

        } else {

            view.className += " " + cssClass;

        }

    };

    $.attr = function (view, attr, value) {

        if (!view) {
            return;
        }

        if (value === undefined) {

            return (view.hasAttribute(attr) ? view.getAttribute(attr) : null);

        } else {

            view.setAttribute(attr, value);
            return this; //chain it why not?

        }

    };

    $.noop = function () { };

})(document, $);