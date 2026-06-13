"use client";
import { CVData } from "@/types/cv";
import { formatDate } from "@/lib/utils";

export function ClassicTemplate({ data, scale = 1 }: { data: CVData; scale?: number }) {
  const { personalInfo: p, workExperience, education, skills } = data;

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: `${100 / scale}%` }}
      className="bg-white font-serif text-gray-900 min-h-[1123px] w-[794px] px-14 py-12"
    >
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-4xl font-bold tracking-wide uppercase">{p.fullName || "Your Name"}</h1>
        <div className="flex justify-center flex-wrap gap-3 mt-2 text-sm text-gray-600">
          {p.email && <span>{p.email}</span>}
          {p.phone && <><span>·</span><span>{p.phone}</span></>}
          {p.location && <><span>·</span><span>{p.location}</span></>}
          {p.linkedin && <><span>·</span><span>{p.linkedin}</span></>}
        </div>
      </div>

      {p.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Objective</h2>
          <p className="text-sm leading-relaxed text-gray-700">{p.summary}</p>
        </section>
      )}

      {workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Professional Experience</h2>
          {workExperience.map((w) => (
            <div key={w.id} className="mb-4">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{w.position}, {w.company}</span>
                <span className="text-sm text-gray-600">{formatDate(w.startDate)} – {w.current ? "Present" : formatDate(w.endDate)}</span>
              </div>
              {w.description && <p className="text-sm text-gray-700 mt-1">{w.description}</p>}
              {w.achievements.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {w.achievements.filter(Boolean).map((a, i) => (
                    <li key={i} className="text-sm text-gray-700">{a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Education</h2>
          {education.map((e) => (
            <div key={e.id} className="flex justify-between mb-2">
              <div>
                <span className="font-bold text-sm">{e.degree} in {e.field}</span>
                <span className="text-sm text-gray-600"> — {e.institution}</span>
              </div>
              <span className="text-sm text-gray-600">{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : "Present"}</span>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Skills</h2>
          <p className="text-sm text-gray-700">{skills.map((s) => s.name).join(" · ")}</p>
        </section>
      )}
    </div>
  );
}
