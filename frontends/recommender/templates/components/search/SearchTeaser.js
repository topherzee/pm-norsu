import * as React from 'react';
import { Typography, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';

export default function SearchTeaser({ item }) {
    return (
        <Card>
            <CardMedia
                component="img"
                height="220"
                image={item.image['@link']}
                alt={item.image['@name']}
            />
            <CardContent>
                <Typography gutterBottom variant="h4" component="div">
                    {item.name}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={createMarkup(item.description)} /> */}
            
                <Typography  variant="h6">
                    {item.type.name}
                </Typography>

                <Typography component="div">
                {item.genres && item.genres.map((genre, index) => {
                        return (
                          <div key={index}>
                              {genre.name}
                          </div>
                        )}
                )}
                </Typography>

                <Typography>
                    -
                </Typography>

                <Typography>
                    Recommended by {item.user}
                </Typography>
               
            </CardContent>
            <CardActions>
                <Button size="small" variant="contained" href={`/details${item['@path']}`}>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
}
