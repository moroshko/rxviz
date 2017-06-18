import { Component } from 'react';
import { getObservableFromCode } from '../lib/observable-from-code';
import RxViz from '../components/RxViz';

export default class extends Component {
  constructor() {
    super();

    this.state = {
      timeWindow: null,
      observable$: null
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessageFromOutput);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessageFromOutput);
  }

  sendMessageToOutput(data) {
    this.outputWindow.postMessage(data, this.output);
  }

  handleMessageFromOutput = ({ data, origin, source }) => {
    this.output = origin;
    this.outputWindow = source;

    switch (data.type) {
      case 'clear':
        this.setState({
          timeWindow: null,
          observable$: null
        });
        break;

      case 'visualize': {
        const { timeWindow, code } = data.vizParams;
        const { error, observable$ } = getObservableFromCode(code);

        if (error) {
          this.sendMessageToOutput({ type: 'error', error });
        } else {
          this.sendMessageToOutput({ type: 'success' });

          this.setState({
            timeWindow,
            observable$
          });
        }
        break;
      }
    }
  };

  onSvgStable = svg => {
    this.sendMessageToOutput({ type: 'svg-ready', svg });
  };

  render() {
    const { timeWindow, observable$ } = this.state;

    if (!timeWindow || !observable$) {
      return null;
    }

    return (
      <div className="visualization">
        <RxViz
          timeWindow={timeWindow}
          observable$={observable$}
          onSvgStable={this.onSvgStable}
        />
        <style jsx>{`
          .visualization {
            padding: 30px 25px 30px 15px;
          }
        `}</style>
      </div>
    );
  }
}
