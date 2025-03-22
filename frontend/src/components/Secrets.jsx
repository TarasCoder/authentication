import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Secrets.module.css";
import { useNavigate } from "react-router-dom";
import { Button, Container, Box, ButtonGroup } from "@mui/material";
import Cookies from "js-cookie";
import Loading from "./Loading";


function Secrets() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [userSecret, setUserSecret] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        let token = Cookies.get("uuid");
        if (token) {
          const response = await axios.get(
            import.meta.env.VITE_URL_TO_VALIDATE_SESSION,
            {
              headers: { uuid: token },
            }
          );
          return response;
        }
        return null;
      } catch (error) {
        console.error("Error while validating session:", error);
        return null;
      }
    };

    checkSession().then((response) => {
      if (response && response.status === 200) {
        setIsLoading(false);
        setUserSecret(response.data.secret);
      } else {
        setIsLoading(true);
        navigate("/");
      }
    });
  }, []);

  function addSecret() {
    navigate("/adding_secret");
  }

  function handleLogout() {
    Cookies.remove("uuid");
    navigate("/");
  }

  if (isLoading) return <Loading />;

  return (
    <div>
      <Container maxWidth="sm" className="centerIt">
        <Box textAlign="center">
          <h1 className={styles.text}>
            {userSecret == null
              ? "No saved secrets"
              : `Secret: ${userSecret}`}
          </h1>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
            color="info"
              onClick={addSecret}
            >
              {userSecret == null ? "Add secret" : `Change secret`}
            </Button>
            <Button
              type="submit"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </ButtonGroup>
        </Box>
      </Container>
    </div>
  );
}

export default Secrets;
