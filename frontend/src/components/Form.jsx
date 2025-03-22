import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Input from "./Input";
import Loading from "./Loading";
import styles from "./Form.module.css";

function Form() {
  const [IsRegistered, setStatus] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

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
        setIsLoading(true);
        navigate("/secrets");
      } else {
        setIsLoading(false);
        // navigate("/");
      }
    });
  }, []);

  const sendData = async () => {
    if (IsRegistered) {
      try {
        const response = await axios.post(import.meta.env.VITE_URL_TO_LOGIN, {
          email: input.email,
          password: input.password,
        });
        toast.success(response.data.message);
        let uuid_value = response.data.uuid;
        Cookies.set("uuid", uuid_value, { expires: 1 / 24 }); // 1 hour cookie will be active
        navigate("/secrets");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      try {
        const response = await axios.post(
          import.meta.env.VITE_URL_TO_REGISTER,
          {
            email: input.email,
            password: input.password,
          }
        );
        toast.success(response.data.message);
        let uuid_value = response.data.uuid;
        Cookies.set("uuid", uuid_value, { expires: 1 / 24 }); // 1 hour cookie will be active
        navigate("/secrets");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.email != "" && input.password != "") {
      sendData();
      setInput({ email: "", password: "" });
    } else {
      toast.error("Fill in all the fields!");
    }
  };

  function signInClick() {
    setStatus((prev) => !prev);
  }

  function handleInput(obj) {
    if (obj.label === "Email") {
      setInput((prev) => {
        return { ...prev, email: obj.value };
      });
    } else if (obj.label === "Password") {
      setInput((prev) => {
        return { ...prev, password: obj.value };
      });
    }
  }

  if (isLoading) return <Loading />;

  return (
    <Container maxWidth="sm" className="centerIt">
      <Box
        className={`${styles.inputField} ${styles.form_style}`}
        component="form"
        onSubmit={handleSubmit}
      >
        <h1 className={styles.center}>
          {IsRegistered ? "Log In" : "Register"}
        </h1>

        <Input
          label="Email"
          type="email"
          value={input.email}
          handleInput={handleInput}
        />
        <Input
          label="Password"
          type="password"
          value={input.password}
          handleInput={handleInput}
        />

        <Button
          variant="contained"
          color={IsRegistered ? "primary" : "success"}
          type="submit"
        >
          {IsRegistered ? "Log In" : "Register"}
        </Button>
        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
      <p className={styles.switch_status_block}>
        {IsRegistered ? "No account?" : "Already have an account?"} -{" "}
        <a onClick={signInClick} className={styles.small_link}>
          {IsRegistered ? "Register" : "Log In"}
        </a>
      </p>
    </Container>
  );
}

export default Form;
