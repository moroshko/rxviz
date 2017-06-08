import PropTypes from 'prop-types';
import Link from 'next/link';

const SidebarLink = ({ text, isActive, href, as }) =>
  <Link prefetch as={as} href={href}>
    <a className={isActive ? 'active' : null}>
      {text}
      <style jsx>{`
        a {
          padding: 12px 25px;
          display: block;
          color: #eeeff0;
          text-decoration: none;
          opacity: 0.6;
          transition: opacity .1s linear;
        }

        a:hover {
          background-color: #2c3038;
        }

        .active {
          padding-left: 22px;
          border-left: 3px solid #e0168f;
          background-color: #2c3038;
          opacity: 1;
        }
      `}</style>
    </a>
  </Link>;

SidebarLink.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  href: PropTypes.string.isRequired,
  as: PropTypes.string
};

export default SidebarLink;
