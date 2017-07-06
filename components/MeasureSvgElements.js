import { Component } from 'react';
import isUndefined from 'lodash.isundefined';

const divStyle = {
  width: 0,
  height: 0,
  overflow: 'hidden'
};

export default class MeasureSvgElements extends Component {
  svg = null;

  prevDimensions = null;

  storeSvgReference = svg => {
    if (svg !== null) {
      this.svg = svg;
    }
  };

  dimensionsChanged(dimensions) {
    if (
      this.prevDimensions === null ||
      dimensions.length !== this.prevDimensions.length
    ) {
      return true;
    }

    for (let i = 0, len = dimensions.length; i < len; i++) {
      if (
        dimensions[i].width !== this.prevDimensions[i].width ||
        dimensions[i].height !== this.prevDimensions[i].height
      ) {
        return true;
      }
    }

    return false;
  }

  measure() {
    if (this.svg === null) {
      return;
    }

    const childElements = Array.from(this.svg.children);
    const dimensions = childElements
      .map(element => element.getBoundingClientRect())
      .map(({ width, height }) => ({ width, height }));

    if (!this.dimensionsChanged(dimensions)) {
      return;
    }

    this.prevDimensions = dimensions;

    this.props.onChange(dimensions);
  }

  componentDidMount() {
    this.measure();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  componentDidUpdate() {
    this.measure();
  }

  render() {
    const { children } = this.props;

    if (
      isUndefined(children) ||
      (Array.isArray(children) && children.length === 0)
    ) {
      return null;
    }

    return (
      <div style={divStyle}>
        {/* See: https://stackoverflow.com/q/44883800/247243 */}
        <svg width="1" height="1" ref={this.storeSvgReference}>
          {children}
        </svg>
      </div>
    );
  }
}
