import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./components/Auth/SignIn";
import Activity from "./components/Activity/Activity";

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
        <Route path="/activities" element={<Activity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
