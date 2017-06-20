import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs';
import Head from 'next/head';
import RxViz from './RxViz';

const delay = 1000;
const getVizParams = word => {
  const letters = word.split('');

  return {
    observable$: Rx.Observable.interval(delay).map(i => letters[i]),
    timeWindow: (letters.length + 1) * delay,
    width: (letters.length + 1) * 40
  };
};

export default class extends PureComponent {
  static propTypes = {
    statusCode: PropTypes.number
  };

  getMessageDetails() {
    const { statusCode } = this.props;

    switch (statusCode) {
      case 404:
        return {
          vizWord: '404',
          text: "This page doesn't exist."
        };

      default:
        return {
          vizWord: 'SORRY',
          text: 'Something went wrong.'
        };
    }
  }

  render() {
    const { vizWord, text } = this.getMessageDetails();
    const { observable$, timeWindow, width } = getVizParams(vizWord);

    return (
      <div className="container">
        <Head>
          <title>RxViz - Error</title>
          <meta
            name="description"
            content="Visualize any Rx Observable, and export SVG of the marble diagram."
          />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link rel="shortcut icon" href="/static/favicon.png" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono|Montserrat:700"
            rel="stylesheet"
          />
          <style>{`body { margin: 0; }`}</style>
        </Head>
        <div style={{ width, height: 63 }}>
          <RxViz timeWindow={timeWindow} observable$={observable$} />
        </div>
        <div className="text">
          {text}
        </div>
        <style jsx>{`
          .container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Roboto, sans-serif;
            font-size: 14px;
          }
          .text {
            margin-left: 20px;
          }
        `}</style>
      </div>
    );
  }
}
