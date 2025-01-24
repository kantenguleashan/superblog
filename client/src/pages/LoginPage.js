import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      const data = await response.json();
      if (data.error === "username not found") {
        setErrorMessage("Wrong username.");
      } else if (data.error === "incorrect password") {
        setErrorMessage("Incorrect password.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <form className="login" onSubmit={login}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={ev => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
        />
        <button>Login</button>
        {errorMessage && <div className="error">{errorMessage}</div>}
      </form>
    </div>
  );
}
