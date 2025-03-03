import React from "react";
import Form from "./components/Form";
import Secrets from "./components/Secrets";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/secrets" element={<Secrets />} />
      </Routes>
    </>
  );
}

export default App;
