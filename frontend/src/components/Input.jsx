import React from "react";
import { TextField } from "@mui/material";
import styles from "./Input.module.css";

function Input({ type, label, handleInput, value }) {
  
  function handleChange(e) {
    let inputObj = { value: e.target.value, label };
    handleInput(inputObj);
  }

  return (
    <TextField
      type={type}
      label={label}
      value={value}
      onChange={handleChange}
      className={`${styles.add_margin} ${styles.inputField}`}
    />
  );
}

export default Input;
