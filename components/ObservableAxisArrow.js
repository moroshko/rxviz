import { PureComponent } from 'react';
import PropTypes from 'prop-types';

const height = 10;

const style = {
  transition: 'fill .2s ease-in-out'
};

export default class ObservableAxisArrow extends PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    axisWidth: PropTypes.number.isRequired,
    observableHeight: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  };

  render() {
    const { axisWidth, observableHeight, width, color } = this.props;

    return (
      <path
        transform={`translate(${axisWidth}, ${(observableHeight - height) /
          2})`}
        d={`M0 0 L${width} ${height / 2} L0 ${height} z`}
        fill={color}
        style={style}
      />
    );
  }
}
