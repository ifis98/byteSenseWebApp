import Script from "next/script";

const StaffTraining = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
        Staff Training
      </h2>
      <div style={{ width: "100%", height: "80vh" }}>
        <iframe
          className="clickup-embed clickup-dynamic-height"
          src="https://doc.clickup.com/8469349/d/h/82ev5-21071/b442ccf5fa284fb"
          width="100%"
          height="100%"
          style={{ background: "transparent", border: "1px solid #ccc" }}
        />
      </div>
      <Script async src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js" />
    </div>
  );
};

export default StaffTraining;
