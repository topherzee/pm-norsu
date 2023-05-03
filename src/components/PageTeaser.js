import React from "react";

const PageTeaser = (props) => (
  <>
    <h3>Page Teaser: {props.page.name}</h3>
    <p>{props.text || "-"}</p>
    <a className="PageLink" href={props.page["@link"]} alt="Etiam Purus">
      Go to Page
    </a>
  </>
);

export default PageTeaser;
