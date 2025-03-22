import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Box, ButtonGroup } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Input from "./Input";
import Loading from "./Loading";
import styles from "./Adding_secrets.module.css";

function Form() {
  const [IsRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userSecret, setUserSecret] = useState("");
  const [userSecretIsThere, setUserSecretIsThere] = useState(false);

  const [input, setInput] = useState("");

  const navigate = useNavigate();

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
        setIsRegistered(true);
        setUserSecret(response.data.secret);
        if (response.data.secret !== null) {
          setUserSecretIsThere(true);
        } else {
          setUserSecretIsThere(false);
        }
      } else {
        setIsLoading(true);
        setIsRegistered(false);
        setUserSecretIsThere(false);
        navigate("/");
      }
    });
  }, []);

  const UpdateSecret = async () => {
    try {
      let token = Cookies.get("uuid");
      if (token) {
        const response = await axios.post(
          import.meta.env.VITE_URL_TO_ADD_SECRET,
          {
            secret: userSecret,
          },
          {
            headers: { uuid: token },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/secrets");
        }
      } else {
        navigate("/");
        return null;
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error adding secret:", error);
      return null;
    }
  };

  const modifySecret = ({ value }) => {
    setUserSecret(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.email != "" && input.password != "") {
      //   sendData();
      setInput({ email: "", password: "" });
    } else {
      toast.error("Fill in all the fields!");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Container maxWidth="sm" className="centerIt">
      <Box
        className={`${styles.inputField} ${styles.form_style}`}
        component="form"
        onSubmit={handleSubmit}
      >
        <h1 className={styles.center}>
          {userSecretIsThere == false ? "Add secret" : "Modify secret"}
        </h1>

        <Input
          label="Your secret"
          type="secret"
          value={userSecret == null ? "" : userSecret}
          handleInput={modifySecret}
        />

        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          sx={{ width: "100%" }}
        >
          <Button color="info" onClick={UpdateSecret} sx={{ flex: 1 }}>
            {userSecretIsThere == false ? "Add secret" : `Change secret`}
          </Button>
          <Button
            type="submit"
            color="error"
            onClick={() => navigate("/secrets")}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        </ButtonGroup>

        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    </Container>
  );
}

export default Form;
