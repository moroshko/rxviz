import { Component } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import NumericInput from 'react-numeric-input';
import Button from './Button';
import timeWindowInputStyles from '../css/timeWindowInput';

const visualizeIcon = (
  <svg width="14" height="14">
    <path fill="#eeeff0" d="M0,0L12,7L0,14Z" />
  </svg>
);

const copyIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path
      fill="#eeeff0"
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

const checkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path
      fill="#eeeff0"
      d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
    />
  </svg>
);

export default class extends Component {
  static propTypes = {
    timeWindow: PropTypes.number /* Can be null if the input is blank */,
    onTimeWindowFocus: PropTypes.func.isRequired,
    onTimeWindowChange: PropTypes.func.isRequired,
    onTimeWindowBlur: PropTypes.func.isRequired,
    svg: PropTypes.string,
    onVisualize: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      width: null,
      copiedSvg: false
    };
  }

  onResize = ({ bounds }) => {
    this.setState({
      width: bounds.width
    });
  };

  onCopySvg = () => {
    this.setState({
      copiedSvg: true
    });

    setTimeout(() => {
      this.setState({
        copiedSvg: false
      });
    }, 3000);
  };

  renderTimeWindowInput() {
    const {
      timeWindow,
      onTimeWindowFocus,
      onTimeWindowChange,
      onTimeWindowBlur
    } = this.props;

    return (
      <div>
        <label htmlFor="time-window-input">Time window (sec)</label>
        <NumericInput
          id="time-window-input"
          min={1}
          max={300}
          value={timeWindow}
          autoComplete="off"
          onFocus={onTimeWindowFocus}
          onChange={onTimeWindowChange}
          onBlur={onTimeWindowBlur}
          style={timeWindowInputStyles}
        />
        <style jsx>{`
          div {
            white-space: nowrap;
          }
        `}</style>
      </div>
    );
  }

  getButtonSize() {
    const { width } = this.state;

    return width >= 784 ? 'large' : 'small';
  }

  renderVisualizeButton() {
    return (
      <Button
        type="primary"
        size={this.getButtonSize()}
        htmlType="submit"
        icon={visualizeIcon}
        smallIconOffset={2}
        text="Visualize"
        style={{ marginLeft: 30 }}
      />
    );
  }

  renderCopySvgButton() {
    const { svg } = this.props;

    if (!svg) {
      return null;
    }

    const { copiedSvg } = this.state;

    return (
      <Button
        type="secondary"
        size={this.getButtonSize()}
        disabled={copiedSvg}
        icon={copiedSvg ? checkIcon : copyIcon}
        text={copiedSvg ? 'Copied' : 'Copy SVG'}
        style={{ width: 120 }}
        copyToClipboardText={svg}
        copyToClipboardOnCopy={this.onCopySvg}
      />
    );
  }

  onFormSubmit = event => {
    event.preventDefault();

    this.props.onVisualize();
  };

  render() {
    const { width } = this.state;

    return (
      <Measure bounds={true} onResize={this.onResize}>
        {({ measureRef }) =>
          <div ref={measureRef}>
            {width === null
              ? null
              : <div className="container">
                  <div className="inner-container">
                    <form
                      className="second-inner-container"
                      onSubmit={this.onFormSubmit}
                    >
                      {this.renderTimeWindowInput()}
                      {this.renderVisualizeButton()}
                    </form>
                  </div>
                  <div className="inner-container">
                    <div className="second-inner-container">
                      {this.renderCopySvgButton()}
                    </div>
                  </div>
                  <style jsx>{`
                    .container {
                      display: flex;
                      flex-shrink: 0;
                    }
                    .inner-container {
                      flex: 1 0 50%;
                    }
                    .second-inner-container {
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                      padding: 10px 25px 10px 30px;
                    }
                  `}</style>
                  <style jsx global>{`
                    .react-numeric-input b {
                      transition: transform .1s linear;
                    }
                    .react-numeric-input i {
                      transition: border-color .1s linear;
                    }
                    .react-numeric-input b:hover {
                      transform: scale(1.1);
                    }
                    .react-numeric-input b:nth-child(2):hover i {
                      border-bottom-color: #fff !important;
                    }
                    .react-numeric-input b:nth-child(3):hover i {
                      border-top-color: #fff !important;
                    }
                  `}</style>
                </div>}
          </div>}
      </Measure>
    );
  }
}
