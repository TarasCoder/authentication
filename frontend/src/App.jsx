import React from "react";
import Form from "./components/Form";
import Secrets from "./components/Secrets";
import Adding_secret from "./components/Adding_secret";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/secrets" element={<Secrets />} />
        <Route path="/adding_secret" element={<Adding_secret />} />
      </Routes>
    </>
  );
}

export default App;
