import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isPlainObject from 'lodash.isplainobject';

export default class ObservableName extends PureComponent {
  static propTypes = {
    name: PropTypes.shape({
      text: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      style: PropTypes.object
    }),
    observableHeight: PropTypes.number.isRequired
  };

  render() {
    const { name } = this.props;

    if (!isPlainObject(name)) {
      return null;
    }

    const { observableHeight } = this.props;
    const { width, style, text } = name;

    return (
      <g transform={`translate(${width}, ${observableHeight / 2})`}>
        <text
          style={{
            dominantBaseline: 'middle',
            textAnchor: 'end',
            ...(style || {})
          }}
        >
          {text}
        </text>
      </g>
    );
  }
}
