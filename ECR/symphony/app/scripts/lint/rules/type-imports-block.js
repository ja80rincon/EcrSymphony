/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/* eslint-env node */

module.exports = {
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      ImportDeclaration: node => {
        if (node.importKind !== 'type') {
          return;
        }

        const lineNumber = node.loc.end.line;
        const rangeStart = sourceCode.getIndexFromLoc({
          line: lineNumber + 1,
          column: 0,
        });
        const nextNode = sourceCode.getNodeByRangeIndex(rangeStart);
        if (nextNode.importKind === 'type') {
          return;
        }

        if (sourceCode.lines[lineNumber].trim() !== '') {
          context.report({
            node: node,
            message:
              'The types import block should be separated by an empty line',
            fix(fixer) {
              return fixer.insertTextAfter(node, '\n');
            },
          });
        }
      },
    };
  },
};
