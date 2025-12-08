import * as React from "react";

const ContactSupport = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
          Contact Support
      </h2>
      <div style={{ width: "100%", height: "80vh" }}>
        <iframe
          src="/api/proxy?url=https://tawk.to/chat/691e1e6b3c3c13194fe65a35/1jaeqdl1b"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default ContactSupport;
