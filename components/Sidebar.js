import PropTypes from 'prop-types';
import Link from 'next/link';
import codeExamples from '../lib/code-examples';

const Sidebar = ({ activeItemId }) => {
  const exampleIds = Object.keys(codeExamples);

  return (
    <nav className="container">
      <h3 className="header">Examples</h3>
      <ul className="examples-container">
        {exampleIds.map(exampleId => {
          const { name } = codeExamples[exampleId];

          return (
            <li className={`example ${exampleId}`} key={exampleId}>
              <Link
                prefetch
                as={`/examples/${exampleId}`}
                href={`/?exampleId=${exampleId}`}
              >
                <a
                  className={`link${exampleId === activeItemId
                    ? ' active'
                    : ''}`}
                >
                  {name}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link prefetch href="/feedback">
        <a
          className={`feature link${activeItemId === 'feedback'
            ? ' active'
            : ''}`}
        >
          Feedback
        </a>
      </Link>
      <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
          }

          .header {
            font-size: 18px;
            padding-left: 25px;
          }

          .examples-container {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            margin-top: 3px;
            padding: 0;
            overflow-y: auto;
          }

          li {
            padding: 0;
          }

          .custom {
            margin-top: 10px;
          }

          .link {
            padding: 12px 25px;
            display: block;
            color: #eeeff0;
            text-decoration: none;
            opacity: 0.6;
            transition: opacity .1s linear;
          }

          .link:hover {
            background-color: #2c3038;
          }

          .active {
            padding-left: 22px;
            border-left: 3px solid #e0168f;
            background-color: #2c3038;
            opacity: 1;
          }

          .feature {

          }
        `}</style>
    </nav>
  );
};

Sidebar.propTypes = {
  activeItemId: PropTypes.string
};

export default Sidebar;
