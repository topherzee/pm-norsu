import * as React from "react";
import { Typography } from "@mui/material";
import ReviewGrid from "../../templates/components/ReviewGrid";

import { fetchGenre, fetchRecsForGenre, fetchAllGenres } from "../../src/api";

export async function getStaticPaths() {
  const posts = await fetchAllGenres();

  const paths = posts.map((post) => {
    const pathAsArray = post["@metadata"]["@path"].substring(1).split("/");
    return {
      params: { name: pathAsArray },
    };
  });
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
  props.results = await fetchRecsForGenre(props.genre);

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
