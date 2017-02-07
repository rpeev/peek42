# Peek42

Lightweight browser console useful for quick prototyping on touch-based devices like tablets and smartphones

![Screenshot](./screenshot.png)

## [Demos](https://rpeev.github.io/peek42/)

## Install

### In a html page

Reference **peek42.css** and **peek42.js**:  

```html
<link rel="stylesheet" href="path/to/peek42.css" />  
<script src="path/to/peek42.js"></script>
```

### Bookmarklet

Bookmark a webpage (any will do). Then change the title to your liking and the url to the following (set the *HOST* value to a local path in a locally hosted scenario):

```javascript
javascript: (function () {
  var HOST = 'https://cdn.rawgit.com/rpeev/peek42/master/',
    style, script;

  if (!window.Peek42BM) {
    window.Peek42BM = true;

    style = document.createElement('style');
    script = document.createElement('script');

    style.innerHTML = '@import "' + HOST + 'peek42.css' + '"';

    script.setAttribute('src', HOST + 'peek42.js');
    script.onload = function () {
      p(document.title, 'Hello');
    };

    document.body.appendChild(style);
    document.body.appendChild(script);
  }
})();
```

## Use

### In the code

Peek42 makes three global functions available - **p***(obj[, comment])* (stands for **print**), **pp***(obj[, comment])* (stands for **pretty print**) and **pm***(obj[, comment])* (stands for **print members**).

All functions accept javascript object to dump and optional comment. **p** concatenates the object to an empty string, **pp** uses *JSON.stringify* (with custom replacer function to avoid circular data exceptions) and **pm** uses *Object.getOwnPropertyNames(object)*. The comment is logged like a single-line js comment, on a line before the object. Default comment is generated if one is not provided. Peek42 listens for JavaScript errors and uses **pp** to show them with the error message as a comment.

**Peek42.noop***()* can be called at the top of the script to replace **p**, **pp** and **pm** with do-nothing functions.

### UI

If no log function has been called, *Peek42* is shown minimized. Click **Show** to show it. By default, whenever a log function is called, *Peek42* is shown and the log is scrolled to the top (entries are logged from oldest at the bottom to newest at the top), so that the latest logged object is visible. Click **Minimize** to minimize it. This can be changed by turning on the appropriately named checkbox **Shhhh!** (visible only when Peek42 is minimized). In this 'quiet' mode, Peek42 flashes on log write, but stays minimized. *Peek42* is slightly transparent in an effort to minimize the need to be minimized.

Clicking the title (**Peek42**) works like this:

* if *Peek42* is scrolled to the top, then it gets scrolled to the bottom and vica versa;
* if *Peek42* is scrolled to the middle, then it gets scrolled to the top;

Use **Resize** to resize *Peek42* (Peek42 limits its max and min height and the border briefly flashes in red upon reaching the limits) and **Clear** to clear the log contents.

Use the text box **JS to evaluate** to eval JavaScript code (write in the box and simply hit enter) and the controls before it to select the output function (**p** is the default).

See **peek42.html** for an example.
