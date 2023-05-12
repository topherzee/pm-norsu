import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAPIBase, getLanguages, getCurrentLanguage, changeLanguage } from '../helpers/AppHelpers';

function renderLanguages() {
  const currentLanguage = getCurrentLanguage();

  return null;

  // Languages not yet supported on SaaS.

  // return (
  //   <div className="languages">
  //     {getLanguages().map((lang) => (
  //       <span key={`lang-${lang}`} data-active={currentLanguage === lang} onClick={() => changeLanguage(lang)}>
  //         {lang}
  //       </span>
  //     ))}
  //   </div>
  // );
}

function Navigation() {
  const [navItems, setNavItems] = React.useState([]);

  React.useEffect(() => {
    async function fetchNav() {
      const apiBase = getAPIBase();

      const baseUrl = apiBase + process.env.REACT_APP_MGNL_API_NAV + process.env.REACT_APP_MGNL_APP_BASE;
      const url = `${baseUrl}?subid_token=${process.env.REACT_APP_MGNL_SUB_ID}`;
      const subUrl = `${baseUrl}@nodes?subid_token=${process.env.REACT_APP_MGNL_SUB_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      const subRes = await fetch(subUrl);
      const childNodesData = await subRes.json();
      // JCR returns an array, but Norsu returns object with more info
      const childNodes = childNodesData.results ? childNodesData.results : childNodesData;
      setNavItems([data, ...childNodes]);
    }

    if (navItems.length < 1) {
      fetchNav();
    }
  }, [navItems]);

  return navItems ? (
    <nav className="Navigation">
      {navItems.map((item) => {
        return (
          <NavLink
            activeClassName="active"
            key={item['@id']}
            to={item['@path'].replace(process.env.REACT_APP_MGNL_APP_BASE, '')}
          >
            {item.navigationTitle || item.title || item['@name']}
          </NavLink>
        );
      })}
      {renderLanguages()}
    </nav>
  ) : (
    <div />
  );
}

export default Navigation;