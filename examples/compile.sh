#!/bin/bash

pwd
cd examples
mkdir html

node ./src/blog.js > ./html/blog.html
node ./src/landingpage.js > ./html/landingpage.html
node ./src/portfolio.js > ./html/portfolio.html
node ./src/test-forms.js > ./html/test-forms.html
