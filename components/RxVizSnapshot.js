import { Component } from 'react';
import PropTypes from 'prop-types';
import MeasureSvgElements from './MeasureSvgElements';
import TooltipText from './TooltipText';
import RxVizSnapshotSvg from './RxVizSnapshotSvg';
import { getModel } from '../lib/data-parser';
import {
  extractTooltips,
  getTooltipsToShow,
  addTooltip,
  removeTooltip
} from '../lib/tooltips';

const countsHeight = 11;
const defaultShapeSize = 30;

const defaultTooltipTextStyle = {
  fontSize: 12,
  fontFamily: 'Arial, sans-serif',
  fill: '#fff'
};

export default class RxVizSnapshot extends Component {
  static propTypes = {
    name: PropTypes.shape({
      text: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      style: PropTypes.object
    }),
    width: PropTypes.number.isRequired,
    height: PropTypes.number,
    timeWindow: PropTypes.number.isRequired,
    timeProgressed: PropTypes.number,
    shapeSize: PropTypes.number,
    data: PropTypes.shape({
      type: PropTypes.oneOf(['observable']).isRequired,
      values: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape({
            time: PropTypes.number.isRequired,
            text: PropTypes.string,
            textStyle: PropTypes.object,
            color: PropTypes.string,
            error: PropTypes.any,
            completed: PropTypes.bool
          }),
          PropTypes.shape({
            time: PropTypes.number.isRequired,
            type: PropTypes.oneOf(['observable']).isRequired,
            values: PropTypes.array.isRequired
          })
        ])
      ).isRequired
    }).isRequired,
    renderer: PropTypes.func,
    inheritMainColor: PropTypes.bool,
    mergeThreshold: PropTypes.number,
    animate: PropTypes.bool,
    onSvgRender: PropTypes.func
  };

  static defaultProps = {
    height: defaultShapeSize + 2 * countsHeight,
    shapeSize: defaultShapeSize,
    inheritMainColor: true,
    animate: false
  };

  constructor(props) {
    super();

    const { data, renderer, inheritMainColor, mergeThreshold } = props;
    const { observables, connectors } = getModel({
      data,
      renderer,
      inheritMainColor,
      mergeThreshold
    });
    const allTooltips = extractTooltips(observables, defaultTooltipTextStyle);
    const tooltips = getTooltipsToShow([], allTooltips);

    this.state = {
      observables,
      connectors,
      allTooltips,
      ...this.updateTooltips(tooltips),
      tooltipsDimensions: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState(state => {
        const { data, renderer, inheritMainColor, mergeThreshold } = nextProps;
        const { observables, connectors } = getModel({
          data,
          renderer,
          inheritMainColor,
          mergeThreshold
        });
        const allTooltips = extractTooltips(
          observables,
          defaultTooltipTextStyle
        );
        const newTooltips = getTooltipsToShow(state.tooltips, allTooltips);

        return {
          observables,
          connectors,
          allTooltips,
          ...this.updateTooltips(newTooltips)
        };
      });
    }
  }

  getElementsToMeasure(tooltips) {
    return tooltips.map(({ text, textStyle }, tooltipIndex) => (
      <TooltipText text={text} textStyle={textStyle} key={tooltipIndex} />
    ));
  }

  onSvgRender = svg => {
    const { onSvgRender } = this.props;

    onSvgRender && onSvgRender(svg);
  };

  onTooltipsDimensionsChange = tooltipsDimensions => {
    this.setState({
      tooltipsDimensions
    });
  };

  updateTooltips(tooltips) {
    const elementsToMeasure = this.getElementsToMeasure(tooltips);

    return {
      tooltips,
      elementsToMeasure
    };
  }

  onErrorMouseEnter = ({ observableIndex }) => {
    this.setState(state => {
      const { tooltips, allTooltips } = state;
      const newTooltips = addTooltip(
        observableIndex,
        'error',
        tooltips,
        allTooltips
      );

      return this.updateTooltips(newTooltips);
    });
  };

  onErrorMouseLeave = ({ observableIndex }) => {
    this.setState(state => {
      const { tooltips } = state;
      const newTooltips = removeTooltip(observableIndex, 'error', tooltips);

      return this.updateTooltips(newTooltips);
    });
  };

  onValueMouseEnter = ({ observableIndex, valueIndex }) => {
    this.setState(state => {
      const { tooltips, allTooltips } = state;
      const newTooltips = addTooltip(
        observableIndex,
        valueIndex,
        tooltips,
        allTooltips
      );

      return this.updateTooltips(newTooltips);
    });
  };

  onValueMouseLeave = ({ observableIndex, valueIndex }) => {
    this.setState(state => {
      const { tooltips } = state;
      const newTooltips = removeTooltip(observableIndex, valueIndex, tooltips);

      return this.updateTooltips(newTooltips);
    });
  };

  render() {
    const {
      name,
      width,
      height,
      timeWindow,
      timeProgressed,
      shapeSize,
      animate
    } = this.props;
    const {
      observables,
      connectors,
      allTooltips,
      tooltips,
      elementsToMeasure,
      tooltipsDimensions
    } = this.state;

    return (
      <div>
        <MeasureSvgElements onChange={this.onTooltipsDimensionsChange}>
          {elementsToMeasure}
        </MeasureSvgElements>
        <RxVizSnapshotSvg
          name={name}
          width={width}
          height={height}
          countsHeight={countsHeight}
          timeWindow={timeWindow}
          timeProgressed={timeProgressed}
          shapeSize={shapeSize}
          observables={observables}
          connectors={connectors}
          allTooltips={allTooltips}
          tooltips={tooltips}
          tooltipsDimensions={tooltipsDimensions}
          animate={animate}
          onSvgRender={this.onSvgRender}
          onErrorMouseEnter={this.onErrorMouseEnter}
          onErrorMouseLeave={this.onErrorMouseLeave}
          onValueMouseEnter={this.onValueMouseEnter}
          onValueMouseLeave={this.onValueMouseLeave}
        />
      </div>
    );
  }
}
