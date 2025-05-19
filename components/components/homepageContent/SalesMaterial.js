import * as React from "react";
import { Button } from "@mui/material";

const pdfs = [
  {
    id: 1,
    title: "Dummy 1",
    url: "/pdfs/dummy.pdf",
  },
  {
    id: 2,
    title: "Dummy 2",
    url: "/pdfs/dummy.pdf",
  },
  {
    id: 2,
    title: "Dummy 3",
    url: "/pdfs/dummy.pdf",
  },
];

const SalesMaterial = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
        Sales Material
      </h2>
      <div style={{ width: "100%", display: "flex", gap: "10px" }}>
        {pdfs.map((item) => (
          <a href={item.url} download={`${item.title}.pdf`} key={item.id}>
            {" "}
            <Button
              variant="contained"
              color="error"
              size="large"
              sx={{
                py: 1.5,
                px: 6,
                minWidth: "240px",
                textTransform: "uppercase",
              }}
            >
              Download {item.title}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SalesMaterial;
