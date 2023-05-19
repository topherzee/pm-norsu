import * as React from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

// const currentGitBranch = require("current-git-branch");
// const gitBranch = require("git-branch");
import { createMarkup } from "../../utils";

import { fetchRec, fetchRecs } from "../../src/api";

export async function getStaticPaths() {
  console.log("Detail getStaticPaths Start." + new Date().getSeconds());

  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    console.log("Detail getStaticPaths BAILOUT");

    return {
      paths: [],
      fallback: "blocking",
    };
  }

  // const envName = currentGitBranch().replace("env/", "");
  // const envName = currentGitBranch();
  // const envName = gitBranch.sync();
  // const envName = process.env.GIT_BRANCH;
  const envName = "main";

  const posts = await fetchRecs(envName);

  // Get the paths we want to prerender based on posts
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)

  const paths = posts.map((post) => {
    const pathAsArray = post["@metadata"]["@path"].substring(1).split("/");
    return {
      params: { name: pathAsArray },
    };
  });

  // console.log("Detail paths:" + JSON.stringify(paths, null, 2));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log("Detail getStaticProps");

  let props = {};

  const name = params.name;
  const decodedName = decodeURI(name);
  // console.log("details gSP B ", decodedName);
  const decodedName2 = decodedName.replace(",", "/");
  // console.log("details gSP C ", decodedName2);
  props = await fetchRec(decodedName2);
  // console.log("props:" + JSON.stringify(props, null, 2));

  return {
    props,
  };
}

export default function Detail(props) {
  const {
    name,
    description,
    image,
    user,
    type = { name: "default" },
    genres,
    link = "default",
  } = props;

  if (props.error) {
    return "Not found.";
  }

  return (
    <Card>
      <CardMedia component="img" image={image["@link"]} alt={image["@name"]} />

      {/* <img src={image['@link']}
                alt={image['@name']}
                style={{maxHeight: "100px"}}
                /> */}

      <CardContent>
        <Typography gutterBottom variant="h3" component="div">
          {name}
        </Typography>

        <Button
          size="large"
          href={"/mediaTypes/Types/" + type["@metadata"]?.["@name"]}
        >
          {type.name}
        </Button>

        <Typography></Typography>

        {genres.map((genre, index) => {
          return (
            <Button
              size="large"
              href={"/genres/Genres/" + genre["@metadata"]?.["@name"]}
              key={index}
            >
              {genre.name}
            </Button>
          );
        })}

        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          dangerouslySetInnerHTML={{ __html: description }}
        ></Typography>

        <Typography>-</Typography>

        <Typography>Recommended by {user}</Typography>
      </CardContent>

      <CardActions>
        <Button size="large" variant="contained" href={link} target="_blank">
          Check it out
        </Button>
      </CardActions>
    </Card>
  );
}
