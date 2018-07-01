import { Component } from 'react';
import PropTypes from 'prop-types';

export default class TooltipText extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    text: PropTypes.string.isRequired,
    textStyle: PropTypes.object
  };

  static defaultProps = {
    x: 0,
    y: 0
  };

  renderLine = (line, lineIndex) => {
    const { x, y } = this.props;

    return (
      <tspan x={x} dy={lineIndex === 0 ? y : '1.2em'} key={lineIndex}>
        {line}
      </tspan>
    );
  };

  render() {
    const { text, textStyle } = this.props;
    const lines = text.split('\n');
    const style = {
      /* Temporarily needed for Firefox. See: https://stackoverflow.com/a/44744392/247243 */
      dominantBaseline: 'text-before-edge',
      ...textStyle
    };

    return <text style={style}>{lines.map(this.renderLine)}</text>;
  }
}
