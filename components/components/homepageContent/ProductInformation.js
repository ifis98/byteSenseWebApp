import * as React from "react";

const ProductInformation = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
        Product Information
      </h2>
      <div style={{ width: "100%", height: "80vh" }}>
        <iframe
          src={"https://www.shopbitely.com/shop"}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default ProductInformation;
