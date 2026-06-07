"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useState } from "react";

type PdfExportButtonProps = {
  title: string;
  content: string;
  targetId?: string;
};

export function PdfExportButton({
  title,
  content,
  targetId,
}: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);

    const temporaryElement = targetId
      ? null
      : createTemporaryPdfElement(title, content);
    const sourceElement =
      (targetId ? document.getElementById(targetId) : temporaryElement) ??
      temporaryElement;

    if (!sourceElement) {
      alert("PDF出力対象が見つかりませんでした。");
      setIsExporting(false);
      return;
    }

    try {
      const canvas = await html2canvas(sourceElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: (element) =>
          element instanceof HTMLElement &&
          element.dataset.html2canvasIgnore === "true",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2;
      const imageHeight = (canvas.height * printableWidth) / canvas.width;
      const imageData = canvas.toDataURL("image/png");

      let offsetY = 0;
      let pageIndex = 0;

      while (offsetY < imageHeight) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imageData,
          "PNG",
          margin,
          margin - offsetY,
          printableWidth,
          imageHeight,
        );

        offsetY += printableHeight;
        pageIndex += 1;
      }

      pdf.save(`${formatFileDate(new Date())}_${sanitizeFileName(title)}.pdf`);
    } catch (error) {
      console.error(error);
      alert("PDFの生成に失敗しました。もう一度お試しください。");
    } finally {
      temporaryElement?.remove();
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="w-full rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-white hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {isExporting ? "PDF生成中..." : "PDF出力"}
    </button>
  );
}

function createTemporaryPdfElement(title: string, content: string) {
  const element = document.createElement("section");
  element.style.position = "fixed";
  element.style.left = "-10000px";
  element.style.top = "0";
  element.style.width = "794px";
  element.style.padding = "48px";
  element.style.background = "#ffffff";
  element.style.color = "#111827";
  element.style.fontFamily = '"Yu Gothic", "Meiryo", "Hiragino Sans", sans-serif';
  element.style.lineHeight = "1.8";
  element.style.whiteSpace = "pre-wrap";

  const heading = document.createElement("h1");
  heading.textContent = title;
  heading.style.fontSize = "24px";
  heading.style.fontWeight = "700";
  heading.style.margin = "0 0 24px";

  const main = document.createElement("main");
  main.textContent = content;
  main.style.fontSize = "14px";

  element.append(heading, main);
  document.body.appendChild(element);

  return element;
}

function sanitizeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_");
}

function formatFileDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}_${month}_${day}`;
}
