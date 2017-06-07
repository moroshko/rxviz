import { Component } from 'react';
import PropTypes from 'prop-types';
import { path as d3Path } from 'd3-path';
import TooltipText from './TooltipText';
import areObjectsSame from '../lib/are-objects-same';

const arrowWidth = 12;
const cornerRadius = 4;

export default class Tooltip extends Component {
  static propTypes = {
    arrowHeight: PropTypes.number.isRequired,
    rectX: PropTypes.number.isRequired,
    rectY: PropTypes.number.isRequired,
    rectWidth: PropTypes.number.isRequired,
    rectHeight: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    textStyle: PropTypes.object.isRequired,
    textPaddingTop: PropTypes.number.isRequired,
    textPaddingLeft: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string,
    animate: PropTypes.bool.isRequired
  };

  static defaultProps = {
    backgroundColor: 'rgba(50, 50, 50, 0.97)'
  };

  shouldComponentUpdate(nextProps) {
    return !areObjectsSame(nextProps, this.props, ['textStyle']);
  }

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
      const { rectX, rectY } = this.props;

      this.container.style.transform = `translate(${rectX}px, ${rectY}px) scale(1)`;
      this.container.style.opacity = 1;
    }); // Without setTimeout, the animation doesn't work.
  }

  componentDidMount() {
    this.maybeAnimate();
  }

  componentDidUpdate() {
    // When RxViz's width changes, and Tooltip is rerendered,
    // we need to animate to scale(1) and opacity(1).
    this.maybeAnimate();
  }

  renderBackground() {
    const { arrowHeight, rectWidth, rectHeight, backgroundColor } = this.props;
    const halfRectWidthWithoutArrow = (rectWidth - arrowWidth) / 2;

    let path = d3Path();

    path.moveTo(0, cornerRadius);
    path.arcTo(0, 0, cornerRadius, 0, cornerRadius);
    path.lineTo(halfRectWidthWithoutArrow, 0);
    path.lineTo(rectWidth / 2, -arrowHeight);
    path.lineTo(halfRectWidthWithoutArrow + arrowWidth, 0);
    path.lineTo(rectWidth - cornerRadius, 0);
    path.arcTo(rectWidth, 0, rectWidth, cornerRadius, cornerRadius);
    path.lineTo(rectWidth, rectHeight - cornerRadius);
    path.arcTo(
      rectWidth,
      rectHeight,
      rectWidth - cornerRadius,
      rectHeight,
      cornerRadius
    );
    path.lineTo(cornerRadius, rectHeight);
    path.arcTo(0, rectHeight, 0, rectHeight - cornerRadius, cornerRadius);
    path.closePath();

    return <path d={path.toString()} fill={backgroundColor} />;
  }

  render() {
    const {
      arrowHeight,
      rectX,
      rectY,
      rectWidth,
      text,
      textStyle,
      textPaddingTop,
      textPaddingLeft,
      animate
    } = this.props;
    const style = animate
      ? {
          transform: `translate(${rectX}px, ${rectY}px) scale(0)`,
          transformOrigin: `${rectWidth / 2}px ${-arrowHeight}px`,
          opacity: 0,
          transition: 'opacity .3s ease-in-out, transform .3s ease-in-out'
        }
      : {
          transform: `translate(${rectX}px, ${rectY}px)`
        };

    return (
      <g ref={this.storeContainerReference} style={style}>
        {this.renderBackground()}
        <TooltipText
          x={textPaddingLeft}
          y={textPaddingTop}
          text={text}
          textStyle={textStyle}
        />
      </g>
    );
  }
}
