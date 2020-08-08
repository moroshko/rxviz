import PropTypes from 'prop-types';
import Link from 'next/link';

const renderItem = ({ text, isActive }) => (
  <a className={isActive ? 'active' : null}>
    {text}
    <style jsx>{`
      a {
        padding: 12px 25px;
        display: block;
        color: #eeeff0;
        text-decoration: none;
        cursor: default;
        opacity: 0.6;
        transition: opacity 0.1s linear;
      }
      a:hover {
        background-color: #2c3038;
      }
      a[href] {
        cursor: pointer;
      }
      .active {
        padding-left: 22px;
        border-left: 3px solid #e0168f;
        background-color: #2c3038;
        opacity: 1;
      }
    `}</style>
  </a>
);

const SidebarItem = ({ text, isActive, href, as }) =>
  isActive ? (
    renderItem({ text, isActive })
  ) : (
    <Link as={as} href={href}>
      {renderItem({ text, isActive })}
    </Link>
  );

SidebarItem.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  href: PropTypes.string.isRequired,
  as: PropTypes.string
};

export default SidebarItem;
