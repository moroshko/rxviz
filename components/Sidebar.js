import PropTypes from 'prop-types';
import codeExamples from '../lib/code-examples';
import SidebarLink from './SidebarLink';

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
              <SidebarLink
                text={name}
                isActive={exampleId === activeItemId}
                href={`/?exampleId=${exampleId}`}
                as={`/examples/${exampleId}`}
              />
            </li>
          );
        })}
      </ul>
      <SidebarLink
        text="Feedback"
        isActive={activeItemId === 'feedback'}
        href="/feedback"
      />
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
      `}</style>
    </nav>
  );
};

Sidebar.propTypes = {
  activeItemId: PropTypes.string
};

export default Sidebar;
