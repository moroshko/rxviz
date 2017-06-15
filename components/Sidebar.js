import { Component } from 'react';
import PropTypes from 'prop-types';
import codeExamples from '../lib/code-examples';
import SidebarItem from './SidebarItem';

export default class extends Component {
  static propTypes = {
    activeItemId: PropTypes.string
  };

  scrollToActiveItem = activeItem => {
    if (activeItem !== null) {
      activeItem.scrollIntoView();
    }
  };

  render() {
    const { activeItemId } = this.props;
    const exampleIds = Object.keys(codeExamples);

    return (
      <nav className="container">
        <h3 className="header">Examples</h3>
        <ul className="examples-container">
          {exampleIds.map(exampleId => {
            const isActive = exampleId === activeItemId;
            const { name } = codeExamples[exampleId];

            return (
              <li
                className={`example ${exampleId}`}
                ref={isActive ? this.scrollToActiveItem : null}
                key={exampleId}
              >
                <SidebarItem
                  text={name}
                  isActive={isActive}
                  href={`/?exampleId=${exampleId}`}
                  as={`/examples/${exampleId}`}
                />
              </li>
            );
          })}
        </ul>
        <SidebarItem
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
  }
}
