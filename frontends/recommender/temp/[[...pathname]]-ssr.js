import React, { useState, useEffect } from "react";
import * as ReactDOMServer from "react-dom/server";

import { EditablePage } from "@magnolia/react-editor";
import Basic from "../templates/pages/Basic";
import ReviewGrid from "../templates/components/ReviewGrid";
import MediaTypeData from "../templates/components/mediaType/MediaTypeData";
import MediaTypeList from "../templates/components/mediaType/MediaTypeList";
import RecommendationData from "../templates/components/recommendation/RecommendationData";
import Latest from "../templates/components/Latest";
import Hero from "../templates/components/Hero";
import { render } from "react-dom";

const nodeName = "/recommend";
const config = {
  componentMappings: {
    "recommend-lm:pages/basic": Basic,
    "recommend-lm:components/reviewgrid": ReviewGrid,
    "recommend-lm:components/mediaType/data": MediaTypeData,
    "recommend-lm:components/mediaType/list": MediaTypeList,
    "recommend-lm:components/recommendation/data": RecommendationData,
    "recommend-lm:components/hero": Hero,
    "recommend-lm:components/latest": Latest,
  },
};

// Use different defaultBaseUrl to point to public instances
const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const pagesApi = defaultBaseUrl + "/delivery/pages/v1";
const templateAnnotationsApi =
  defaultBaseUrl + "/environments/main" + "/template-annotations/v1";

const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

export async function getServerSideProps(context) {
  console.log("Main page. gSSP Start. " + new Date().getSeconds());
  const isPagesApp = context.query?.mgnlPreview || null;
  let props = {
    isPagesApp,
    isPagesAppEdit: isPagesApp === "false",
    pagePath:
      nodeName + context.resolvedUrl.replace(new RegExp(".*" + nodeName), ""), // Find out page path to fetch from Magnolia
  };
  global.mgnlInPageEditor = props.isPagesAppEdit;

  // Fetching page content
  const url = pagesApi + props.pagePath;
  console.log("page: " + url);
  const pagesRes = await fetch(url, H);
  props.page = await pagesRes.json();

  console.log("Main page. gSSP End." + new Date().getSeconds());

  return {
    props,
  };
}

export default function Pathname(props) {
  const [templateAnnotations, setTemplateAnnotations] = useState();
  const { isPagesApp, isPagesAppEdit, page, pagePath } = props;

  // Fetch template annotations only inside Magnolia WYSIWYG
  useEffect(() => {
    async function fetchTemplateAnnotations() {
      //const url = templateAnnotationsApi + pagePath + "&subid_token=" + SUB_ID
      //const url = "https://delivery-preview.saas.magnolia-cloud.com/environments/main/template-annotations/v1/recommend2/dev1" //&subid_token=td8tdv78a6qyzt6p"
      // FAILS const url = "https://delivery-preview.saas.magnolia-cloud.com/environments/main/template-annotations/v1/recommend2/dev1?subid_token=td8tdv78a6qyzt6p"
      // FAILS const url = "https://delivery-preview.saas.magnolia-cloud.com/environments/main/template-annotations/v1/recommend2/dev1" //&subid_token=td8tdv78a6qyzt6p"

      var url =
        "https://author-" +
        SUB_ID +
        ".saas.magnolia-cloud.com/.rest/environments/main/template-annotations/v1" +
        pagePath;
      url = url.split("?")[0] + "?STUFFF";

      console.log("templataes URL: " + url);
      const templateAnnotationsRes = await fetch(url, H);
      // const templateAnnotationsRes = await fetch(url);
      const templateAnnotationsJson = await templateAnnotationsRes.json();

      setTemplateAnnotations(templateAnnotationsJson);
    }

    if (isPagesApp) fetchTemplateAnnotations();
  }, [isPagesApp, pagePath]);

  const shouldRenderEditablePage =
    page && (isPagesApp ? templateAnnotations : true);

  // In Pages app wait for template annotations before rendering EditablePage
  return (
    <>
      {/* {props.element} */}

      {shouldRenderEditablePage && (
        <EditablePage
          content={page}
          config={config}
          templateAnnotations={templateAnnotations}
        />
      )}
    </>
  );
}
