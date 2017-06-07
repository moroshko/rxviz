import isPlainObject from 'lodash.isplainobject';

/*
  `areObjectsSame` is intended to be used in `shouldComponentUpdate`
  to compare `nextProps` to `this.props`.

  It shallowly compares `objA` and `objB`, and returns true iff
  they are equal.

  If optional `keys` are provided, and both are plain objects, they are also
  shallowly compared. If equal, then `objA` and `objB` are considered to
  be equal.
 */
export default function areObjectsSame(objA, objB, keys = []) {
  if (objA === objB) {
    return true;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  const keysMap = {};

  for (let i = 0, len = keys.length; i < len; i++) {
    keysMap[keys[i]] = true;
  }

  for (let i = 0, len = aKeys.length; i < len; i++) {
    let key = aKeys[i];
    const aValue = objA[key];
    const bValue = objB[key];

    if (aValue === bValue) {
      continue;
    }

    if (
      !keysMap[key] ||
      aValue === null ||
      bValue === null ||
      !isPlainObject(aValue) ||
      !isPlainObject(bValue)
    ) {
      return false;
    }

    const aValueKeys = Object.keys(aValue);
    const bValueKeys = Object.keys(bValue);

    if (aValueKeys.length !== bValueKeys.length) {
      return false;
    }

    for (let n = 0, len = aValueKeys.length; n < len; n++) {
      const aValueKey = aValueKeys[n];

      if (aValue[aValueKey] !== bValue[aValueKey]) {
        return false;
      }
    }
  }

  return true;
}
