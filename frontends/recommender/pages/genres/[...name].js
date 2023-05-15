import * as React from "react";
import { Typography } from "@mui/material";
import ReviewGrid from "../../templates/components/ReviewGrid";

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

const fetchAllGenres = async () => {
  console.log("fetchALLGenres");
  const url = `${defaultBaseUrl}/delivery/genres/v1/`;
  console.log(url);
  const response = await fetch(url, H);
  const json = await response.json();

  console.log("fetchAllGenres ****** json:" + JSON.stringify(json, null, 2));

  return json.results;
};

const fetchGenre = async (name) => {
  console.log("fetchGenre path:" + name);
  const url = `${defaultBaseUrl}/delivery/genres/v1/${name}`;
  //const url = `${defaultBaseUrl}/delivery/genres/v1/Science-Fiction`;
  console.log("genre: " + url);
  const response = await fetch(url, H);
  const json = await response.json();
  return json;
};

const fetchRecommendations = async (genre) => {
  console.log("fetchRecommendations path:" + genre);
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/?genres=${genre["@metadata"]["@id"]}`;
  console.log("fetchRecommendations url:" + url);
  const response = await fetch(url, H);
  const json = await response.json();
  return json.results;
};

export async function getStaticPaths() {
  const posts = await fetchAllGenres();

  // const paths = posts.map((post) => ({
  //   params: { name: ["genres", post["@name"]] },
  // }));

  console.log("gSPaths Genres A");
  const paths = posts.map((post) => {
    const pathAsArray = post["@metadata"]["@path"].substring(1).split("/");
    return {
      params: { name: pathAsArray },
    };
  });
  console.log("gSPaths Genres B");

  //console.log("paths:" + JSON.stringify(paths,null,2))

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  let props = {};

  const name = params.name;
  const decodedName = decodeURI(name);
  const decodedName2 = decodedName.replace(",", "/");
  props.genre = await fetchGenre(decodedName2);
  props.results = await fetchRecommendations(props.genre);

  return {
    props,
  };
}

export default function Genre({ genre, results }) {
  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        align="left"
        color="text.primary"
        gutterBottom
      >
        {genre && genre.name}
      </Typography>
      {results && results.length > 0 ? (
        <ReviewGrid recommendations={results} />
      ) : (
        "There are no recommendations in this genre."
      )}
    </>
  );
}
