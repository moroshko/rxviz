import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Connector extends PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
    y2: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  };

  render() {
    const { x, y1, y2, color } = this.props;

    return (
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3,3"
      />
    );
  }
}
