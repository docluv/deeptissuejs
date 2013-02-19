[Deeptissue.js homepage](http://deeptissuejs.com/) | [Documentation
table of contents](README.md)

# Swipe Method Examples

These are examples for the Swipe Right, Left, Up and Down functionality. 
The methods will execute when a user does the desired action. Each method 
has one parameter, an optional callback method. While you do not have
to specify a callback you really should, otherwise this is just wasted code.

Verified on: IE 9+, Chrome, FireFox, Mobile Safari

#SwipeRight, SwipeLeft, SwipeUp, SwipeDown

Unlke the other examples, this time I am going to show the chaining capabilities for
each of the deeptissue action methods. Again they will apply the desired functionality
to the target element.

<section class="touch-area"></section>

Now select the element and create a deeptissue object.

var dt = deeptissue(document.querySelectorAll((".touch-area")));

            dt.swipeRight(function (evt, m, translate) {

                //do something here
            
            })
            
            .swipeLeft(function (evt, m, translate) {
            
                //do something here
            
            })
            
            .swipeDown(function (evt, m, translate) {
            
                //do something here
            
            })
            
            .swipeUp(function (evt, m, translate) {
            
                //do something here
            
            });

Look for some changes to these methods. Right now they are firing every time a move event 
fires after the threshold is satisfied. I think I will change it to a single event exection.
Also know you can adjust the distance threshold for each of the directions. The default 
value is 25 pixels.