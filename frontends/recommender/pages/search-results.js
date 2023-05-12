import * as React from "react";
import { setURLSearchParams } from "../utils";
import { Typography } from "@mui/material";
import ReviewGrid from "../templates/components/ReviewGrid";

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

export async function getServerSideProps(context) {
  let props = {};

  const term = context.query.q;
  var url = setURLSearchParams(
    `${defaultBaseUrl}/delivery/recommendations/v1`,
    `q=${term}`
  );

  const response = await fetch(url, H);
  const json = await response.json();
  props.results = json.results;
  props.term = term;

  return {
    props,
  };
}

export default function BasicGrid({ results, term }) {
  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        align="left"
        color="text.primary"
        gutterBottom
      >
        Search Results
      </Typography>
      {results && results.length > 0 ? (
        <ReviewGrid recommendations={results} />
      ) : (
        "No matching recommendations found for " + term
      )}
    </>
  );
}
