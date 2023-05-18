import React, { useState, useEffect } from "react";

import { languages, getCurrentLanguage, setURLSearchParams } from "../utils";

import { EditablePage } from "@magnolia/react-editor";
import config from "../magnolia.config";

const APP_BASE = process.env.NEXT_PUBLIC_MGNL_APP_BASE;

// Use different defaultBaseUrl to point to public instances
var defaultBaseUrl;
var pagesApi;
var templateAnnotationsApi;

const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

const fetchAllPages = async () => {
  console.log("fetchAllPages", H);
  const publicFetchUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;
  const url = `${publicFetchUrl}/delivery/pagenav/v1${APP_BASE}@nodes`;
  console.log("url", url);
  const response = await fetch(url, H);
  const json = await response.json();
  //console.log("****** json:" , json);
  // json.push({ "@name": "recommend", "@path": "/recommend" });
  // json.push({ "@name": "", "@path": "/recommend" });

  return json.results;
};

//http://localhost:3000/api/preview?slug=/recommend/dev2&mgnlPreview=false&mgnlChannel=desktop
//http://localhost:3000/api/preview?slug=/recommend/dev2
export async function getStaticPaths() {
  console.log("Main page.getStaticPaths() Start. ");
  const posts = await fetchAllPages();
  // console.log("****** json2:" + JSON.stringify(posts, null, 2));

  // Handle both "exact urls"(for in the page editor) and also the urls missing the root page (for in the website).
  const pathsRec = posts.map((post) => ({
    params: { pathname: [APP_BASE.substring(1), post["@name"]] },
  }));
  const pathsRaw = posts.map((post) => ({
    params: { pathname: [post["@name"]] },
  }));
  var paths = pathsRec.concat(pathsRaw);

  paths.push({ params: { pathname: [""] } });
  paths.push({ params: { pathname: [APP_BASE.substring(1)] } });

  // Test simple path.
  // paths = [
  //   {
  //     params: {
  //       pathname: ["recommend"],
  //     },
  //   },
  // ];

  console.log("paths:" + JSON.stringify(paths, null, 2));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  // console.log(
  //   "PREVIEW: " +
  //     context.preview +
  //     "-- " +
  //     (context.preview ? context.previewData.query.slug : "")
  // );
  console.log("getStaticProps. Context:", context);

  if (context.preview) {
    defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;
  } else {
    defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
  }
  pagesApi = defaultBaseUrl + "/delivery/pages/v1";
  templateAnnotationsApi =
    defaultBaseUrl +
    "/environments/main" +
    process.env.NEXT_PUBLIC_MGNL_API_ANNOTATIONS;

  var resolvedUrl = context.preview
    ? context.previewData.query.slug
    : context.params.pathname
    ? "/" + context.params.pathname.join("/")
    : "";
  resolvedUrl = resolvedUrl.replace(new RegExp(".*" + APP_BASE), "");
  console.log("resolvedUrl: ", resolvedUrl);
  const currentLanguage = getCurrentLanguage(resolvedUrl);
  const isDefaultLanguage = currentLanguage === languages[0];
  //const isPagesApp = context.previewData?.query?.mgnlPreview || null;
  const isPagesApp = true;

  let props = {
    isPagesApp,
    isPagesAppEdit: isPagesApp === "false",
    basename: isDefaultLanguage ? "" : "/" + currentLanguage,
  };

  global.mgnlInPageEditor = props.isPagesAppEdit;

  // Find out page path in Magnolia
  let pagePath = context.preview
    ? APP_BASE + resolvedUrl.replace(new RegExp(".*" + APP_BASE), "")
    : APP_BASE + resolvedUrl;

  console.log("pagePath: " + pagePath);

  props.pagePath = pagePath;

  // Fetching page content
  const url = pagesApi + pagePath;
  //setURLSearchParams(pagesApi + pagePath, 'lang=' + currentLanguage)
  console.log("page: ", url, " H:", H);
  const pagesRes = await fetch(url, H);
  console.log("a");
  props.page = await pagesRes.json();
  console.log("b");
  console.log("page content:", JSON.stringify(props.page, null, 2));

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
      console.log("fetchTemplateAnnotations()");

      var previewBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;

      var templateAnnotationsApi =
        previewBaseUrl +
        "/environments/main" +
        process.env.NEXT_PUBLIC_MGNL_API_ANNOTATIONS;

      var url = templateAnnotationsApi + pagePath;

      // TODO Magnoila currentlly does not suppport headers in Browser Calls. CORS errors will resullt.
      url = url + "?subid_token=" + process.env.NEXT_PUBLIC_MGNL_SUB_ID;
      // const templateAnnotationsRes = await fetch(url, H);
      console.log("templates URL: ", url, " H:", H);
      const templateAnnotationsRes = await fetch(url);
      const templateAnnotationsJson = await templateAnnotationsRes.json();

      setTemplateAnnotations(templateAnnotationsJson);
    }

    if (isPagesApp) fetchTemplateAnnotations();
  }, [isPagesApp, pagePath]);

  const shouldRenderEditablePage =
    page && (isPagesApp ? templateAnnotations : true);

  // In Pages app, wait for template annotations before rendering EditablePage
  return (
    <>
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
