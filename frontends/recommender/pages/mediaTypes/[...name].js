import * as React from "react";
import { Typography } from "@mui/material";
import ReviewGrid from "../../templates/components/ReviewGrid";

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

const fetchAllMediaTypes = async () => {
  const url = `${defaultBaseUrl}/delivery/types/v1/`;
  const response = await fetch(url, H);
  const json = await response.json();

  //console.log("****** json:" + JSON.stringify(json,null,2))

  return json.results;
};

const fetchMediaType = async (name) => {
  console.log("fetchMediaType path:" + name);
  const url = `${defaultBaseUrl}/delivery/types/v1/${name}`;
  //const url = `${defaultBaseUrl}/delivery/types/v1/Science-Fiction`;
  console.log("mediaType: " + url);
  const response = await fetch(url, H);
  const json = await response.json();
  return json;
};

const fetchRecommendations = async (type) => {
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/?type=${type["@id"]}&orderBy=mgnl:created%20desc`;
  // console.log("fetchRecommendations:" + url + "&subid_token=" + SUB_ID);
  const response = await fetch(url, H);
  const json = await response.json();
  return json.results;
};

const fetchAllRecommendations = async () => {
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/?orderBy=mgnl:created%20desc`;
  // console.log("fetchRecommendations:" + url + "&subid_token=" + SUB_ID);
  const response = await fetch(url, H);
  const json = await response.json();
  return json.results;
};

export async function getStaticPaths() {
  const posts = await fetchAllMediaTypes();

  var paths = posts.map((post) => ({
    params: { name: ["Types", post["@name"]] },
  }));

  paths.push({ params: { name: ["all"] } });

  //console.log("paths:" + JSON.stringify(paths, null, 2));

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
    // props.mediaType.name = "All";
    props.results = await fetchAllRecommendations();
  } else {
    props.mediaType = await fetchMediaType(decodedName2);
    props.results = await fetchRecommendations(props.mediaType);
  }

  // console.log("mediaType:" + JSON.stringify(props.mediaType, null, 2));

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
