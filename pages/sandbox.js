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

    this.clearContainer();

    switch (data.type) {
      case 'clear':
        this.setState({
          timeWindow: null,
          observable$: null
        });
        break;

      case 'visualize': {
        const { timeWindow, code } = data.vizParams;
        const { error, observable$ } = getObservableFromCode(code, {
          output: this.container
        });

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

  clearContainer() {
    Array.from(this.container.children).forEach(child => {
      if (child !== this.vizContainer) {
        child.remove();
      }
    });
  }

  onSvgStable = svg => {
    this.sendMessageToOutput({ type: 'svg-ready', svg });
  };

  storeContainer = container => {
    if (container !== null) {
      this.container = container;
    }
  };

  storeVizContainer = vizContainer => {
    if (vizContainer !== null) {
      this.vizContainer = vizContainer;
    }
  };

  render() {
    const { timeWindow, observable$ } = this.state;

    return (
      <div className="container" ref={this.storeContainer}>
        {/* This div is needed so that users could append/prepend to the container. */}
        <div ref={this.storeVizContainer}>
          {timeWindow && observable$ ? (
            <RxViz
              timeWindow={timeWindow}
              observable$={observable$}
              onSvgStable={this.onSvgStable}
            />
          ) : null}
        </div>
        <style jsx>{`
          .container {
            padding: 30px 25px 30px 15px;
          }
        `}</style>
      </div>
    );
  }
}
