import React from "react";

const Activity = (props) => (
  <>
    <h3>Activity</h3>
    <p>{props.text || "-"}</p>
    <img
      className="Image"
      src={props.activity.image["@link"] + "?width=120&height=90"}
      alt="Etiam Purus"
    />
  </>
);

export default Activity;
