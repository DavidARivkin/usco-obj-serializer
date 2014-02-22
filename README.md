obj format serializer for USCO project, based on THREE.js

General information
-------------------
This repository contains both the:
- node.js version:
obj-serializer.js at the root of the project
- polymer.js/browser version which is a combo of
lib/obj-serializer.js (browserified version of the above)
obj-serializer.html


How to generate browser/polymer.js version (with require support):
------------------------------------------------------------------
Type: 

    browserify obj-serializer.js -r ./obj-serializer.js:obj-serializer -o lib/obj-serializer.js -x composite-detect -x three

then replace (manually for now) all following entries in the generated file:

  "composite-detect":"awZPbp","three":"Wor+Zu"

with the correct module names, ie:

   "composite-detect":"composite-detect","three":"three"



