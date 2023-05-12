import React from "react";

const PageTeaser = (props) => (
  <>
    <h3>Page Teaser: {props.targetPage["name"]}</h3>
    <p>{props.text || "-"}</p>
    <a className="PageLink" href={props.targetPage["@link"]}>
      Go to Page
    </a>
  </>
);

export default PageTeaser;
