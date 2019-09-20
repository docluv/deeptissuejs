# [Deeptissue.js](https://deeptissuejs.com/)

**** NOTE ****

Apple seems to have finally caught up to the rest of the web on touch events, at least on iOS. As of iOS 13 Safari now seems to have support for Pointer Events.

As soon as I have time to test and verify this I will update.

So hopefully, like many other library floating around the web I can deprecate this library in favor os native functionality. :)

****

Deeptissue.js is a helper library to abstract away the differences between the MSPointer 
and WebKit Touch APIs. There are many JavaScript libraries publicly available that support 
the WebKit API and a few that help with the MSPointer API, but I reand nothing that bridged 
the gap. So I decided I would create a library to do just that.

* Source: [https://github.com/docluv/deeptissuejs](https://github.com/docluv/deeptissuejs)
* Homepage: [http://deeptissuejs.com](http://deeptissuejs.com)
* Twitter: [@ChrisLove](http://twitter.com/ChrisLove)

## Quick start

Clone the git repo - `git clone git://github.com/docluv/deeptissuejs.git` -
or [download it](https:////github.com/docluv/deeptissuejs/deeptissue.min.js)


## Features

* Abstracts MSPointer and WebKit Touch APIs.
* Supports 
* tap, double-tap, tap-hold, 
* move, horizontal-move, vertical-move,
* swipe left, swipe right, swipe up, swipe down,
* Rotate and Scale for IE10 and Mobile Safari 

 ## Documentation

Take a look at the [documentation table of contents](doc/README.md). This
documentation is bundled with the project, which makes it readily available for
offline reading and provides a useful starting point for any documentation you
want to write about your project.

