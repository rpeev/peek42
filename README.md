# Konsole

Simple JavaScript browser console (suitable for touch-based devices like tablets and smartphones)

![Screenshot of Konsole on an iPad mini 3](./screenshot.png)

## [Demos](https://rpeev.github.io/konsole/)

## Install

### In a html page

Reference **konsole.css** and **konsole.js** in the page head:  

```html
<link rel="stylesheet" href="path/to/konsole.css" />  
<script src="path/to/konsole.js"></script>
```

### Bookmarklet

TBD

## Use

### In the code

Konsole makes three global functions available - **kp***(obj[, comment])* (stands for **konsole print**), **kpp***(obj[, comment])* (stands for **konsole pretty print**) and **kpm***(obj[, comment])* (stands for **konsole print members**).

All functions accept javascript object to dump and optional comment. **kp** effectively uses object's *toString* method, **kpp** uses *JSON.stringify* (with custom replacer function to avoid circular data exceptions) and **kpm** uses *Object.getOwnPropertyNames(object)*. The comment is logged like a single-line js comment, on a line before the object. Default comment is generated if one is not provided. Konsole listens for JavaScript errors and uses **kpp** to show them with the error message as a comment.

**Konsole.noop***()* can be called at the top of the script to replace **kp**, **kpp** and **kpm** with do-nothing functions.

### UI

If no log function has been called, *Konsole* is shown minimized. Click **Show** to show it. Whenever a log function is called, *Konsole* is shown and the log is scrolled to the top (entries are logged from oldest at the bottom to newest at the top), so the latest logged object is visible. Click **Minimize** to minimize it. *Konsole* is slightly transparent in an effort to minimize the need to be minimized.

Clicking the title (**Konsole**) works like this:

- if *Konsole* is scrolled to the top, then it gets scrolled to the bottom and vica versa;
- if *Konsole* is scrolled to the middle, then it gets scrolled to the top;

Use **Resize** to resize *Konsole* and **Clear** to clear the log contents.

Use the text box **JS to evaluate** to eval JavaScript code (write in the box and simply hit enter) and the controls before it to select the output function (**kp** is the default).

See **konsole.html** for an example.
