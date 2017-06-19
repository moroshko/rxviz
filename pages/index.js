import { Component } from 'react';
import Error from 'next/error';
import Layout from '../components/Layout';
import Controls from '../components/Controls';
import Editor from '../components/Editor';
import Output from '../components/Output';
import codeExamples from '../lib/code-examples';
import { createSnippet, getSnippet } from '../api/snippets';

export default class extends Component {
  static async getInitialProps({ query, res }) {
    const { snippetId } = query;

    //  snippetId will:
    //    - exist in pages like /v/A38l6Ogy
    //    - be undefined in pages like /examples/

    return snippetId
      ? getSnippet(snippetId).catch(() => {
          // on the client, res will be undefined
          if (res) {
            res.statusCode = 404;
          }

          return {
            error: "Couldn't load code snippet"
          };
        })
      : Promise.resolve({});
  }

  constructor(props) {
    super();

    const { error, exampleId, code, timeWindow } = this.getCodeParams(props);

    this.state = {
      error,
      exampleId,
      code,
      timeWindowInputValue: timeWindow / 1000,
      timeWindowInputValueBeforeChange: null,
      vizParams: null,
      svg: null,
      snippetCreationFailed: false,
      lastSnippetId: null
    };
  }

  getCodeParams(props) {
    if (props.code && props.timeWindow) {
      // came from /v/hashid
      return {
        exampleId: 'custom',
        code: props.code,
        timeWindow: props.timeWindow
      };
    }

    let { exampleId } = props.url.query;

    if (!exampleId) {
      return {
        error: 'Unknown page'
      };
    }

    if (!codeExamples[exampleId]) {
      return {
        error: 'Unknown example'
      };
    }

    const { code, timeWindow } = codeExamples[exampleId];

    return {
      exampleId,
      code,
      timeWindow
    };
  }

  componentWillReceiveProps(nextProps) {
    const { error, exampleId, code, timeWindow } = this.getCodeParams(
      nextProps
    );

    if (
      error !== this.props.error ||
      exampleId !== this.props.url.query.exampleId
    ) {
      this.setState(() => ({
        error,
        exampleId,
        code,
        timeWindowInputValue: timeWindow / 1000,
        vizParams: null,
        svg: null,
        snippetCreationFailed: false,
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
    const newTimeWindowInputValue = timeWindowInputValue === null
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

  onSvgStable = svg => {
    this.setState({
      svg
    });
  };

  render() {
    const { error } = this.state;

    if (error) {
      return <Error statusCode={404} />;
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
            min-width: 0; /* https://stackoverflow.com/q/44192057/247243 */
          }
        `}</style>
      </Layout>
    );
  }
}
