import { Component } from 'react';
import PropTypes from 'prop-types';
import color from 'color';
import ObservableName from './ObservableName';
import ObservableAxis from './ObservableAxis';
import ObservableAxisArrow from './ObservableAxisArrow';
import ObservableProgress from './ObservableProgress';
import ObservableError from './ObservableError';
import ObservableCompleted from './ObservableCompleted';
import ObservableValues from './ObservableValues';

const axisStrokeWidth = 2;

export default class Observable extends Component {
  static propTypes = {
    observableIndex: PropTypes.number.isRequired,
    name: PropTypes.shape({
      text: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      style: PropTypes.object
    }),
    translateY: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    marginLeft: PropTypes.number.isRequired,
    shouldRenderAxis: PropTypes.bool.isRequired,
    axisWidth: PropTypes.number.isRequired,
    progressWidth: PropTypes.number.isRequired,
    mainColor: PropTypes.string.isRequired,
    arrowWidth: PropTypes.number.isRequired,
    shapeOuterSize: PropTypes.number.isRequired,
    shapeStrokeWidth: PropTypes.number.isRequired,
    scale: PropTypes.func.isRequired,
    observable: PropTypes.any.isRequired,
    animate: PropTypes.bool.isRequired,
    allTooltips: PropTypes.array.isRequired,
    onErrorMouseEnter: PropTypes.func.isRequired,
    onErrorMouseLeave: PropTypes.func.isRequired,
    onValueMouseEnter: PropTypes.func.isRequired,
    onValueMouseLeave: PropTypes.func.isRequired
  };

  renderName() {
    const { name, height } = this.props;

    return <ObservableName name={name} observableHeight={height} />;
  }

  renderAxis(axisStartX, axisStrokeColor) {
    const { shouldRenderAxis } = this.props;

    if (!shouldRenderAxis) {
      return null;
    }

    const { height, axisWidth } = this.props;

    return (
      <ObservableAxis
        startX={axisStartX}
        width={axisWidth}
        y={height / 2}
        strokeWidth={axisStrokeWidth}
        strokeColor={axisStrokeColor}
      />
    );
  }

  renderProgress(axisStartX) {
    const { height, progressWidth, mainColor } = this.props;

    return (
      <ObservableProgress
        startX={axisStartX}
        width={progressWidth}
        y={height / 2}
        strokeWidth={axisStrokeWidth}
        strokeColor={mainColor}
      />
    );
  }

  renderArrow(axisStrokeColor) {
    const {
      height,
      shouldRenderAxis,
      axisWidth,
      mainColor,
      arrowWidth
    } = this.props;

    return (
      <ObservableAxisArrow
        width={arrowWidth}
        axisWidth={axisWidth}
        observableHeight={height}
        color={shouldRenderAxis ? axisStrokeColor : mainColor}
      />
    );
  }

  getStyle = () => {
    const { animate } = this.props;

    return animate
      ? {
          opacity: 0,
          transition: 'opacity .5s ease-in-out'
        }
      : {
          opacity: 1
        };
  };

  animate = element => {
    setTimeout(() => {
      element.style.opacity = 1;
    }, 50); // If it gets smaller, the animation doesn't always work.
  };

  onErrorMouseEnter = () => {
    const { observableIndex, onErrorMouseEnter } = this.props;

    onErrorMouseEnter({ observableIndex });
  };

  onErrorMouseLeave = () => {
    const { observableIndex, onErrorMouseLeave } = this.props;

    onErrorMouseLeave({ observableIndex });
  };

  renderError() {
    const {
      height,
      mainColor,
      shapeOuterSize,
      scale,
      observable,
      animate
    } = this.props;
    const { error } = observable;

    return (
      <ObservableError
        error={error}
        height={height}
        mainColor={mainColor}
        shapeOuterSize={shapeOuterSize}
        scale={scale}
        style={this.getStyle()}
        onRender={animate ? this.animate : null}
        onMouseEnter={this.onErrorMouseEnter}
        onMouseLeave={this.onErrorMouseLeave}
      />
    );
  }

  renderCompleted() {
    const {
      height,
      mainColor,
      shapeOuterSize,
      scale,
      observable,
      animate
    } = this.props;
    const { completed } = observable;

    return (
      <ObservableCompleted
        completed={completed}
        height={height}
        mainColor={mainColor}
        shapeOuterSize={shapeOuterSize}
        scale={scale}
        style={this.getStyle()}
        onRender={animate ? this.animate : null}
      />
    );
  }

  renderValues() {
    const {
      observableIndex,
      height,
      mainColor,
      shapeOuterSize,
      shapeStrokeWidth,
      scale,
      observable,
      animate,
      allTooltips,
      onValueMouseEnter,
      onValueMouseLeave
    } = this.props;
    const { values } = observable;

    return (
      <ObservableValues
        values={values}
        observableIndex={observableIndex}
        height={height}
        mainColor={mainColor}
        shapeOuterSize={shapeOuterSize}
        shapeStrokeWidth={shapeStrokeWidth}
        animate={animate}
        allTooltips={allTooltips}
        scale={scale}
        onValueMouseEnter={onValueMouseEnter}
        onValueMouseLeave={onValueMouseLeave}
      />
    );
  }

  render() {
    const { translateY, marginLeft, scale, observable } = this.props;
    const { startTime, mainColor } = observable;
    const axisStartX = scale(startTime);
    const axisStrokeColor = color(mainColor)
      .alpha(0.2)
      .string();

    return (
      <g transform={`translate(0, ${translateY})`}>
        {this.renderName()}
        <g transform={`translate(${marginLeft}, 0)`}>
          {this.renderAxis(axisStartX, axisStrokeColor)}
          {this.renderProgress(axisStartX)}
          {this.renderArrow(axisStrokeColor)}
          {this.renderCompleted()}
          {this.renderValues()}
          {this.renderError()}
        </g>
      </g>
    );
  }
}
