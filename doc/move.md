[Deeptissue.js homepage](http://deeptissuejs.com/) | [Documentation
table of contents](README.md)

# Move Method Examples

These are examples for the Move, Vertical Move and Horizontal Move functionality. 
The methods will execute when a user does the desired action. Each method 
has one parameter, an optional callback method. While you do not have
to specify a callback you really should, otherwise this is just wasted code.

Verified on: IE 9+, Chrome, FireFox, Mobile Safari

#Move

Like all the deeptissue methods you need a node or nodeList reference. Here is an
example Section element for this example:

        <section class="touch-area move-target">
            <div class="scroll-wrapper">Move</div>
        </section>

To create a new deeptissue object you need to pass a reference to the targeted
elements, which you would select using one of the document.querySelectorAll sort
of methods, like this:

var mvt = document.querySelectorAll(".move-target"),
     dt = deeptissue(mvt);

Now all you need to do is execute the move method, passing a callback to execute when the 
user moves the target element.

            dt.move(function (evt, m) {
            
                el.innerText = "move " +
                                evt.translationX + "px " +
                                evt.translationY + "px\n" +
                                el.innerText;
            
            });

Note, for now the library assumes you want to move the element so it does just that.
Basically it will follow your finger or mouse around the screen.

Vertical and Horizontal moves work exactly the same. The only difference is they have
'govenors' in place to only allow movement either up and down or left and right.

