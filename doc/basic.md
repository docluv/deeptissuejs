[Deeptissue.js homepage](http://deeptissuejs.com/) | [Documentation
table of contents](README.md)

# Basic Information

deeptissue is designed to be simple, extensible with no 3rd party library 
dependence. To create a new deeptissue object you simply need to provide a
reference to either a DOM node or nodeList. Basically if you use 
document.getElementById, .querySelector, .querySelectorAll, etc to retrieve
a reference to DOM element(s) it will work.

With that you need to have at least one element to act upon:

<section class="touch-area sgl-tap">Single Tap</section>

In this example I am going to use the 'sgl-tap' CSS class as a selector.

var dt = deeptissue(document.querySelectorAll(".sgl-tap"));

In this example I used the document.querySelectorAll, but I could have 
just as easily used .querySelector or .getElementsByClassName, deeptissue 
will not care.

Now that you have a deeptissue object, dt, you can now call the 
touch abstraction methods. Each method has a single parameter, a callback
method. 

dt.tap(function (evt) {

    //you wonderful action driver goes here

});

That is pretty much it. I wanted to make it simple.

Now for a little fancy.

You can actually pass in a 2nd, optional parameter, settings, to the deeptissue 
constructor. This object should contain any default settings overrides
you want to make so the library's behavior is modified. Because JavaScript 
is very flexible you can choose what properties to modify and ignore others.
Hek if you want to add a new property more power to you, I don't have a mechanism
in place to use them, but hey its your app afterall :)

var dt = deeptissue(document.querySelectorAll(".sgl-tap"),
                    {
                        swipeRightThreshold: 5, //wow this is a wuick trigger!
                        swipeLeftThreshold: -5,
                        swipeUpThreshold: 5,
                        swipeDownThreshold: 5,
                    });


These are the default settings values. There are a few properties that are not
currently being used. They will either go away or become something relevant in 
the coming days.

    settings: {
                allowPageScroll: true,
                logging: false,
                swipeRightThreshold: 25,
                swipeLeftThreshold: -25,
                swipeUpThreshold: 25,
                swipeDownThreshold: 25,
                moveThreshold: 0,
                rotateThreshold: 0,
                scaleThreshold: 0,

                doubleTapThreshold: 25,

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
                verticalTouchEnd: "data-vertical-touch-ended"

            }