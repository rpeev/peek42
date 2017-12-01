# Release Notes

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
