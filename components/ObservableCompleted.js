import { Component } from 'react';
import PropTypes from 'prop-types';
import isPlainObject from 'lodash.isplainobject';
import areObjectsSame from '../lib/are-objects-same';
import { areScalesSame } from '../lib/d3-helpers';

const completedStrokeWidth = 2;

export default class ObservableCompleted extends Component {
  static propTypes = {
    completed: PropTypes.object,
    height: PropTypes.number.isRequired,
    mainColor: PropTypes.string.isRequired,
    shapeOuterSize: PropTypes.number.isRequired,
    scale: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    onRender: PropTypes.func
  };

  shouldComponentUpdate(nextProps) {
    const curr = {
      completed: this.props.completed,
      height: this.props.height,
      mainColor: this.props.mainColor,
      shapeOuterSize: this.props.shapeOuterSize,
      style: this.props.style,
      onRender: this.props.onRender
    };
    const next = {
      completed: nextProps.completed,
      height: nextProps.height,
      mainColor: nextProps.mainColor,
      shapeOuterSize: nextProps.shapeOuterSize,
      style: nextProps.style,
      onRender: nextProps.onRender
    };

    return (
      !areObjectsSame(curr, next, ['completed', 'style']) ||
      !areScalesSame(this.props.scale, nextProps.scale)
    );
  }

  maybeCallOnRender = container => {
    const { onRender } = this.props;

    if (container !== null && onRender) {
      onRender(container);
    }
  };

  render() {
    const { completed } = this.props;

    if (!isPlainObject(completed) || typeof completed.time !== 'number') {
      return null;
    }

    const { height, mainColor, shapeOuterSize, scale, style } = this.props;
    const { time, lastValueBeforeCompletedTime } = completed;
    const x = scale(time);
    const lineHeight =
      typeof lastValueBeforeCompletedTime === 'number' &&
      scale(lastValueBeforeCompletedTime) + shapeOuterSize / 2 >= x
        ? 1.5 * shapeOuterSize
        : shapeOuterSize;
    const y1 = (height - lineHeight) / 2;

    return (
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y1 + lineHeight}
        strokeWidth={completedStrokeWidth}
        stroke={mainColor}
        style={style}
        ref={this.maybeCallOnRender}
      />
    );
  }
}
