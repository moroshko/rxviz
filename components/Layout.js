import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';

export default class extends Component {
  static propTypes = {
    title: PropTypes.string,
    renderSidebar: PropTypes.bool,
    sidebarActiveItemId: PropTypes.string,
    children: PropTypes.any
  };

  static defaultProps = {
    renderSidebar: true,
    title: 'Animated playground for Rx Observables'
  };

  render() {
    const { title, renderSidebar, sidebarActiveItemId, children } = this.props;

    return (
      <div className="container">
        <Head>
          <title>RxViz - {title}</title>
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
        <Header />
        <div className="inner-container">
          {renderSidebar
            ? <Sidebar activeItemId={sidebarActiveItemId} />
            : null}
          {children}
        </div>
        <style jsx>{`
          .container {
            height: 100vh;
            position: relative;
            display: flex;
            flex-direction: column;
            font-family: Roboto, sans-serif;
            font-size: 14px;
            background-color: #21252b;
            color: #eeeff0;
          }
          .inner-container {
            display: flex;
            flex-grow: 1;
            min-height: 0; /* Needed for Firefox */
          }
        `}</style>
      </div>
    );
  }
}
