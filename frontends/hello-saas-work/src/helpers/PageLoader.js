import React from "react";
import config from "../magnolia.config";
import { getAPIBase, getLanguages } from "./AppHelpers";

import { EditablePage } from "@magnolia/react-editor";
import { EditorContextHelper } from "@magnolia/react-editor";

class PageLoader extends React.Component {
  state = {};

  loadPage = async (force) => {
    // Bail out if already loaded content.
    if (!force && this.state.pathname === window.location.pathname) return;

    const apiBase = getAPIBase();
    console.log("apiBase:", apiBase);
    const languages = getLanguages();
    const spaRootNodePath = process.env.REACT_APP_MGNL_APP_BASE;
    const magnoliaContext = EditorContextHelper.getMagnoliaContext(
      window.location.href,
      spaRootNodePath,
      languages
    );
    console.log("magnoliaContext:", magnoliaContext);
    const searchParams = new URLSearchParams({
      subid_token: process.env.REACT_APP_MGNL_SUB_ID,
    });
    if (magnoliaContext.searchParams["lang"]) {
      searchParams.set("lang", magnoliaContext.searchParams["lang"]);
    }
    const relativePageURL = `${magnoliaContext.nodePath}?${searchParams}`;

    const fullContentURL = `${apiBase}${process.env.REACT_APP_MGNL_API_PAGES}${relativePageURL}`;
    const pageResponse = await fetch(fullContentURL);
    const pageJson = await pageResponse.json();
    console.log("page content:", pageJson);

    const templateId = pageJson["mgnl:template"];
    console.log("templateId:", templateId);

    let templateJson = null;
    if (magnoliaContext.isMagnolia) {
      const templateAnnotationURL = `${apiBase}${process.env.REACT_APP_MGNL_API_ANNOTATIONS}${relativePageURL}`;
      const templateResponse = await fetch(templateAnnotationURL);
      templateJson = await templateResponse.json();
      console.log("annotations:", templateJson);
    }

    this.setState({
      init: true,
      content: pageJson,
      templateAnnotations: templateJson,
      pathname: window.location.pathname,
    });
  };

  componentDidMount() {
    const handler = (event) => {
      try {
        if (typeof event.data !== "string") {
          return;
        }
        const message = JSON.parse(event.data);
        if (message.action === "refresh") {
          this.loadPage(true);
        }
      } catch (e) {
        console.error("Failed to parse " + event.data);
      }
    };

    window.addEventListener("message", handler);

    this.loadPage(false);
  }

  componentDidUpdate() {
    this.loadPage();
  }

  render() {
    if (this.state.init) {
      console.log("config:", config);
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
