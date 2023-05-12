import React from "react";
import { Controller } from "react-hook-form";
import Rating from "@mui/material/Rating";

export const RatingComponent = ({ name, control, label }) => {
    return (
        <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value }
                }) => (
                    <div>
                        <Rating
                            onChange={onChange}
                            value={value ? value : 0}
                            label={label}
                            precision={0.5}
                        />
                    </div>
                )}
            />
        </div>
    );
};
