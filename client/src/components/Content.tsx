import { useState } from "react";
import Login from "./Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import Logout from "./Logout";
import Register from "./Register";

const Content = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            <Login
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
      </Routes>
      {isLoggedIn && <Logout setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
};

export default Content;
