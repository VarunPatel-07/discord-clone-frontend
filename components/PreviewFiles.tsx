import React, { useState } from "react";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the worker path to the proper version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreview = () => {
  const pdfUrl = "https://res.cloudinary.com/dmsx4sde9/raw/upload/v1726401037/mwc3d4z1v38pp9bt3je7";
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(false);
  }

  function onDocumentError() {
    setError(true);
  }

  return (
    <div>
      {error ? (
        <img src="/path-to-your-default-image.png" alt="PDF could not be loaded" />
      ) : (
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentError}>
          <Page pageNumber={1} />
        </Document>
      )}
      {numPages && <p>Number of Pages: {numPages}</p>}
    </div>
  );
};

export default PdfPreview;
