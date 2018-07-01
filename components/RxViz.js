import { Component } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import { Observable } from 'rxjs';
import isFunction from 'lodash.isfunction';
import RxVizSnapshot from './RxVizSnapshot';
import { isTimeout, updateData } from '../lib/data-parser';
import { getEmptyObservableData, getDataStream } from '../lib/data-stream';
import { defaultRenderer } from '../lib/renderers';

export default class RxViz extends Component {
  static propTypes = {
    name: PropTypes.shape({
      text: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      style: PropTypes.object
    }),
    height: PropTypes.number,
    timeWindow: PropTypes.number.isRequired,
    shapeSize: PropTypes.number,
    observable$: PropTypes.instanceOf(Observable).isRequired,
    renderer: PropTypes.func,
    inheritMainColor: PropTypes.bool,
    mergeThreshold: PropTypes.number,
    onSvgStable: PropTypes.func
  };

  static defaultProps = {
    renderer: defaultRenderer,
    mergeThreshold: 100
  };

  state = {
    width: null,
    timeProgressed: 0,
    data: getEmptyObservableData()
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.timeWindow !== this.props.timeWindow ||
      nextProps.observable$ !== this.props.observable$
    ) {
      this.setState({
        timeProgressed: 0,
        data: getEmptyObservableData()
      });

      this.stopAnimation();
      this.startAnimation(nextProps.timeWindow, nextProps.observable$);
    }
  }

  componentDidMount() {
    const { timeWindow, observable$ } = this.props;

    this.startAnimation(timeWindow, observable$);
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  onSvgStable() {
    const { onSvgStable } = this.props;

    if (!isFunction(onSvgStable)) {
      return;
    }

    // `setTimeout` is needed here to make sure that all animations end.
    setTimeout(() => {
      onSvgStable(this.svg.outerHTML);
    }, 700);
  }

  startAnimation(timeWindow, observable$) {
    const data$ = getDataStream({ observable$, timeout: timeWindow });

    this.subscription = data$.subscribe(
      ({ value, path }) => {
        if (isTimeout(value)) {
          this.setState({
            timeProgressed: undefined
          });
          // Make sure that `this.animationStep` is not called again.
          // Otherwise, it would have changed `timeProgressed`.
          cancelAnimationFrame(this.requestId);
          this.onSvgStable();
        } else {
          this.setState(state => ({
            data: updateData(state.data, path, value)
          }));
        }
      },
      // Will be called when observable$ errors
      () => {
        cancelAnimationFrame(this.requestId);
        this.onSvgStable();
      },
      // Will be called when observable$ completes
      () => {
        cancelAnimationFrame(this.requestId);
        this.onSvgStable();
      }
    );

    this.subscriptionTime = performance.now();

    this.requestId = requestAnimationFrame(this.animationStep);
  }

  animationStep = timestamp => {
    this.setState({
      timeProgressed: timestamp - this.subscriptionTime
    });

    this.requestId = requestAnimationFrame(this.animationStep);
  };

  stopAnimation() {
    this.subscription.unsubscribe();
    cancelAnimationFrame(this.requestId);
  }

  onResize = ({ bounds }) => {
    this.setState({
      width: bounds.width
    });
  };

  onSvgRender = svg => {
    this.svg = svg;
  };

  renderSnapshot() {
    const {
      name,
      height,
      timeWindow,
      shapeSize,
      renderer,
      inheritMainColor,
      mergeThreshold
    } = this.props;
    const { width, timeProgressed, data } = this.state;

    return (
      <RxVizSnapshot
        name={name}
        width={width}
        height={height}
        timeWindow={timeWindow}
        timeProgressed={timeProgressed}
        shapeSize={shapeSize}
        data={data}
        renderer={renderer}
        inheritMainColor={inheritMainColor}
        mergeThreshold={mergeThreshold}
        animate={true}
        onSvgRender={this.onSvgRender}
      />
    );
  }

  render() {
    const { width } = this.state;

    return (
      <Measure bounds={true} onResize={this.onResize}>
        {({ measureRef }) => (
          /* This div is needed to measure the available width. */
          <div ref={measureRef}>
            {width === null ? null : this.renderSnapshot()}
          </div>
        )}
      </Measure>
    );
  }
}
