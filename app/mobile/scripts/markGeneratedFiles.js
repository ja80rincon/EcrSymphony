/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @flow
 * @format
 */

'use strict';

const glob = require('glob');
const path = require('path');
const prependFile = require('prepend-file');
const fs = require('fs');

const HEADER = `/**
 * @generated
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 **/

 `;

function main() {
  glob
    .sync('/**/__generated__/*.graphql.js', {
      root: path.join(__dirname, '..', 'src'),
    })
    .forEach(file => {
      fs.readFile(file, (err, data) => {
        if (err) throw err;
        if (data.indexOf(HEADER) < 0) {
          prependFile(file, HEADER);
        }
      });
    });
}

main();
