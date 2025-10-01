import Script from "next/script";

const SalesMaterial = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
        Sales Material
      </h2>
      <div style={{ width: "100%", height: "80vh" }}>
        <iframe
          className="clickup-embed clickup-dynamic-height"
          src="https://doc.clickup.com/8469349/d/h/82ev5-21091/81719dc5c6aaf00"
          width="100%"
          height="100%"
          style={{ background: "transparent", border: "1px solid #ccc" }}
        />
      </div>
      <Script async src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js" />
    </div>
  );
};

export default SalesMaterial;
