"use client";
import { CVData, CVTemplate } from "@/types/cv";

export async function exportToPDF(data: CVData, template: CVTemplate, filename = "my-cv") {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const element = document.getElementById("cv-export-target");
  if (!element) {
    alert("CV preview not found. Please open the full preview first.");
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: 794,
    height: 1123,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
  pdf.save(`${filename}.pdf`);
}
