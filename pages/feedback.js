import { useEffect } from 'react';
import Layout from '../components/Layout';

const Feedback = () => {
  let mountCount = 0;

  useEffect(() => {
    if (++mountCount === 1) {
      const script = document.createElement('script');

      script.text = `
!function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");
`;

      document.body.appendChild(script);
    }

    window.Canny('render', {
      boardToken: '45f78b41-d295-f198-d2cb-a59b9fde0d10',
      basePath: '/feedback',
      ssoToken: null
    });
  }, []);

  return (
    <Layout title="Feedback" sidebarActiveItemId="feedback">
      <div className="feedback" data-canny />
      <style jsx>{`
        .feedback {
          flex-grow: 1;
          overflow: auto;
          padding: 20px 30px;
          background-color: #fff;
        }
      `}</style>
    </Layout>
  );
};

export default Feedback;
