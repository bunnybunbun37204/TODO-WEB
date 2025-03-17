import React from "react";
import { SideBar } from "../Sidebar/Sidebar";

const Main = () => {
  return (
    <div>
      <SideBar />

      <div style={{ marginLeft: 200, padding: 20 }}>
        <h1>Main Content</h1>
        <p>This is the main content area. The sidebar is to the left.</p>
      </div>
    </div>
  );
};
export default Main;
