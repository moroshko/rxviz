import { Component } from 'react';
import PropTypes from 'prop-types';
import isPlainObject from 'lodash.isplainobject';
import isEqual from 'lodash.isequal';
import areObjectsSame from '../lib/are-objects-same';
import { areScalesSame } from '../lib/d3-helpers';

const errorStrokeWidth = 2;

export default class ObservableError extends Component {
  static propTypes = {
    error: PropTypes.object,
    height: PropTypes.number.isRequired,
    mainColor: PropTypes.string.isRequired,
    shapeOuterSize: PropTypes.number.isRequired,
    scale: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    onRender: PropTypes.func,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    const curr = {
      height: this.props.height,
      mainColor: this.props.mainColor,
      shapeOuterSize: this.props.shapeOuterSize,
      style: this.props.style,
      onRender: this.props.onRender,
      onMouseEnter: this.props.onMouseEnter,
      onMouseLeave: this.props.onMouseLeave
    };
    const next = {
      height: nextProps.height,
      mainColor: nextProps.mainColor,
      shapeOuterSize: nextProps.shapeOuterSize,
      style: nextProps.style,
      onRender: nextProps.onRender,
      onMouseEnter: nextProps.onMouseEnter,
      onMouseLeave: nextProps.onMouseLeave
    };
    const { error: currError, scale: currScale } = this.props;
    const { error: nextError, scale: nextScale } = nextProps;

    return (
      !areObjectsSame(curr, next, ['style']) ||
      !isEqual(currError, nextError) ||
      !areScalesSame(currScale, nextScale)
    );
  }

  maybeCallOnRender = container => {
    const { onRender } = this.props;

    if (container !== null && onRender) {
      onRender(container);
    }
  };

  render() {
    const { error } = this.props;

    if (!isPlainObject(error) || typeof error.time !== 'number') {
      return null;
    }

    const {
      height,
      mainColor,
      shapeOuterSize,
      scale,
      style,
      onMouseEnter,
      onMouseLeave
    } = this.props;
    const { time, tooltip } = error;
    const errorSize = 0.6 * shapeOuterSize;
    const halfErrorSize = errorSize / 2;
    const x = scale(time);
    const y = height / 2;
    const minX = x - halfErrorSize;
    const minY = y - halfErrorSize;
    const maxX = x + halfErrorSize;
    const maxY = y + halfErrorSize;

    return (
      <g style={style} ref={this.maybeCallOnRender}>
        <line
          x1={minX}
          y1={minY}
          x2={maxX}
          y2={maxY}
          strokeWidth={errorStrokeWidth}
          stroke={mainColor}
        />
        <line
          x1={minX}
          y1={maxY}
          x2={maxX}
          y2={minY}
          strokeWidth={errorStrokeWidth}
          stroke={mainColor}
        />
        {tooltip ? (
          <rect
            x={minX}
            y={minY}
            width={errorSize}
            height={errorSize}
            fill="transparent"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        ) : null}
      </g>
    );
  }
}
