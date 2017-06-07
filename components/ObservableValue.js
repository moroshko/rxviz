import { Component } from 'react';
import PropTypes from 'prop-types';
import areObjectsSame from '../lib/are-objects-same';

const countStyle = {
  fontSize: 10,
  dominantBaseline: 'text-after-edge'
};

export default class ObservableValue extends Component {
  static propTypes = {
    observableIndex: PropTypes.number.isRequired,
    valueIndex: PropTypes.number.isRequired,
    centerX: PropTypes.number.isRequired,
    centerY: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeColor: PropTypes.string.isRequired,
    fillColor: PropTypes.string.isRequired,
    text: PropTypes.string,
    textStyle: PropTypes.object,
    count: PropTypes.number,
    animate: PropTypes.bool.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
  };

  storeContainerReference = container => {
    if (container !== null) {
      this.container = container;
    }
  };

  maybeAnimate() {
    const { animate } = this.props;

    if (!animate) {
      return;
    }

    setTimeout(() => {
      const { centerX, centerY } = this.props;

      this.container.style.transform = `translate(${centerX}px, ${centerY}px) scale(1)`;
    }, 50); // If it gets smaller, the animation doesn't always work.
  }

  componentDidMount() {
    this.maybeAnimate();
  }

  shouldComponentUpdate(nextProps) {
    return !areObjectsSame(nextProps, this.props, ['textStyle']);
  }

  componentDidUpdate() {
    // When RxViz's width changes, and ObservableValue is rerendered,
    // we need to animate to scale(1).
    this.maybeAnimate();
  }

  onMouseEnter = () => {
    const { observableIndex, valueIndex, onMouseEnter } = this.props;

    onMouseEnter({ observableIndex, valueIndex });
  };

  onMouseLeave = () => {
    const { observableIndex, valueIndex, onMouseLeave } = this.props;

    onMouseLeave({ observableIndex, valueIndex });
  };

  renderCircle({ fillColor, onMouseEnter, onMouseLeave }) {
    const { size, strokeWidth, strokeColor } = this.props;

    return (
      <circle
        cx={0}
        cy={0}
        r={size / 2}
        strokeWidth={strokeWidth}
        stroke={strokeColor}
        fill={fillColor}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  }

  renderShape() {
    const { fillColor } = this.props;

    return this.renderCircle({ fillColor });
  }

  renderHoverShape() {
    const { onMouseEnter, onMouseLeave } = this.props;

    if (!onMouseEnter || !onMouseLeave) {
      return null;
    }

    return this.renderCircle({
      fillColor: 'transparent',
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    });
  }

  renderText() {
    const { text } = this.props;

    if (!text) {
      return null;
    }

    const { textStyle } = this.props;

    return (
      <text x={0} y={0} style={textStyle}>
        {text}
      </text>
    );
  }

  renderCount() {
    const { count } = this.props;

    if (!count || count === 1) {
      return null;
    }

    const { size } = this.props;

    return (
      <text x={0} y={-size / 2 - 3} style={countStyle}>
        {`×${count}`}
      </text>
    );
  }

  render() {
    const { centerX, centerY, animate } = this.props;
    const style = animate
      ? {
          transform: `translate(${centerX}px, ${centerY}px) scale(0)`,
          transition: 'transform .5s ease-in-out'
        }
      : {
          transform: `translate(${centerX}px, ${centerY}px)`
        };

    return (
      <g ref={this.storeContainerReference} style={style}>
        {this.renderShape()}
        {this.renderText()}
        {this.renderCount()}
        {this.renderHoverShape()}
      </g>
    );
  }
}
