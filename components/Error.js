import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs';
import Link from 'next/link';
import Layout from './Layout';
import RxViz from './RxViz';

const delay = 1000;
const getVizParams = word => {
  const letters = word.split('');

  return {
    observable$: Rx.Observable.interval(delay).map(i => letters[i]),
    timeWindow: (letters.length + 1) * delay,
    width: 360
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
          header: "This page doesn't exist."
        };

      default:
        return {
          vizWord: 'SORRY',
          header: 'Something went wrong.'
        };
    }
  }

  render() {
    const { vizWord, header } = this.getMessageDetails();
    const { observable$, timeWindow, width } = getVizParams(vizWord);

    return (
      <Layout renderSidebar={false}>
        <div className="container">
          <div style={{ width, height: 63 }}>
            <RxViz timeWindow={timeWindow} observable$={observable$} />
          </div>
          <div className="inner-container">
            <h2 className="header">
              {header}
            </h2>
            <div className="instructions">
              Here are some pages you might want to visit instead:
              <ul>
                <li>
                  <Link prefetch as="/" href="/?exampleId=basic-interval">
                    <a>
                      Rx Visualizer home page
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/moroshko/rxviz">
                    <a>
                      Rx Visualizer on GitHub
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            color: #000;
          }
          .inner-container {
            margin-left: 15px;
          }
          .header {
            font-size: 18px;
          }
          .instructions {
            margin-top: 30px;
          }
          ul {
            padding: 0;
            list-style-type: none;
          }
          li {
            padding-bottom: 10px;
          }
        `}</style>
      </Layout>
    );
  }
}
