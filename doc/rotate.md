[Deeptissue.js homepage](http://deeptissuejs.com/) | [Documentation
table of contents](README.md)

# Rotate Method Examples

This is an example for the Rotate functionality. The methods will execute 
when a user does the desired action, which is place two fingers on the screen
and twist their hand. Like the other methods there is one parameter, a callback.

Note this will only work on IE 10 with touch and mobile safari. I do not have it
working for Android/Chrome etc since they do not support gestures. Since it looks
like Chrome will soon support the MSPointer API (lets hope) I may not bother with 
Android support.

#Rotate

Like all the deeptissue methods you need a node or nodeList reference. Here is an
example Section element for this example:

        <section class="touch-area rotate-target"></section>

To create a new deeptissue object you need to pass a reference to the targeted
elements, which you would select using one of the document.querySelectorAll sort
of methods, like this:

    var tl = document.querySelector(".touch-log"),
        rt = deeptissue(document.querySelectorAll(".rotate-target"));

Now all you need to do is execute the move method, passing a callback to execute when the 
user moves the target element.

                rt.rotate(function (evt, m) {
            
                    tl.textContent = "rotating " +
                                    evt.rotation + "\n" +
                                    tl.textContent;
            
                    evt.target.style.transform = m.rotate(evt.rotation * 180 / Math.PI); // Apply Rotation
            
                });

Note, for now the library assumes you want to rotate the element so it does just that.
Basically it will follow your finger's movement on the screen.
