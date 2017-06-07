import { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import omit from 'lodash.omit';

export default class extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['large', 'small']).isRequired,
    htmlType: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.element.isRequired,
    smallIconOffset: PropTypes.number,
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
    copyToClipboardText: PropTypes.string,
    copyToClipboardOnCopy: PropTypes.func
  };

  static defaultProps = {
    disabled: false
  };

  renderWithCopyToClipboard() {
    const { copyToClipboardText, copyToClipboardOnCopy } = this.props;

    return (
      <CopyToClipboard
        text={copyToClipboardText}
        onCopy={copyToClipboardOnCopy}
      >
        {this.renderButton()}
      </CopyToClipboard>
    );
  }

  renderButton() {
    const {
      type,
      size,
      htmlType,
      disabled,
      smallIconOffset,
      text,
      style
    } = this.props;
    const iconStyle = size === 'small' && smallIconOffset
      ? {
          transform: `translate(${smallIconOffset})`
        }
      : {};
    const icon = cloneElement(this.props.icon, iconStyle);

    return (
      <button
        className={`${type} ${size}`}
        type={htmlType}
        disabled={disabled}
        style={size === 'large' ? style : omit(style, 'width')}
      >
        {icon}
        {size === 'large' ? <span>{text}</span> : null}
        <style jsx>{`
          button {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            border: 0;
            font-size: 14px;
            color: #eeeff0;
            padding: 0 15px;
            opacity: 0.85;
            transition: transform .1s linear, opacity .1s linear;
          }

          button:hover {
            opacity: 1;
          }

          button:focus {
            outline: 0;
          }

          button:active {
            transform: scale(0.95);
          }

          button:disabled {
            opacity: 0.6;
          }

          span {
            margin-left: 5px;
          }

          .primary {
            background-color: #e0168f;
          }

          .secondary {
            background-color: #4b5262;
          }

          .small {
            padding: 0 13px;
            border-radius: 20px;
          }
        `}</style>
      </button>
    );
  }

  render() {
    const { copyToClipboardText } = this.props;

    return copyToClipboardText
      ? this.renderWithCopyToClipboard()
      : this.renderButton();
  }
}
