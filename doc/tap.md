[Deeptissue.js homepage](http://deeptissuejs.com/) | [Documentation
table of contents](README.md)

# Tap Method Examples
These are examples for the Tap, Double Tap and Tap Hold functionality. 
The methods will execute when a user does the desired action. Each method 
have one parameter, an optional callback method. While you do not have
to specify a callback you really should, otherwise this is just wasted code.

Verified on: IE 9+, Chrome, FireFox, Mobile Safari

#Tap

A tap identifies when a user quickly clicks an element with the mouse or quick touch
with their finger or pointer device (IE 10+). First you need to define the target 
element the user should tap.

<section class="touch-area sgl-tap">Single Tap</section>

To apply Deeptissue you need to pass a reference to the target element(s) to the
deeptissue constructor. Note you do not need to create the deeptissue object with
a new operator it is self instantiating. 

var dt = deeptissue(document.querySelectorAll(".sgl-tap"));

Now call the tap method, passing a callback method. Here I am writing to another
elemet to let me know I tapped and echoing some values to the console. You can 
see this in the demo pages.

dt.tap(function (evt) {

    tl.innerText = "Single Tap\n" + tl.innerText;

    console.log(evt.type);
    console.log(evt.screenX);
    console.log(evt.screenY);

});

For doubleTap do the same thing, except call the dblTap method. You can adjust the
time sensitivity by changing the doubleTapThreshold setting. The doubleTapThreshold
value is in milliseconds.

For Tap+Hold call the tapHold method. The tapHold functionality will either
use the MSGesture for tapHold or use a timeout for other platforms.