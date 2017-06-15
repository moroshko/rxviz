import { Component } from 'react';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs/Observable';
import RxViz from './RxViz';

export default class extends Component {
  static propTypes = {
    timeWindow: PropTypes.number.isRequired,
    observable$: PropTypes.instanceOf(Observable),
    error: PropTypes.string,
    onSvgStable: PropTypes.func.isRequired
  };

  renderError() {
    const { error } = this.props;

    return (
      <div className="error">
        {error}
        <style jsx>{`
          .error {
            font-family: 'Roboto Mono', monospace;
            color: #eb121f;
            padding: 9px 30px;
          }
        `}</style>
      </div>
    );
  }

  renderVisualization() {
    const { timeWindow, observable$, onSvgStable } = this.props;

    return (
      <div className="visualization">
        <RxViz
          timeWindow={timeWindow}
          observable$={observable$}
          onSvgStable={onSvgStable}
        />
        <style jsx>{`
          .visualization {
            padding: 30px 25px 30px 15px;
          }
        `}</style>
      </div>
    );
  }

  render() {
    const { error, observable$ } = this.props;

    return (
      <div className="output">
        <div className="content">
          {error
            ? this.renderError()
            : observable$ ? this.renderVisualization() : null}
        </div>
        <style jsx>{`
          .output {
            display: flex;
            flex: 1 0 50%;
            min-width: 0; /* https://stackoverflow.com/q/44192057/247243 */
            background-color: #fff;
          }
          .content {
            flex-grow: 1;
            margin-bottom: 37px;
            overflow-y: auto;
          }
        `}</style>
      </div>
    );
  }
}
