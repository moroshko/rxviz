import isPlainObject from 'lodash.isplainobject';

export const defaultRenderer = ({ isObservable, isError, value }) => {
  if (isObservable) {
    return {};
  }

  if (isError) {
    return {
      tooltip: {
        text: value
      }
    };
  }

  if (isPlainObject(value)) {
    return {
      text: '...',
      tooltip: {
        text: JSON.stringify(value, null, 2),
        textStyle: {
          fontFamily: 'monospace',
          whiteSpace: 'pre'
        }
      }
    };
  }

  const valueStr = String(value);

  if (valueStr.length <= 3) {
    return {
      text: valueStr
    };
  }

  return {
    text: '...',
    tooltip: {
      text: valueStr
    }
  };
};
