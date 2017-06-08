import Link from 'next/link';

export default () =>
  <footer className="container">
    <Link href="https://zeit.co">
      <a className="zeit-link">
        Hosted by ▲ZEIT OSS
      </a>
    </Link>
    <style jsx>{`
      .container {
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 10px 25px;
      }

      .zeit-link {
        font-size: 12px;
        color: #000;
        opacity: 0.2;
        transition: opacity .1s linear;
        text-decoration: none;
      }

      .zeit-link:hover {
        opacity: 1;
      }
    `}</style>
  </footer>;
