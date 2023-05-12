import React from "react";

const Image = (props) => (
  <img
    className="Image"
    src={props.image["@link"] + "?width=120&height=90"}
    alt="Etiam Purus"
  />
);

export default Image;
