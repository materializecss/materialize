#!/bin/bash

pwd
cd examples

node ./src/blog.js > ./html/blog.html
node ./src/landingpage.js > ./html/landingpage.html
node ./src/portfolio.js > ./html/portfolio.html
