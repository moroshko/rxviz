import isUndefined from 'lodash.isundefined';
import isPlainObject from 'lodash.isplainobject';

const addTooltipIfOk = ({
  tooltips,
  defaultTextStyle,
  time,
  observableIndex,
  valueIndex,
  tooltip
}) => {
  if (!isPlainObject(tooltip)) {
    return tooltips;
  }

  const { text } = tooltip;

  if (typeof text !== 'string' || text === '') {
    return tooltips;
  }

  const { backgroundColor, persistent } = tooltip;
  const textStyle = {
    ...defaultTextStyle,
    ...tooltip.textStyle
  };

  return tooltips.concat({
    observableIndex,
    valueIndex,
    time,
    text,
    textStyle,
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(persistent === true ? { persistent } : {})
  });
};

export const extractTooltips = (observables, defaultTextStyle) => {
  let tooltips = [];

  for (
    let observableIndex = 0, observablesCount = observables.length;
    observableIndex < observablesCount;
    observableIndex++
  ) {
    const { values, error } = observables[observableIndex];

    for (
      let valueIndex = 0, valuesCount = values.length;
      valueIndex < valuesCount;
      valueIndex++
    ) {
      const value = values[valueIndex];
      const { time, tooltip } = value;

      tooltips = addTooltipIfOk({
        tooltips,
        defaultTextStyle,
        time,
        observableIndex,
        valueIndex,
        tooltip
      });
    }

    if (isPlainObject(error)) {
      tooltips = addTooltipIfOk({
        tooltips,
        defaultTextStyle,
        time: error.time,
        observableIndex,
        valueIndex: 'error',
        tooltip: error.tooltip
      });
    }
  }

  return tooltips;
};

export const getTooltipsModels = ({
  tooltips,
  dimensions,
  scale,
  marginLeft,
  countsHeight,
  observableHeight,
  shapeSize,
  arrowHeight,
  arrowDistance,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft
}) => {
  let models = [];

  for (let i = 0, len = tooltips.length; i < len; i++) {
    const { width, height } = dimensions[i];

    if (width === 0 || height === 0) {
      continue;
    }

    const {
      observableIndex,
      time,
      text,
      textStyle,
      backgroundColor
    } = tooltips[i];

    const shapeCenterX = marginLeft + scale(time);
    const shapeBottomY =
      countsHeight + observableHeight * (observableIndex + 0.5) + shapeSize / 2;
    const rectWidth = paddingLeft + width + paddingRight;
    const rectHeight = paddingTop + height + paddingBottom;

    models.push({
      x: shapeCenterX - rectWidth / 2,
      y: shapeBottomY + arrowDistance + arrowHeight,
      width: rectWidth,
      height: rectHeight,
      text,
      ...(textStyle ? { textStyle } : {}),
      ...(backgroundColor ? { backgroundColor } : {})
    });
  }

  return models;
};

export const getSvgDimensions = ({
  svgWidthWithoutTooltips,
  svgHeightWithoutTooltips,
  tooltipsModels
}) => {
  let maxYplusHeight = -Infinity;

  tooltipsModels.forEach(({ y, height }) => {
    if (y + height > maxYplusHeight) {
      maxYplusHeight = y + height;
    }
  });

  return {
    width: svgWidthWithoutTooltips,
    height: Math.max(svgHeightWithoutTooltips, maxYplusHeight)
  };
};

export const getTooltipsToShow = (tooltips, allTooltips) =>
  allTooltips.filter(
    tooltip =>
      tooltip.persistent === true ||
      tooltips.some(
        t =>
          t.observableIndex === tooltip.observableIndex &&
          t.valueIndex === tooltip.valueIndex
      )
  );

export const hasHoverTooltip = (observableIndex, valueIndex, allTooltips) =>
  allTooltips.some(
    tooltip =>
      tooltip.persistent !== true &&
      tooltip.observableIndex === observableIndex &&
      tooltip.valueIndex === valueIndex
  );

export const addTooltip = (
  observableIndex,
  valueIndex,
  tooltips,
  allTooltips
) => {
  const tooltipToAdd = allTooltips.find(
    tooltip =>
      tooltip.observableIndex === observableIndex &&
      tooltip.valueIndex === valueIndex
  );

  return isUndefined(tooltipToAdd) ? tooltips : tooltips.concat(tooltipToAdd);
};

export const removeTooltip = (observableIndex, valueIndex, tooltips) => {
  for (let i = tooltips.length - 1; i >= 0; i--) {
    const tooltip = tooltips[i];

    if (
      tooltip.observableIndex === observableIndex &&
      tooltip.valueIndex === valueIndex
    ) {
      return tooltips.slice(0, i).concat(tooltips.slice(i + 1));
    }
  }

  return tooltips;
};
