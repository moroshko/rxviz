import { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';

export default class extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['large', 'small']).isRequired,
    htmlType: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.element.isRequired,
    smallIconXoffset: PropTypes.number,
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
    onClick: PropTypes.func
  };

  static defaultProps = {
    disabled: false
  };

  render() {
    const {
      type,
      size,
      htmlType,
      disabled,
      smallIconXoffset,
      text,
      style,
      onClick
    } = this.props;
    const iconStyle =
      size === 'small' && smallIconXoffset
        ? {
            transform: `translate(${smallIconXoffset})`
          }
        : {};
    const icon = cloneElement(this.props.icon, iconStyle);

    return (
      <button
        className={`${type} ${size}`}
        type={htmlType}
        disabled={disabled}
        style={size === 'large' ? style : omit(style, 'width')}
        onClick={onClick}
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
            transition: transform 0.1s linear, opacity 0.1s linear;
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
            transform: scale(1);
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
}
