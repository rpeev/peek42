#!/usr/bin/env node
'use strict';

const apivis = require('apivis');
const peek42 = require('../dist/peek42.node').use(apivis);
//const peek42 = require('peek42').use(apivis);
  const {p, pp} = peek42;

p.api(process);
