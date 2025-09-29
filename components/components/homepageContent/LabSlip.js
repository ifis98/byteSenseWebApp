import * as React from "react";
import { Button } from "@mui/material";
import dynamic from "next/dynamic";

const Document = dynamic(() => import("react-pdf").then((m) => m.Document), { ssr: false });
const Page = dynamic(() => import("react-pdf").then((m) => m.Page), { ssr: false });
const getPdfjs = async () => (await import("react-pdf")).pdfjs;

const pdfs = [
  {
    id: 1,
    title: "Dummy 1",
    url: "/pdfs/PDF-3.pdf",
  },{
    id: 2,
    title: "Dummy 2",
    url: "/pdfs/dummy.pdf",
  },{
    id: 3,
    title: "Dummy 3",
    url: "/pdfs/dummy.pdf",
  },
];

const PDFViewer = ({ file, title }) => {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [isReady, setIsReady] = React.useState(false);
  const containerRef = React.useRef(null);
  const [pageWidth, setPageWidth] = React.useState(undefined);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const pdfjs = await getPdfjs();
      const workerPathESM = "/pdf.worker.min.mjs";
      const workerPathIIFE = "/pdf.worker.min.js";
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = workerPathESM;
      } catch (e) {
        pdfjs.GlobalWorkerOptions.workerSrc = workerPathIIFE;
      }
      if (mounted) setIsReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;
    const update = () => {
      const width = element.clientWidth;
      setPageWidth(width > 0 ? width : undefined);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(element);
    return () => ro.disconnect();
  }, [isReady]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
  const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages || 1));

  if (!isReady) {
    return <div style={{ width: "60%" }}>Loading PDF…</div>;
  }

  return (
    <div style={{ width: "60%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontWeight: 600 }}>{title}</h3>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button variant="outlined" onClick={prevPage} disabled={pageNumber <= 1}>
            Prev
          </Button>
          <Button variant="outlined" onClick={nextPage} disabled={!numPages || pageNumber >= numPages}>
            Next
          </Button>
        </div>
      </div>
      <div ref={containerRef} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, background: "#fafafa", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading={<div>Loading PDF…</div>} >
          <Page pageNumber={pageNumber} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
      </div>
      <div style={{ marginTop: 8, color: "#666" }}>
        Page {pageNumber}{numPages ? ` / ${numPages}` : ""}
      </div>
    </div>
  );
};

const LabSlip = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
        Lab Slip
      </h2>
      <div style={{ width: "100%", display: "flex", gap: "10px", flexDirection: "column" }}>
        {pdfs.map((item) => (
          <PDFViewer key={item.id} file={item.url} title={item.title} />
        ))}
      </div>
    </div>
  );
};

export default LabSlip;
