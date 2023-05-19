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

import { fetchAllMediaTypes } from "../../src/api";

export async function getStaticProps(context) {
  let props = {};

  props.results = fetchAllMediaTypes();

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
                      <Button
                        size="small"
                        href={`/mediaTypes${item["@metadata"]["@path"]}`}
                      >
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
