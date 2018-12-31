# Release Notes

## 5.5.2

- Tweak node websocket init code to allow dealing with the `cp` dead zone between new client connecting and its websocket becoming available

## 5.5.1

- Store the last connected peek42 websocket reference (and terminate the previous)

## 5.5.0

- Add the ability to push log messages from server to browser via websocket

## 5.4.2

- Fix console sizing bug (missing initialization in sizing related code)

## 5.4.1

- Reset log entries level counters on log clear

## 5.4.0

- Add right side toolbar
- Add the ability to collapse/expand all log entries (&#x25b8; and &#x25be; toolbar buttons)
- Add the ability to filter log entries by level (the colorful toolbar buttons with numbers). They work like a set of checkboxes (each controls the visibility of the corresponding log entries level) and show the corresponding log entries count

## 5.3.0

- Add color strip to indicate the log level of each entry
- Add the ability to collapse/expand log entry (tap the comment row) and to display log entry initially collapsed (`{collapsed: true}` in the `opts` of the print calls)

## 5.2.0

- Show source traces for errors (using source maps if present and the [Source Map](https://github.com/mozilla/source-map) library loaded)

## 5.1.0

- Add library config options
- Add back (opt-out config options) the registration of p and pp globals and the automatic integration of ApiVis (browser builds)

## 5.0.0

- Significantly restructure source (with API and dist names changes) and use rollup to build node, browser and ES module bundles
- Show stack trace on error
- Remove the incomplete ability to disable the library
- Remove mouse handling code

## 4.2.0

- add `unhandledrejection` handler
- add dark theme

## 4.1.0

Integrate added [ApiVis](https://github.com/rpeev/apivis) function `descStr(obj, k)` (as `p.desc(obj, k[, comment])` in the code, `d(esc) expr1, expr2` in the JS eval box)

## 4.0.0

- remove `pm` function (use p.members (requires [ApiVis](https://github.com/rpeev/apivis)) instead)
- rename [ApiVis](https://github.com/rpeev/apivis) wrapper APIs to match the renamed library functions
- include Monofur font

## 3.0.0

- new look
- remove the UI for selecting the output function (now part of the eval JS box)

## 2.4.0

Intercept native console logging function calls

## 2.3.1

Tweak error reporting

## 2.3.0

If [ApiVis](https://github.com/rpeev/apivis) is loaded, define `p.type(obj[, comment])`, `p.props(obj[, comment])`, `p.protos(obj[, comment])` and `p.api(obj[, comment])` shorthands for the corresponding `apivis.xxxStr` functions

## 2.2.0

- fix buggy `Peek42.noop()`
- **pm** sorts the list of object members
- code tweaks

## 2.1.0

Post rename tweaks

## 2.0.0

Rename the library to **Peek42**

## 1.0.9

Minor CSS and bookmarklet tweaks

## 1.0.8

Add bookmarklet script and instructions

## 1.0.7

Allow single-quoted strings in the eval box

## 1.0.6

Fix display of undefined/null values

## 1.0.5

UI

* when minimized, **Konsole** features checkbox **Shhhh!** that puts it in 'quiet' mode when on - when log write occurs, it only flashes but stays minimized

## 1.0.4

UI

* display current **Konsole** version

Code

* wrap the code in an IIFE and list exports explicitly

## 1.0.3

Fix example description

## 1.0.2

UI usability improvements

* entries are logged from oldest at the bottom, to newest at the top (was the opposite)
* eval box focus is preserved while using the controls (except for **Minimize**)

## 1.0.1

Fix README

## 1.0.0

Initial release
