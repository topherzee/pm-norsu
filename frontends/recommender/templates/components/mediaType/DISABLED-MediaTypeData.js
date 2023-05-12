import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CardContent, Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import { mediaTypeByName } from "../../../src/api";

export default function MediaTypeData() {
  const [mediaType, setMediaType] = useState({});
  const { query } = useRouter();
  console.log("MediaTypeData Start." + (new Date()).getSeconds())

  useEffect(() => {
    mediaTypeByName(query.type, setMediaType);
  }, []);
  const mediaTypeLogo = mediaType.icon ? mediaType.icon['@link'] : 'images/default.svg';

  return (
    <>
    M:
      {mediaType.name ? <Card sx={{ maxWidth: 345, textAlign: 'center' }}>
        <CardContent>
          {mediaTypeLogo && <CardMedia>
            <img src={mediaTypeLogo} alt={mediaType.name} style={{ height: 200 }} />
          </CardMedia>
          }
          <Typography gutterBottom variant="h2" component="div">
            {mediaType.name}
          </Typography>
        </CardContent>
      </Card>
        : <div>Media type not found: {query.type}</div>}
    </>
  );
}
