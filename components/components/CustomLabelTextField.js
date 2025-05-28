import React from "react";
import { Box, IconButton, styled, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CustomTextField = styled(TextField)({
  "& label": {
    color: "white",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "grey",
    },
    "&:hover fieldset": {
      borderColor: "grey",
    },
    "&.Mui-focused fieldset": {
      borderColor: "grey",
    },
  },
  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: "#242424",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#888888",
    WebkitTextFillColor: "#888888",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#b0b0b0",
  },
  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "#aaaaaa",
  },
  input: {
    color: "white",
  },
  textarea: {
    color: "white",
  },
});
const CustomLabelTextField = ({
  type,
  label,
  required,
  className,
  wrapClassName,
  ...rest
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Box className={wrapClassName}>
      <label htmlFor="filled-hidden-label-small" style={{ color: "white" }}>
        {label} <span className="text-red-600">{required ? "*" : ""}</span>
      </label>
      <CustomTextField
        id="filled-hidden-label-small"
        type={showPassword ? "text" : type}
        {...rest}
        className={`mt-0 ${className}`}
        slotProps={
          type === "password"
            ? {
                input: {
                  endAdornment: (
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ color: "white" }} />
                      ) : (
                        <Visibility sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  ),
                },
              }
            : {}
        }
      />
    </Box>
  );
};

export default CustomLabelTextField;
