import React, { useState, useEffect } from "react";
import styles from "./Secrets.module.css";
import { useNavigate } from "react-router-dom";
import { Button, Container, Box } from "@mui/material";
import Cookies from "js-cookie";
import Loading from "./Loading";

function Secrets() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let token = Cookies.get("auth");
    if (!token) {
      navigate("/");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  function handleLogout() {
    Cookies.remove("auth");
    navigate("/");
  }

  if (isLoading) return <Loading />;

  return (
    <div>
      <Container maxWidth="sm" className="centerIt">
        <Box textAlign="center">
          <h1 className={styles.text}>
            Це сторінка тільки для зареєстрованих користувачів! Тут є багато
            секретів :)
          </h1>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Secrets;
