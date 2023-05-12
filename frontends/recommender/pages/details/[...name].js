import * as React from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { createMarkup } from "../../utils";

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

const fetchRec = async (name) => {
  console.log("fetchRec path:" + name);
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/${name}`;
  //const url = `${defaultBaseUrl}/delivery/genres/v1/Science-Fiction`;
  console.log("rec: " + url);
  const response = await fetch(url, H);
  const json = await response.json();
  return json;
};

const fetchRecs = async () => {
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/`;
  const response = await fetch(url, H);
  const json = await response.json();

  //console.log("****** json:" + JSON.stringify(json,null,2))

  return json.results;
};

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

  const posts = await fetchRecs();

  // Get the paths we want to prerender based on posts
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)

  // const paths = posts.map((post) => ({
  //   params: { name: [post['@path']] },
  // }))
  const paths = posts.map((post) => ({
    params: { name: ["recommendations", post["@name"]] },
  }));

  //console.log("paths:" + JSON.stringify(paths,null,2))

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
  // return { paths:[], fallback: false }
}

export async function getStaticProps({ params }) {
  // export async function getServerSideProps(context) {

  //const posts = await fetchRecs()

  //console.log("****** posts:" + posts)
  //console.log("posts:" + JSON.stringify(posts,null,2))
  // const paths = posts.map((post) => ({
  //   params: { name: post['@path'] },
  // }))

  let props = {};

  const name = params.name;
  const decodedName = decodeURI(name);
  const decodedName2 = decodedName.replace(",", "/");
  props = await fetchRec(decodedName2);
  // console.log("props:" + JSON.stringify(props, null, 2));

  return {
    props,
  };
}

export default function Detail({
  name,
  description,
  image,
  user,
  type = { name: "default" },
  genres,
  link = "default",
}) {
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

        <Button size="large" href={"/mediaTypes" + type["@path"]}>
          {type.name}
        </Button>

        <Typography></Typography>

        {genres.map((genre, index) => {
          return (
            <Button size="large" href={"/genres" + genre["@path"]} key={index}>
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
