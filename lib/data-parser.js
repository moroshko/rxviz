import get from 'lodash.get';
import set from 'lodash.set';
import omit from 'lodash.omit';
import isUndefined from 'lodash.isundefined';
import isPlainObject from 'lodash.isplainobject';
import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';
import TinyQueue from 'tinyqueue';
import {
  defaultMainColor,
  defaultObservableColor,
  defaultShapeColor
} from './colors';

const isObservable = value =>
  isPlainObject(value) &&
  value.type === 'observable' &&
  Array.isArray(value.values);
const isError = value => isPlainObject(value) && !isUndefined(value.error);
const isCompleted = value => isPlainObject(value) && value.completed === true;
const isMeta = value => isPlainObject(value) && value.meta === true;

export const isTimeout = value => isMeta(value) && value.timeout === true;

const colorizeItem = ({ isObservable, item }) => {
  if (typeof item.color === 'string') {
    return item;
  }

  return {
    ...item,
    color: isObservable ? defaultObservableColor : defaultShapeColor
  };
};

const prepareItem = ({
  isObservable,
  isError,
  item,
  observableIndex,
  valueIndex,
  renderer
}) => {
  if (isFunction(renderer)) {
    const { value, ...rest } = item;
    const renderedItem = renderer({
      isObservable,
      isError,
      value: isError ? item.error : value,
      observableIndex,
      valueIndex
    });
    const color = isError
      ? {}
      : { color: isObservable ? defaultObservableColor : defaultShapeColor };

    return {
      ...color,
      ...rest,
      ...renderedItem
    };
  }

  return isError ? omit(item, 'error') : colorizeItem({ isObservable, item });
};

export const updateData = (observable, path, value) => {
  const result = cloneDeep(observable);
  const dataPath = path.reduce((acc, index) => acc.concat(index, 'values'), [
    'values'
  ]);

  return set(result, dataPath, get(result, dataPath).concat(value));
};

const getTextForMergedTooltip = value => {
  const { tooltip } = value;

  if (tooltip && tooltip.text) {
    return tooltip.text;
  }

  return value.text;
};

const calcMergedTooltip = mergedTooltip => ({
  text: mergedTooltip.join(', ')
});

export const getModel = ({
  data,
  renderer,
  inheritMainColor = true,
  mergeThreshold
}) => {
  let result = {
    observables: [],
    connectors: []
  };

  if (!isObservable(data)) {
    return result;
  }

  let queue = new TinyQueue(
    [
      {
        observable: data,
        startTime: 0,
        mainColor: defaultMainColor
      }
    ],
    (obs1, obs2) => obs1.startTime - obs2.startTime
  );

  while (queue.length > 0) {
    const { observable, startTime, mainColor, fromIndex } = queue.pop();
    const observableIndex = result.observables.length;

    if (!isUndefined(fromIndex)) {
      result.connectors.push({
        time: startTime,
        fromIndex,
        toIndex: observableIndex,
        color: mainColor
      });
    }

    let resultObservable = {
      values: [],
      startTime: startTime,
      mainColor: mainColor
    };

    for (let i = 0, len = observable.values.length; i < len; i++) {
      const item = observable.values[i];
      const valueIndex = resultObservable.values.length;

      if (isObservable(item)) {
        const { time } = item;
        const value = prepareItem({
          isObservable: true,
          isError: false,
          item: {
            ...omit(item, 'type', 'values'),
            isObservable: true,
            text: ''
          },
          observableIndex,
          valueIndex,
          renderer
        });
        const { color } = value;

        resultObservable.values.push(value);

        queue.push({
          observable: item,
          startTime: time,
          mainColor: inheritMainColor ? color : defaultMainColor,
          fromIndex: observableIndex
        });
      } else if (isError(item)) {
        resultObservable.endTime = item.time;
        resultObservable.error = prepareItem({
          isObservable: false,
          isError: true,
          item,
          observableIndex,
          valueIndex,
          renderer
        });
      } else if (isCompleted(item)) {
        resultObservable.endTime = item.time;
        resultObservable.completed = {
          time: item.time
        };

        const valuesCount = resultObservable.values.length;

        if (valuesCount > 0) {
          resultObservable.completed.lastValueBeforeCompletedTime =
            resultObservable.values[valuesCount - 1].time;
        }
      } else {
        const value = prepareItem({
          isObservable: false,
          isError: false,
          item,
          observableIndex,
          valueIndex,
          renderer
        });
        const lastValue =
          valueIndex === 0 ? null : resultObservable.values[valueIndex - 1];

        if (
          !mergeThreshold ||
          !lastValue ||
          value.time - lastValue.time > mergeThreshold
        ) {
          resultObservable.values.push(value);
        } else {
          if (typeof lastValue.count === 'number') {
            lastValue.count += 1;
            lastValue.mergedTooltip.push(getTextForMergedTooltip(value));
          } else {
            /* First merge */
            lastValue.mergedTooltip = [
              getTextForMergedTooltip(lastValue),
              getTextForMergedTooltip(value)
            ];
            lastValue.text = '...'; // Note that we change the text AFTER it's passed to lastValue.mergedTooltip
            lastValue.count = 2;
          }
        }
      }
    }

    resultObservable.values.forEach(value => {
      if (value.mergedTooltip) {
        value.tooltip = calcMergedTooltip(value.mergedTooltip);

        delete value.mergedTooltip;
        delete value.textStyle;
      }
    });

    result.observables.push(resultObservable);
  }

  return result;
};
