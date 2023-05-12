import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

export async function getStaticProps(context) {
  let props = {};

  const url = `${defaultBaseUrl}/delivery/types/v1`;
  const response = await fetch(url, H);
  const json = await response.json();
  props.results = json.results;

  return {
    props,
  };
}

export default function BasicGrid({ results }) {
  return (
    <>
      <h1>Media Types</h1>
      <Box sx={{ flexGrow: 1 }}>
        {results && results.length > 0 ? (
          <Grid container spacing={2}>
            {results.map((item, index) => {
              return (
                <Grid item xs={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" href={`/genres${item["@path"]}`}>
                        See recommendations
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          "Nothing to display."
        )}
      </Box>
    </>
  );
}
