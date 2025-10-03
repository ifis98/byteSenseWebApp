"use client";

import * as React from "react";

const Dashboard = () => {
  return (
    <div
      className="homePageContent"
      id="dashboard"
      style={{
        padding: "16px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "80%", height: "60vh", padding: "16px" }}>
        <iframe
          className="clickup-embed clickup-dynamic-height"
          src="/dashboard.mp4"
          width="100%"
          height="100%"
          style={{ background: "transparent", border: "1px solid #000" }}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "20vh",
          fontSize: "40px",
          fontWeight: 600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
        }}
      >
        New Offer
      </div>
      <div style={{ width: "60%", height: "60vh" }}>
        <iframe
          className="clickup-embed clickup-dynamic-height"
          src="https://doc.clickup.com/8469349/d/h/82ev5-21111/34c3e96a27da043"
          width="100%"
          height="100%"
          style={{ background: "transparent", border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
