import * as React from "react";
import { Typography } from "@mui/material";
import ReviewGrid from "../../templates/components/ReviewGrid";

import {
  fetchMediaType,
  fetchRecsForMediaType,
  fetchAllMediaTypes,
  fetchAllRecs,
} from "../../src/api";

export async function getStaticPaths() {
  console.log("MediaTypes getStaticPaths Start." + new Date().getSeconds());

  const posts = await fetchAllMediaTypes();

  var paths = posts.map((post) => ({
    params: { name: ["Types", post["@metadata"]["@name"]] },
  }));

  paths.push({ params: { name: ["all"] } });

  console.log("paths:" + JSON.stringify(paths, null, 2));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  let props = {};
  // console.log("mediaTypes - params:" + JSON.stringify(params, null, 2));

  const name = params.name;
  const decodedName = decodeURI(name);
  const decodedName2 = decodedName.replace(",", "/");

  // console.log("mediaTypes - decodedName2: " + decodedName2);

  if (decodedName2 === "all") {
    props.mediaType = { name: "Latest" };
    props.results = await fetchAllRecs();
  } else {
    props.mediaType = await fetchMediaType(decodedName2);
    props.results = await fetchRecsForMediaType(
      props.mediaType?.["@metadata"]["@id"]
    );
  }

  console.log("mediaType:", props.mediaType);

  return {
    props,
  };
}

export default function MediaType({ mediaType, results }) {
  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        align="left"
        color="text.primary"
        gutterBottom
      >
        {mediaType && mediaType.name}
      </Typography>

      {results && results.length > 0 ? (
        <ReviewGrid recommendations={results} />
      ) : (
        "There are no recommendations in this mediaType."
      )}
    </>
  );
}
