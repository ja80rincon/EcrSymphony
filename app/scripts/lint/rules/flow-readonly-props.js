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
      TypeAlias: node => {
        const isPropType = node && node.id && node.id.name === 'Props';
        const isObjectTypeAnnotation =
          node && node.right && node.right.type === 'ObjectTypeAnnotation';
        const isReadOnly =
          node &&
          node.right &&
          node.right.id &&
          node.right.id.name === '$ReadOnly';
        if (isPropType && isObjectTypeAnnotation && !isReadOnly) {
          context.report({
            node,
            message:
              'Flow type of React Props should be read-only, e.g. $ReadOnly<{foo: number, bar: string}>',
            fix(fixer) {
              const currentText = sourceCode.getText(node.right);
              return fixer.replaceText(node.right, `$ReadOnly<${currentText}>`);
            },
          });
        }
      },
    };
  },
};
