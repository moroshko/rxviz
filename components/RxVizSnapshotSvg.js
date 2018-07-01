import { Component } from 'react';
import PropTypes from 'prop-types';
import isUndefined from 'lodash.isundefined';
import { scaleLinear } from 'd3-scale';
import Observable from './Observable';
import Connector from './Connector';
import Tooltip from './Tooltip';
import { getTooltipsModels, getSvgDimensions } from '../lib/tooltips';

const nameMarginRight = 5;
const arrowWidth = 10;
const shapeStrokeWidth = 2;
const tooltipArrowHeight = 8;
const tooltipArrowDistance = 4;
const tooltipPaddingTop = 10;
const tooltipPaddingRight = 20;
const tooltipPaddingBottom = 10;
const tooltipPaddingLeft = 20;

const svgStyle = {
  display: 'block',
  fontSize: 14,
  fontFamily: 'Arial, sans-serif',
  dominantBaseline: 'central',
  textAnchor: 'middle',
  cursor: 'default',
  userSelect: 'none'
};

const tooltipsContainerStyle = {
  textAnchor: 'start',
  dominantBaseline: 'text-before-edge'
};

export default class RxVizSnapshotSvg extends Component {
  static propTypes = {
    name: PropTypes.shape({
      text: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      style: PropTypes.object
    }),
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    countsHeight: PropTypes.number.isRequired,
    timeWindow: PropTypes.number.isRequired,
    timeProgressed: PropTypes.number,
    shapeSize: PropTypes.number.isRequired,
    observables: PropTypes.array.isRequired,
    connectors: PropTypes.array.isRequired,
    allTooltips: PropTypes.array.isRequired,
    tooltips: PropTypes.array.isRequired,
    tooltipsDimensions: PropTypes.array,
    animate: PropTypes.bool.isRequired,
    onSvgRender: PropTypes.func.isRequired,
    onErrorMouseEnter: PropTypes.func.isRequired,
    onErrorMouseLeave: PropTypes.func.isRequired,
    onValueMouseEnter: PropTypes.func.isRequired,
    onValueMouseLeave: PropTypes.func.isRequired
  };

  onSvgRender = svg => {
    if (svg !== null) {
      this.props.onSvgRender(svg);
    }
  };

  shouldComponentUpdate(nextProps) {
    return this.tooltipsDimensionsAreReady(nextProps);
  }

  tooltipsDimensionsAreReady({ tooltips, tooltipsDimensions }) {
    return (
      tooltips.length === 0 ||
      (tooltipsDimensions !== null &&
        tooltipsDimensions.length === tooltips.length)
    );
  }

  renderConnectors(marginLeft, scale) {
    const { height, countsHeight, connectors } = this.props;

    return connectors.map((connector, index) => {
      const { time, fromIndex, toIndex, color } = connector;
      const x = marginLeft + scale(time);

      return (
        <Connector
          x={x}
          y1={countsHeight + height * (fromIndex + 0.5)}
          y2={countsHeight + height * (toIndex + 0.5)}
          color={color}
          key={index}
        />
      );
    });
  }

  renderObservables(marginLeft, scale, axisWidth) {
    const {
      name,
      height,
      countsHeight,
      timeWindow,
      timeProgressed,
      shapeSize,
      observables,
      allTooltips,
      animate,
      onErrorMouseEnter,
      onErrorMouseLeave,
      onValueMouseEnter,
      onValueMouseLeave
    } = this.props;
    const timeProgressedExists = !isUndefined(timeProgressed);

    return observables.map((observable, observableIndex) => {
      const { mainColor } = observable;
      const observableEnded = !isUndefined(observable.endTime);
      const shouldRenderAxis = timeProgressedExists || observableEnded;
      const endTime = observableEnded ? observable.endTime : timeProgressed;
      const progressWidth = shouldRenderAxis
        ? (axisWidth * endTime) / timeWindow
        : axisWidth;

      return (
        <Observable
          observableIndex={observableIndex}
          name={observableIndex === 0 ? name : null}
          translateY={countsHeight + observableIndex * height}
          height={height}
          marginLeft={marginLeft}
          shouldRenderAxis={shouldRenderAxis}
          axisWidth={axisWidth}
          progressWidth={progressWidth}
          mainColor={mainColor}
          arrowWidth={arrowWidth}
          shapeOuterSize={shapeSize}
          shapeStrokeWidth={shapeStrokeWidth}
          scale={scale}
          observable={observable}
          animate={animate}
          allTooltips={allTooltips}
          onErrorMouseEnter={onErrorMouseEnter}
          onErrorMouseLeave={onErrorMouseLeave}
          onValueMouseEnter={onValueMouseEnter}
          onValueMouseLeave={onValueMouseLeave}
          key={observableIndex}
        />
      );
    });
  }

  renderTooltips(tooltipsModels) {
    const { animate } = this.props;

    return (
      <g style={tooltipsContainerStyle}>
        {tooltipsModels.map(
          (
            { x, y, width, height, text, textStyle, backgroundColor },
            index
          ) => (
            <Tooltip
              arrowHeight={tooltipArrowHeight}
              rectX={x}
              rectY={y}
              rectWidth={width}
              rectHeight={height}
              text={text}
              textStyle={textStyle}
              textPaddingTop={tooltipPaddingTop}
              textPaddingLeft={tooltipPaddingLeft}
              backgroundColor={backgroundColor}
              animate={animate}
              key={index}
            />
          )
        )}
      </g>
    );
  }

  onTooltipsDimensionsChange = tooltipsDimensions => {
    this.setState({
      tooltipsDimensions
    });
  };

  render() {
    if (!this.tooltipsDimensionsAreReady(this.props)) {
      return null;
    }

    const {
      name,
      width,
      height,
      countsHeight,
      timeWindow,
      shapeSize,
      observables,
      tooltips,
      tooltipsDimensions
    } = this.props;

    const outerNameWidth = (name ? name.width : 0) + nameMarginRight;
    // `vizMarginLeft` is used to make sure that, if value appears on the left
    // edge of the axis, it will be fully visible, and won't overlap with the name.
    const vizMarginLeft = (shapeSize + shapeStrokeWidth) / 2;
    const marginLeft = vizMarginLeft + outerNameWidth;
    const axisWidth = width - marginLeft - arrowWidth;
    const scale = scaleLinear()
      .domain([0, timeWindow])
      .range([0, axisWidth]);
    const tooltipsModels = getTooltipsModels({
      tooltips,
      dimensions: tooltipsDimensions,
      scale,
      marginLeft,
      countsHeight,
      observableHeight: height,
      shapeSize,
      arrowHeight: tooltipArrowHeight,
      arrowDistance: tooltipArrowDistance,
      paddingTop: tooltipPaddingTop,
      paddingRight: tooltipPaddingRight,
      paddingBottom: tooltipPaddingBottom,
      paddingLeft: tooltipPaddingLeft
    });
    const svgDimensions = getSvgDimensions({
      svgWidthWithoutTooltips: width,
      svgHeightWithoutTooltips: countsHeight + observables.length * height,
      tooltipsModels
    });

    return (
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        style={svgStyle}
        ref={this.onSvgRender}
      >
        {this.renderConnectors(marginLeft, scale)}
        {this.renderObservables(marginLeft, scale, axisWidth)}
        {this.renderTooltips(tooltipsModels)}
      </svg>
    );
  }
}
