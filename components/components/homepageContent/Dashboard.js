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
      <div style={{ width: "100%", height: "60vh", padding: "16px" }}>
        <video
          src="/dashboard.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", border: "1px solid #000" }}
        ></video>
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
        {"New Offer -> Welcome to byteSense!"}
      </div>
      <div style={{ width: "100%", height: "60vh" }}>
        <iframe
          className="clickup-embed clickup-dynamic-height"
          src=""
          onWheel=""
          width="100%"
          height="100%"
          style={{ background: "transparent", border: "1px solid #ccc" }}
        />
        <script async src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"></script>
      </div>
    </div>
  );
};

export default Dashboard;
