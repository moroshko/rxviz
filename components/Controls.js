import { Component } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import NumericInput from 'react-numeric-input';
import copy from 'copy-to-clipboard';
import Button from './Button';
import timeWindowInputStyles from '../css/timeWindowInput';

const visualizeIcon = (
  <svg width="14" height="14">
    <path fill="#eeeff0" d="M0,0L12,7L0,14Z" />
  </svg>
);

const shareIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path
      fill="#eeeff0"
      d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"
    />
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

const alertIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path
      fill="#eeeff0"
      d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
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
    onVisualize: PropTypes.func.isRequired,
    isShareAvailable: PropTypes.bool.isRequired,
    shareId: PropTypes.string,
    onShare: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      width: null,
      copiedSvg: false,
      shareState: 'ready' // 'shared', 'error'
    };
  }

  onResize = ({ bounds }) => {
    this.setState({
      width: bounds.width
    });
  };

  renderTimeWindowInput() {
    const {
      timeWindow,
      onTimeWindowFocus,
      onTimeWindowChange,
      onTimeWindowBlur
    } = this.props;
    const { width } = this.state;

    return (
      <div>
        <label htmlFor="time-window-input">
          {width > 510 ? 'Time window' : null}
          {width > 730 ? ' (sec)' : null}
        </label>
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
            display: flex;
            align-items: center;
            white-space: nowrap;
          }
        `}</style>
      </div>
    );
  }

  getButtonSize() {
    const { width } = this.state;

    return width >= 650 ? 'large' : 'small';
  }

  renderVisualizeButton() {
    return (
      <Button
        type="primary"
        size={this.getButtonSize()}
        htmlType="submit"
        icon={visualizeIcon}
        smallIconXoffset={2}
        text="Visualize"
        style={{ marginLeft: 15 }}
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
        text={copiedSvg ? 'SVG copied' : 'Copy SVG'}
        style={{ width: 135 }}
        onClick={this.onCopySvg}
      />
    );
  }

  onCopySvg = () => {
    const { svg } = this.props;

    copy(svg);

    this.setState({
      copiedSvg: true
    });

    setTimeout(() => {
      this.setState({
        copiedSvg: false
      });
    }, 3000);
  };

  renderShareButton() {
    const { isShareAvailable, shareId } = this.props;

    if (isShareAvailable && !shareId) {
      return null;
    }

    const { shareState } = this.state;

    return (
      <Button
        type="secondary"
        size={this.getButtonSize()}
        disabled={shareState !== 'ready'}
        icon={
          shareState === 'error'
            ? alertIcon
            : shareState === 'shared'
              ? checkIcon
              : shareIcon
        }
        text={
          shareState === 'error'
            ? 'Failed'
            : shareState === 'shared'
              ? 'Link copied'
              : 'Share link'
        }
        style={{ width: 130, marginLeft: 15 }}
        onClick={this.onShare}
      />
    );
  }

  onShare = () => {
    const { isShareAvailable, shareId, onShare } = this.props;

    if (isShareAvailable) {
      copy(`${location.origin}/v/${shareId}`);
      onShare(shareId);
    }

    this.setState({
      shareState: isShareAvailable ? 'shared' : 'error'
    });

    setTimeout(() => {
      this.setState({
        shareState: 'ready'
      });
    }, 3000);
  };

  onFormSubmit = event => {
    event.preventDefault();

    this.props.onVisualize();
  };

  render() {
    const { width } = this.state;

    return (
      <Measure bounds={true} onResize={this.onResize}>
        {({ measureRef }) => (
          <div
            ref={measureRef}
            style={{ height: 60 /* To avoid a jump from SSR */ }}
          >
            {width === null ? null : (
              <div className="container">
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
                    {this.renderShareButton()}
                  </div>
                </div>
                <style jsx>{`
                  .container {
                    display: flex;
                    flex-shrink: 0;
                  }
                  .inner-container {
                    flex: 1 1 50%;
                  }
                  .second-inner-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 10px 25px 10px 0;
                  }
                `}</style>
                <style jsx global>{`
                  .react-numeric-input b {
                    transition: transform 0.1s linear;
                  }
                  .react-numeric-input i {
                    transition: border-color 0.1s linear;
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
              </div>
            )}
          </div>
        )}
      </Measure>
    );
  }
}
