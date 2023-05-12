import React from "react";
import { Controller } from "react-hook-form";
import { TextareaAutosize, FormControl, InputLabel } from "@mui/material";

export const InputTextarea = ({ name, control, label, required }) => {
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Controller
          name={name}
          control={control}
          render={({
            field: { onChange, value },
          }) => (
            <TextareaAutosize
              onChange={onChange}
              minRows={10}
              label={label}
              value={value}
              required={required}
            />
          )}
        />
      </FormControl>
    </div>
  );
};
