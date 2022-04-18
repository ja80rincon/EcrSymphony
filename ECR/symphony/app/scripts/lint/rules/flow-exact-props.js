/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/* eslint-env node */

const findObject = node => {
  if (node.type === 'IntersectionTypeAnnotation') {
    return node.types.find(n => n.type === 'ObjectTypeAnnotation');
  } else if (node.type === 'ObjectTypeAnnotation') {
    return node;
  } else {
    return null;
  }
};

module.exports = context => ({
  TypeAlias: node => {
    const sourceCode = context.getSourceCode();
    const isPropType = node && node.id && node.id.name.endsWith('Props');
    let objectNode = null;
    if (node.right.type === 'ObjectTypeAnnotation') {
      objectNode = node.right;
    } else if (
      node.right.type === 'GenericTypeAnnotation' &&
      node.right.id.name === '$ReadOnly'
    ) {
      objectNode = findObject(node.right.typeParameters.params[0]);
    } else if (node.right.type === 'IntersectionTypeAnnotation') {
      objectNode = findObject(node.right);
    }

    if (objectNode != null && !objectNode.exact && isPropType) {
      context.report({
        node,
        message:
          'Flow type of React Props should be exact, e.g. {|foo: number, bar: string|}',
        fix(fixer) {
          const currentText = sourceCode.getText(objectNode);
          return fixer.replaceText(
            objectNode,
            `{|${currentText.slice(1, currentText.length - 1)}|}`,
          );
        },
      });
    }
  },
});
