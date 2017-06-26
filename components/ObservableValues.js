import { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import ObservableValue from './ObservableValue';
import areObjectsSame from '../lib/are-objects-same';
import { areScalesSame } from '../lib/d3-helpers';
import { hasHoverTooltip } from '../lib/tooltips';

export default class ObservableValues extends Component {
  static propTypes = {
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
    observableIndex: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    mainColor: PropTypes.string.isRequired,
    shapeOuterSize: PropTypes.number.isRequired,
    shapeStrokeWidth: PropTypes.number.isRequired,
    animate: PropTypes.bool.isRequired,
    allTooltips: PropTypes.array.isRequired,
    scale: PropTypes.func.isRequired,
    onValueMouseEnter: PropTypes.func.isRequired,
    onValueMouseLeave: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    const curr = {
      observableIndex: this.props.observableIndex,
      height: this.props.height,
      mainColor: this.props.mainColor,
      shapeOuterSize: this.props.shapeOuterSize,
      shapeStrokeWidth: this.props.shapeStrokeWidth,
      animate: this.props.animate,
      onValueMouseEnter: this.props.onValueMouseEnter,
      onValueMouseLeave: this.props.onValueMouseLeave
    };
    const next = {
      observableIndex: nextProps.observableIndex,
      height: nextProps.height,
      mainColor: nextProps.mainColor,
      shapeOuterSize: nextProps.shapeOuterSize,
      shapeStrokeWidth: nextProps.shapeStrokeWidth,
      animate: nextProps.animate,
      onValueMouseEnter: nextProps.onValueMouseEnter,
      onValueMouseLeave: nextProps.onValueMouseLeave
    };
    const {
      values: currValues,
      allTooltips: currAllTooltips,
      scale: currScale
    } = this.props;
    const {
      values: nextValues,
      allTooltips: nextAllTooltips,
      scale: nextScale
    } = nextProps;

    return (
      !areObjectsSame(curr, next) ||
      !isEqual(currValues, nextValues) ||
      !isEqual(currAllTooltips, nextAllTooltips) ||
      !areScalesSame(currScale, nextScale)
    );
  }

  render() {
    const {
      values,
      observableIndex,
      height,
      mainColor,
      shapeOuterSize,
      shapeStrokeWidth,
      animate,
      allTooltips,
      scale,
      onValueMouseEnter,
      onValueMouseLeave
    } = this.props;

    return (
      <g>
        {values.map((valueObj, valueIndex) => {
          const { time, isObservable, color, text, count } = valueObj;
          const strokeWidth = isObservable ? 0 : shapeStrokeWidth;
          const textStyle = {
            fill: mainColor,
            /* Temporarily needed for Firefox. See: https://stackoverflow.com/a/44744392/247243 */
            dominantBaseline: 'central',
            ...valueObj.textStyle
          };
          const addMouseHandlers = hasHoverTooltip(
            observableIndex,
            valueIndex,
            allTooltips
          );

          return (
            <ObservableValue
              observableIndex={observableIndex}
              valueIndex={valueIndex}
              centerX={scale(time)}
              centerY={height / 2}
              size={shapeOuterSize}
              strokeWidth={strokeWidth}
              strokeColor={mainColor}
              fillColor={color}
              text={text}
              textStyle={textStyle}
              count={count}
              animate={animate}
              onMouseEnter={addMouseHandlers ? onValueMouseEnter : null}
              onMouseLeave={addMouseHandlers ? onValueMouseLeave : null}
              key={valueIndex}
            />
          );
        })}
      </g>
    );
  }
}
