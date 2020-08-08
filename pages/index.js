import { Component } from 'react';
import Error from '../components/Error';
import Layout from '../components/Layout';
import Controls from '../components/Controls';
import Editor from '../components/Editor';
import Output from '../components/Output';
import codeExamples from '../lib/code-examples';
import { createSnippet, getSnippet, shareSnippet } from '../api/snippets';

export default class extends Component {
  static async getInitialProps({ query, res }) {
    const { snippetId } = query;

    if (snippetId) {
      // came from /v/hashid
      return getSnippet(snippetId)
        .then(({ code, timeWindow }) => ({
          exampleId: 'custom',
          code,
          timeWindow
        }))
        .catch(() => {
          // on the client, res will be undefined
          if (res) {
            res.statusCode = 404;
          }

          return {
            errorStatusCode: 404
          };
        });
    }

    // came from /examples/exampleId
    let { exampleId } = query;

    if (!exampleId) {
      exampleId = 'basic-interval';
    }

    if (codeExamples[exampleId]) {
      const { code, timeWindow } = codeExamples[exampleId];

      return {
        exampleId,
        code,
        timeWindow
      };
    }

    return {
      errorStatusCode: 404
    };
  }

  constructor(props) {
    super();

    this.state = this.resetState(props);
  }

  resetState(props) {
    return {
      errorStatusCode: props.errorStatusCode,
      exampleId: props.exampleId,
      code: props.code,
      timeWindowInputValue: props.timeWindow / 1000,
      timeWindowInputValueBeforeChange: null,
      vizParams: null,
      svg: null,
      snippetCreationFailed: false,
      lastSnippetId: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { errorStatusCode, exampleId, code, timeWindow } = nextProps;

    if (
      errorStatusCode !== this.props.errorStatusCode ||
      exampleId !== this.props.exampleId ||
      code !== this.props.code ||
      timeWindow !== this.props.timeWindow
    ) {
      this.setState(this.resetState(nextProps));
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

  onCodeChange = code => {
    this.setState({
      code
    });
  };

  onVisualize = () => {
    const {
      code,
      timeWindowInputValue,
      timeWindowInputValueBeforeChange,
      lastSnippetId
    } = this.state;
    const newTimeWindowInputValue =
      timeWindowInputValue === null
        ? timeWindowInputValueBeforeChange
        : timeWindowInputValue;
    const vizParams = {
      timeWindow: newTimeWindowInputValue * 1000,
      code
    };

    this.setState({
      timeWindowInputValue: newTimeWindowInputValue,
      vizParams,
      svg: null
    });

    createSnippet({
      ...vizParams,
      snippetIdToDelete: lastSnippetId
    })
      .then(({ id }) => {
        this.setState({
          snippetCreationFailed: false,
          lastSnippetId: id
        });
      })
      .catch(() => {
        this.setState({
          snippetCreationFailed: true
        });
      });
  };

  onShare = snippetId => {
    shareSnippet(snippetId);
  };

  onSvgStable = svg => {
    this.setState({
      svg
    });
  };

  render() {
    const { errorStatusCode } = this.state;

    if (errorStatusCode) {
      return <Error statusCode={errorStatusCode} />;
    }

    const {
      exampleId,
      code,
      timeWindowInputValue,
      vizParams,
      svg,
      snippetCreationFailed,
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
            isShareAvailable={!snippetCreationFailed}
            shareId={lastSnippetId}
            onShare={this.onShare}
          />
          <div className="editor-and-output">
            <Editor
              value={code}
              onChange={this.onCodeChange}
              onCmdEnter={this.onVisualize}
            />
            <Output vizParams={vizParams} onSvgStable={this.onSvgStable} />
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
            min-width: 0;
            /* https://stackoverflow.com/q/44192057/247243 */
          }
        `}</style>
      </Layout>
    );
  }
}
