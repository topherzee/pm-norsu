import React from 'react';
import config from '../magnolia.config';
import { getAPIBase, getLanguages, removeCurrentLanguage, getCurrentLanguage, getVersion } from './AppHelpers';

import { EditablePage } from '@magnolia/react-editor';
import { EditorContextHelper } from '@magnolia/react-editor';

class PageLoader extends React.Component {
  state = {};

  getPagePath = () => {
    const languages = getLanguages();
    const nodeName = process.env.REACT_APP_MGNL_APP_BASE;
    const currentLanguage = getCurrentLanguage();
    let path = nodeName + window.location.pathname.replace(new RegExp('(.*' + nodeName + '|.html)', 'g'), '');

    if (currentLanguage !== languages[0]) {
      path = removeCurrentLanguage(path, currentLanguage);
      path += '?lang=' + currentLanguage;
    }

    return path;
  };

  loadPage = async (force) => {
    // Bail out if already loaded content.
    if (!force && this.state.pathname === window.location.pathname) return;

    const apiBase = getAPIBase();

    const pagePath = this.getPagePath();
    console.log('pagePath:' + pagePath);

     let fullContentPath = `${apiBase}${process.env.REACT_APP_MGNL_API_PAGES}${pagePath}?subid_token=${process.env.REACT_APP_MGNL_SUB_ID}`;

    const pageResponse = await fetch(fullContentPath);

    const pageJson = await pageResponse.json();
    console.log('page content: ', pageJson);

    const templateId = pageJson['mgnl:template'];
    console.log('templateId:', templateId);

    let templateJson = null;
    //if (EditorContextHelper.inEditorAsync()) {
    if (window.location.search.includes('mgnlPreview')) {
      console.log('apiBase:', apiBase);
      const templateResponse = await fetch(apiBase + process.env.REACT_APP_MGNL_API_ANNOTATIONS + pagePath + '?subid_token=' + process.env.REACT_APP_MGNL_SUB_ID);
      templateJson = await templateResponse.json();
      console.log('annotations: ', templateJson);
    }

    this.setState({
      init: true,
      content: pageJson,
      templateAnnotations: templateJson,
      pathname: window.location.pathname,
    });
  };

  inEditorPreview() {
    const url = window.location.href;
    const inPreview = url.indexOf('mgnlPreview=true') > 0;
    console.log('inEditorPreview:' + inPreview);
    return EditorContextHelper.inEditor() && inPreview;
  }

  componentDidMount() {

    const handler = event => {
      try {
        if (typeof event.data !== "string") {
          return;
        }
        const message = JSON.parse(event.data);
        if (message.action === 'refresh') {
          this.loadPage(true);
        }
      } catch (e) {
        console.error("Failed to parse " + event.data)
      }
    };

    window.addEventListener('message', handler);

    this.loadPage(false);
  }

  componentDidUpdate() {
    this.loadPage();
  }

  render() {
    if (this.state.init) {
      console.log('config:', config);
      //const isDevMode = process.env.NODE_ENV === 'development';
      //console.log("n:" + process.env.NODE_ENV)

      return (
        <EditablePage
          templateAnnotations={this.state.templateAnnotations || {}}
          content={this.state.content}
          config={config}
        ></EditablePage>
      );
    } else {
      return <p>NO PAGE.</p>;
    }
  }
}

export default PageLoader;