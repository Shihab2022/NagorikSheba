declare global {
  interface Window {
    htmlToImage?: any;
    jspdf?: any;
  }
}

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export async function downloadTaxPdf(
  element: HTMLElement,
  taxpayerName: string = "Taxpayer",
  assessmentYear: string = "2025-26"
): Promise<void> {
  await Promise.all([
    window.htmlToImage
      ? Promise.resolve()
      : loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js",
          "html-to-image-script"
        ),
    window.jspdf
      ? Promise.resolve()
      : loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
          "jspdf-script"
        ),
  ]);

  const htmlToImage = window.htmlToImage;
  const jsPDF = window.jspdf?.jsPDF;

  if (!htmlToImage || !jsPDF) {
    throw new Error("PDF generator libraries could not be initialized");
  }

  const a4Width = 794;
  const a4Height = 1123;

  const dataUrl = await htmlToImage.toPng(element, {
    quality: 1,
    pixelRatio: 2,
    width: a4Width,
    height: a4Height,
    backgroundColor: "#ffffff",
    skipFonts: true,
    style: {
      width: `${a4Width}px`,
      minHeight: `${a4Height}px`,
      margin: "0",
      transform: "none",
    },
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const marginX = 10;
  const marginY = 10;
  const printableWidth = 190;
  const printableHeight = 277;

  pdf.addImage(
    dataUrl,
    "PNG",
    marginX,
    marginY,
    printableWidth,
    printableHeight,
    undefined,
    "FAST"
  );

  const cleanName = (taxpayerName || "Taxpayer")
    .trim()
    .replace(/[^a-zA-Z0-9\u0980-\u09FF_-]/g, "_");
  const filename = `Tax_Assessment_${cleanName}_${assessmentYear}.pdf`;

  pdf.save(filename);
}
