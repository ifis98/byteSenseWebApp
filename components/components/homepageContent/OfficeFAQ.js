import * as React from "react";

const OfficeFAQ = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
        Office FAQ
      </h2>
      <div style={{ width: "100%", height: "80vh" }}>
        <iframe
          src="/api/proxy?url=https://www.bytesense.ai/faq"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default OfficeFAQ;