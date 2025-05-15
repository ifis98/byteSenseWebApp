import * as React from "react";

const FAQ = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
        FAQ
      </h2>
      <div style={{ width: "100%", height: "80vh" }}>
        {/*<iframe src="/api/proxy" width="100%" height="100%" />*/}
          <iframe
              src={"https://www.bytesense.ai/faq"}
              width="100%"
              height="100%"
          />
      </div>
    </div>
  );
};

export default FAQ;
