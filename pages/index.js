import { Component } from 'react';
import Layout from '../components/Layout';
import Controls from '../components/Controls';
import Editor from '../components/Editor';
import Output from '../components/Output';
import codeExamples from '../lib/code-examples';
import { getObservableFromCode } from '../lib/observable-from-code';

export default class extends Component {
  constructor(props) {
    super();

    const { exampleId } = props.url.query;
    const { code, timeWindow } = codeExamples[exampleId];

    this.state = {
      exampleId,
      code,
      timeWindowInputValue: timeWindow / 1000,
      vizTimeWindow: timeWindow,
      timeWindowInputValueBeforeChange: null,
      error: null,
      observable$: null,
      svg: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url.query.exampleId !== this.props.url.query.exampleId) {
      const { exampleId } = nextProps.url.query;
      const { code, timeWindow } = codeExamples[exampleId];

      this.setState({
        exampleId,
        code,
        timeWindowInputValue: timeWindow / 1000,
        vizTimeWindow: timeWindow,
        error: null,
        observable$: null,
        svg: null
      });
    }
  }

  onTimeWindowInputValueFocus = () => {
    this.setState(state => ({
      timeWindowInputValueBeforeChange: state.timeWindowInputValue
    }));
  };

  onTimeWindowInputValueChange = timeWindowInputValue => {
    this.setState({
      timeWindowInputValue
    });
  };

  onTimeWindowInputValueBlur = () => {
    const { timeWindowInputValue } = this.state;

    if (timeWindowInputValue === null) {
      this.setState(state => ({
        timeWindowInputValue: state.timeWindowInputValueBeforeChange
      }));
    }
  };

  onCodeChange = newCode => {
    this.setState({
      code: newCode,
      error: null
    });
  };

  onVisualize = () => {
    const {
      code,
      timeWindowInputValue,
      timeWindowInputValueBeforeChange
    } = this.state;
    const { error, observable$ } = getObservableFromCode(code);
    const newTimeWindowInputValue = timeWindowInputValue === null
      ? timeWindowInputValueBeforeChange
      : timeWindowInputValue;

    if (typeof error === 'string') {
      this.setState({
        error,
        timeWindowInputValue: newTimeWindowInputValue
      });
    } else {
      this.setState({
        observable$,
        timeWindowInputValue: newTimeWindowInputValue,
        vizTimeWindow: newTimeWindowInputValue * 1000,
        svg: null
      });
    }
  };

  onSvgStable = svg => {
    this.setState({
      svg
    });
  };

  render() {
    const {
      exampleId,
      code,
      timeWindowInputValue,
      vizTimeWindow,
      error,
      observable$,
      svg
    } = this.state;

    return (
      <Layout sidebarActiveItemId={exampleId}>
        <main className="main">
          <Controls
            timeWindow={timeWindowInputValue}
            onTimeWindowFocus={this.onTimeWindowInputValueFocus}
            onTimeWindowChange={this.onTimeWindowInputValueChange}
            onTimeWindowBlur={this.onTimeWindowInputValueBlur}
            svg={svg}
            onVisualize={this.onVisualize}
          />
          <div className="editor-and-output">
            <Editor
              value={code}
              onChange={this.onCodeChange}
              onCmdEnter={this.onVisualize}
            />
            <Output
              timeWindow={vizTimeWindow}
              observable$={observable$}
              error={error}
              onSvgStable={this.onSvgStable}
            />
          </div>
        </main>
        <style jsx>{`
          .main {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0; /* https://stackoverflow.com/q/44192057/247243 */
          }
          .editor-and-output {
            display: flex;
            flex-grow: 1;
            min-width: 0; /* https://stackoverflow.com/q/44192057/247243 */
          }
        `}</style>
      </Layout>
    );
  }
}
