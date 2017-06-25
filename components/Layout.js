import { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';

let mountCount = 0;

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

  componentDidMount() {
    if (location.host === 'rxviz.com' && ++mountCount === 1) {
      const script = document.createElement('script');

      script.text = `
(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:523182,hjsv:5};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
`;

      document.body.appendChild(script);
    }
  }

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
