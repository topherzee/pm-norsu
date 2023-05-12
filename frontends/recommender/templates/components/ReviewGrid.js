import * as React from 'react';
import { Grid } from '@mui/material';
import SearchTeaser from "./search/SearchTeaser";

export default function ReviewGrid(props) {
  const {recommendations} = props;
  return (
    <Grid container spacing={4}>
      {recommendations && recommendations.map((recommendation, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <SearchTeaser item={recommendation} />
        </Grid>
      ))}
    </Grid>
  );
}
