import React from "react";
import { Container, Box } from "@mui/material";
import styles from "./Secrets.module.css";

function Loading() {
  return (
    <div>
      <Container maxWidth="sm" className="centerIt">
        <Box textAlign="center">
          <h1 className={styles.text}>Loading...</h1>
        </Box>
      </Container>
    </div>
  );
}

export default Loading;
