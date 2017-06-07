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
        {error
          ? this.renderError()
          : observable$ ? this.renderVisualization() : null}
        <style jsx>{`
          .output {
            flex: 1 0 50%;
            overflow-y: auto;
            background-color: #fff;
          }
        `}</style>
      </div>
    );
  }
}
