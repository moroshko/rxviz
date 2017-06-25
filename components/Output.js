import { Component } from 'react';
import PropTypes from 'prop-types';

export default class extends Component {
  static propTypes = {
    vizParams: PropTypes.shape({
      timeWindow: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired
    }),
    onSvgStable: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      error: null
    };
  }

  componentDidMount() {
    this.sandbox = `${location.origin}/sandbox`;

    window.addEventListener('message', this.handleMessageFromSandbox);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessageFromSandbox);
  }

  componentWillReceiveProps(nextProps) {
    const { vizParams } = nextProps;

    if (vizParams !== this.props.vizParams) {
      if (vizParams === null) {
        this.sendMessageToSandbox({
          type: 'clear'
        });
      } else {
        this.sendMessageToSandbox({
          type: 'visualize',
          vizParams
        });
      }
    }
  }

  renderError() {
    const { error } = this.state;

    return (
      <div className="error">
        {error}
        <style jsx>{`
          .error {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            font-family: 'Roboto Mono', monospace;
            background-color: #fff;
            color: #eb121f;
            padding: 9px 30px;
          }
        `}</style>
      </div>
    );
  }

  sendMessageToSandbox(data) {
    this.sandboxWindow.postMessage(data, this.sandbox);
  }

  handleMessageFromSandbox = ({ data }) => {
    switch (data.type) {
      case 'success':
        this.setState({
          error: null
        });
        break;

      case 'error':
        this.setState({
          error: data.error
        });
        break;

      case 'svg-ready':
        this.props.onSvgStable(data.svg);
        break;
    }
  };

  saveSandboxWindow = iframe => {
    if (iframe !== null) {
      this.sandboxWindow = iframe.contentWindow;
    }
  };

  render() {
    const { error } = this.state;

    return (
      <div className="output">
        <div className="content">
          <iframe
            src="/sandbox"
            sandbox="allow-scripts allow-same-origin"
            ref={this.saveSandboxWindow}
          />
          {error ? this.renderError() : null}
        </div>
        <style jsx>{`
          .output {
            display: flex;
            flex: 1 0 50%;
            min-width: 0; /* https://stackoverflow.com/q/44192057/247243 */
            background-color: #fff;
          }
          .content {
            display: flex;
            flex-grow: 1;
            overflow-y: auto;
            position: relative;
            /* Needed for error, which is positioned absolutely */
          }
          iframe {
            width: 100%;
            border: 0;
          }
        `}</style>
      </div>
    );
  }
}
