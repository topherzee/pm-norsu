import React from "react";
import { FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";

export const InputDropdown = ({ name, control, label, required, options }) => {
  const generateSingleOptions = () => {
    return options?.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Controller
          render={({ field: { onChange, value } }) => (
            <Select
              labelId={`${name}-label`}
              value={value}
              onChange={onChange}
              required={required}
            >
              {generateSingleOptions()}
            </Select>
          )}
          control={control}
          name={name}
        />
      </FormControl>
    </div>
  );
};