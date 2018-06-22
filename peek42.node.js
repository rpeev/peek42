#!/usr/bin/env node
'use strict';

const apivis = require('apivis');
const peek42 = require('peek42');
const {p, pp} = peek42.use(apivis);

p.api(peek42);
