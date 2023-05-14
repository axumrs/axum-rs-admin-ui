import React, { useContext } from "react";
import AdminLayout from "./components/AdminLayout";
import { AuthContext } from "./contexts/AuthContext";
import Login from "./components/Login";

export default function App() {
  const { getAuth } = useContext(AuthContext);
  if (!getAuth()) {
    return (
      <>
        <Login />
      </>
    );
  }
  return (
    <>
      <AdminLayout />
    </>
  );
}
