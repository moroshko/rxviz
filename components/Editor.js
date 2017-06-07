import { Component } from 'react';
import PropTypes from 'prop-types';
import codeMirrorStyles from '../css/codemirror';
import monokaiStyles from '../css/monokai';

export default class extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onCmdEnter: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { value, onCmdEnter } = this.props;
    const codemirror = require('codemirror');

    // This fails on the server with: `navigator` is not defined
    require('codemirror/mode/javascript/javascript');

    // Without the `setTimeout`, there is a weird effect when navigating
    // from /feedback to /examples/*
    setTimeout(() => {
      this.codeMirror = codemirror(this.container, {
        mode: 'javascript',
        tabSize: 2,
        lineNumbers: true,
        showCursorWhenSelecting: true,
        theme: 'monokai',
        extraKeys: {
          'Cmd-Enter': onCmdEnter
        }
      });

      this.codeMirror.on('change', this.onChange);
      this.codeMirror.setValue(value);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.codeMirror.getValue()) {
      this.codeMirror.setValue(nextProps.value);
    }
  }

  onChange = (instance, changeObj) => {
    if (changeObj.origin !== 'setValue') {
      this.props.onChange(instance.getValue());
    }
  };

  storeContainer = container => {
    if (container !== null) {
      this.container = container;
    }
  };

  render() {
    return (
      <div className="editor" ref={this.storeContainer}>
        <style jsx>{`
          .editor {
            flex: 1 0 50%;
            overflow: auto;
            background-color: #282c34;
            padding-top: 6px;
          }
        `}</style>
        <style jsx global>{`${codeMirrorStyles}\n${monokaiStyles}`}</style>
      </div>
    );
  }
}
