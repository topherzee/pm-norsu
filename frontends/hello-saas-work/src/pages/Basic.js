import React from "react";
import { EditableArea } from "@magnolia/react-editor";

const Basic = (props) => {
  const { main, extras, title } = props;

  return (
    <div className="Basic">
      <h1>{title || props.metadata["@name"]}</h1>

      <main>{main && <EditableArea className="Area" content={main} />}</main>

      <div className="Extras">
        {extras && <EditableArea className="Area" content={extras} />}
        {/* <button>Contact</button> */}
      </div>
    </div>
  );
};

export default Basic;
