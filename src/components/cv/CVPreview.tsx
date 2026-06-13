"use client";
import { CVData, CVTemplate } from "@/types/cv";
import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalTemplate } from "./MinimalTemplate";

interface Props {
  data: CVData;
  template: CVTemplate;
  scale?: number;
}

export function CVPreview({ data, template, scale = 0.6 }: Props) {
  const props = { data, scale };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
      <div style={{ height: `${1123 * scale}px`, overflow: "hidden" }}>
        {template === "modern" && <ModernTemplate {...props} />}
        {template === "classic" && <ClassicTemplate {...props} />}
        {template === "minimal" && <MinimalTemplate {...props} />}
        {template === "executive" && <ModernTemplate {...props} />}
      </div>
    </div>
  );
}
