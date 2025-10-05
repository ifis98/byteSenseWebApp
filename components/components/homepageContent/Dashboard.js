"use client";

import * as React from "react";
import Script from "next/script";

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
        alignItems: "stretch",
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box",
        gap: "24px",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            border: "1px solid #000",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          <video
            src="/dashboard.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          ></video>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          minHeight: "20vh",
          fontSize: "40px",
          fontWeight: 600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        {"New Offer -> Welcome to byteSense!"}
      </div>
      <div style={{ width: "100%", height: "80vh" }}>
        <iframe
          className="clickup-embed clickup-dynamic-height"
          src="https://doc.clickup.com/8469349/d/h/82ev5-21151/1bface5cf24acb3"
          width="100%"
          height="100%"
          style={{
            background: "transparent",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
          allow="clipboard-write"
        ></iframe>
      </div>
      <Script
        src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"
        strategy="lazyOnload"
      />
    </div>
  );
};

export default Dashboard;
