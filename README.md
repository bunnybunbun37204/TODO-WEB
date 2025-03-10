# Setting Up the Todo Web Project

This guide will walk you through the steps to set up a **Todo Web** project from scratch, including installing necessary libraries.

## Step 1: Initialize the Project

Start by creating a new React project using `create-react-app` for a quick setup.

1. Open your terminal and run the following command to create a new React project:

   ```bash
   npx create-react-app todo-web
   ```

   This command will create a new project folder named `todo-web` and install the necessary dependencies for React.

2. Once the project is created, navigate to the project folder:

   ```bash
   cd todo-web
   ```

3. Run the development server to ensure everything is working:

   ```bash
   npm start
   ```

   Your app will now be running at `http://localhost:3000`.

## Step 2: Install Additional Libraries

Next, we'll install additional libraries for routing, notifications, cookies management, and making HTTP requests.

1. **React Router**: Used for routing and navigation within the app.

   ```bash
   npm install react-router-dom
   ```

2. **React Hot Toast**: For displaying toast notifications (e.g., success, error).

   ```bash
   npm install react-hot-toast
   ```

3. **React Cookie**: For managing cookies (used for storing the authentication token).

   ```bash
   npm install react-cookie
   ```

4. **Axios**: For making HTTP requests to the API.

   ```bash
   npm install axios
   ```

5. **React**: If not already installed (it’s usually installed with `create-react-app`).

   ```bash
   npm install react react-dom
   ```

## Step 3: Modify the Project

Now let's modify the project to use routing and connect it with the API for login functionality.

### 1. **Set up Routing in `App.js`**

You need to use `react-router-dom` for managing navigation between pages. Modify `src/App.js` to add routing:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./components/Auth/SignIn";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: "#4BB543",
              color: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 2. **Create the SignIn Page in `SignIn.js`**

Create the login page with a form for entering the username and password. Use `react-hot-toast` to display success or error messages when logging in:

```jsx
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiClient from '../../api/client';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setCookie] = useCookies(['token']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await apiClient.post('/tokens', { username, password });
      toast.success('Login successful', {
        position: 'top-center',
        style: {
          background: '#4BB543',
          color: '#fff',
        },
      });
      setCookie('token', data.token, { path: '/' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      toast.error(errorMessage, {
        position: 'top-center',
        style: {
          background: '#ff4444',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h1 className="app-title">Todo</h1>
        <h2 className="form-title">Sign In</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="register-section">
          <span>Don't have an account? </span>
          <Link to="/register" className="register-link">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
```

### 3. **Set up Axios in `client.js`**

Create the file `src/api/client.js` for setting up Axios to make HTTP requests and add an interceptor for handling the token in the headers:

```js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8787',
});

apiClient.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Summary of Installed Libraries

1. **react-router-dom** – For managing routing and navigation within the app.
2. **react-hot-toast** – For displaying toast notifications.
3. **react-cookie** – For managing cookies (storing the token).
4. **axios** – For making HTTP requests to the API.

Your project is now ready to go!