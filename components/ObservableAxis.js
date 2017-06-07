import { PureComponent } from 'react';
import PropTypes from 'prop-types';

const crispEdgesStyle = {
  shapeRendering: 'crispEdges'
};

export default class ObservableAxis extends PureComponent {
  static propTypes = {
    startX: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeColor: PropTypes.string.isRequired
  };

  render() {
    const { startX, width, y, strokeWidth, strokeColor } = this.props;

    return (
      <line
        x1={startX}
        y1={y}
        x2={width}
        y2={y}
        strokeWidth={strokeWidth}
        stroke={strokeColor}
        style={crispEdgesStyle}
      />
    );
  }
}
