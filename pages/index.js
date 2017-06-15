import { Component } from 'react';
import Layout from '../components/Layout';
import Controls from '../components/Controls';
import Editor from '../components/Editor';
import Output from '../components/Output';
import codeExamples from '../lib/code-examples';
import { getObservableFromCode } from '../lib/observable-from-code';
// import { createSnippet, getSnippet } from '../api/snippets';

export default class extends Component {
  /*
  static async getInitialProps({ query }) {
    const { snippetId } = query;

    //  snippetId will:
    //    - exist in pages like /v/A38l6Ogy
    //    - be undefined in pages like /examples/

    return snippetId
      ? getSnippet(snippetId).catch(() => ({
          error: "Couldn't load code snippet"
        }))
      : Promise.resolve({});
  }
  */

  constructor(props) {
    super();

    const { exampleId, code, timeWindow } = this.getCodeParams(props);

    this.state = {
      exampleId,
      code,
      timeWindowInputValue: timeWindow / 1000,
      vizTimeWindow: timeWindow,
      timeWindowInputValueBeforeChange: null,
      error: null,
      observable$: null,
      svg: null,
      lastSnippetId: null
    };
  }

  getCodeParams(props) {
    if (props.code && props.timeWindow) {
      return {
        exampleId: 'custom',
        code: props.code,
        timeWindow: props.timeWindow
      };
    }

    let { exampleId } = props.url.query;

    if (!exampleId || !codeExamples[exampleId]) {
      exampleId = 'basic-interval';
    }

    const { code, timeWindow } = codeExamples[exampleId];

    return {
      exampleId,
      code,
      timeWindow
    };
  }

  componentWillReceiveProps(nextProps) {
    const { exampleId, code, timeWindow } = this.getCodeParams(nextProps);

    if (
      exampleId !== this.props.url.query.exampleId ||
      code !== this.props.url.query.code ||
      timeWindow !== this.props.url.query.timeWindow
    ) {
      this.setState(() => ({
        exampleId,
        code,
        timeWindowInputValue: timeWindow / 1000,
        vizTimeWindow: timeWindow,
        error: null,
        observable$: null,
        svg: null,
        lastSnippetId: null
      }));
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
      timeWindowInputValueBeforeChange /*,
      lastSnippetId*/
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
      const vizTimeWindow = newTimeWindowInputValue * 1000;

      this.setState({
        observable$,
        timeWindowInputValue: newTimeWindowInputValue,
        vizTimeWindow,
        svg: null
      });

      /*
      createSnippet({
        code,
        timeWindow: vizTimeWindow,
        snippetIdToDelete: lastSnippetId
      })
        .then(({ id }) => {
          this.setState({
            lastSnippetId: id
          });

          // Router.push(`/?snippetId=${id}`, `/v/${id}`);
        })
        .catch(() => {
          // TODO
        });
      */
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
      svg,
      lastSnippetId
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
            lastSnippetId={lastSnippetId}
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
