### **1. Initialize the Project**

Start by creating a new React project using `create-react-app`:

1. **Open your terminal** and run the following command to create a new React project:
   
   ```bash
   npx create-react-app todo-web
   ```

2. **Navigate to the project directory**:

   ```bash
   cd todo-web
   ```

3. **Start the development server** to verify that everything is set up:

   ```bash
   npm start
   ```

   Your app should now be running at `http://localhost:3000`.

---

### **2. Install Necessary Libraries**

Next, you'll install libraries for routing, HTTP requests, notifications, and cookie management.

1. **React Router** – For routing and navigation:
   
   ```bash
   npm install react-router-dom
   ```

2. **React Hot Toast** – For toast notifications (e.g., success, error messages):

   ```bash
   npm install react-hot-toast
   ```

3. **React Cookie** – For cookie management (used for storing the auth token):

   ```bash
   npm install react-cookie
   ```

4. **Axios** – For making HTTP requests to the API:

   ```bash
   npm install axios
   ```

---

### **3. Project Structure**

Your project structure will look like this:

```
todo-web/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── client.js
│   ├── components/
│   │   └── Auth/
│   │       ├── SignIn.css
│   │       └── SignIn.js
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   ├── utils/
│   │   └── someUtil.js
├── .env
├── package.json
├── README.md
└── node_modules/
```

---

### **4. Set Up Routing in `App.js`**

In **`src/App.js`**, set up routing to handle navigation:

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

This sets up routing for the `SignIn` component.

---

### **5. Create the SignIn Component**

In **`src/components/Auth/SignIn.js`**, create a sign-in page with form inputs for the username and password. Use `react-hot-toast` to display success or error messages when submitting the form:

```jsx
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
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
          <a href="/register" className="register-link">
            Register here
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
```

---

### **6. Set Up Axios in `client.js`**

Create the **`src/api/client.js`** file to set up Axios for making HTTP requests and add an interceptor for handling the token in the headers:

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

This sets up the Axios client to automatically attach the token to each request and handle 401 errors (unauthorized access).

---

### **7. Add CSS for the SignIn Component**

Create the **`src/components/Auth/SignIn.css`** file for styling the `SignIn` component:

```css
/* Overall container for the sign-in page */
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f4f8;
  font-family: Arial, sans-serif;
}

/* SignIn form style */
.signin-form {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.app-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.form-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #555;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  font-size: 14px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #4BB543;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #45a040;
}

.register-section {
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}

.register-link {
  color: #4BB543;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
```

This provides basic styles for your sign-in form.

---

### **8. Set Up Environment Variables**

Create a `.env` file in the root of your project to store environment-specific variables:

```env
REACT_APP_API_URL=http://localhost:8787
```

This makes it easier to change the API URL based on the environment (development, production).

---

### **Summary of Installed Libraries:**

1. **react-router-dom** – For routing and navigation within the app.
2. **react-hot-toast** – For displaying toast notifications (success, error).
3. **react-cookie** – For managing cookies (e.g., storing the authentication token).
4.

 **axios** – For making HTTP requests to the backend API.

---

### **9. Next Steps**

- Build out other parts of the application such as **todo creation**, **todo listing**, and **todo deletion**.
- Add a protected route that redirects the user to the sign-in page if they are not authenticated.
