"use client";
import { CVData } from "@/types/cv";
import { formatDate } from "@/lib/utils";

export function MinimalTemplate({ data, scale = 1 }: { data: CVData; scale?: number }) {
  const { personalInfo: p, workExperience, education, skills } = data;

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: `${100 / scale}%` }}
      className="bg-white font-sans text-gray-900 min-h-[1123px] w-[794px] px-16 py-12"
    >
      <div className="mb-8">
        <h1 className="text-5xl font-light tracking-tight text-gray-900">{p.fullName || "Your Name"}</h1>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
        </div>
      </div>

      {p.summary && (
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-2xl">{p.summary}</p>
      )}

      {workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Experience</h2>
          {workExperience.map((w) => (
            <div key={w.id} className="mb-6 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-xs text-gray-400 pt-0.5">
                <p>{formatDate(w.startDate)}</p>
                <p>– {w.current ? "Present" : formatDate(w.endDate)}</p>
              </div>
              <div className="col-span-3">
                <p className="font-medium text-gray-900">{w.position}</p>
                <p className="text-sm text-gray-500 mb-1">{w.company}</p>
                {w.description && <p className="text-sm text-gray-600 leading-relaxed">{w.description}</p>}
                {w.achievements.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {w.achievements.filter(Boolean).map((a, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-gray-300">—</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Education</h2>
          {education.map((e) => (
            <div key={e.id} className="mb-4 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-xs text-gray-400 pt-0.5">
                <p>{formatDate(e.startDate)}</p>
                <p>– {e.endDate ? formatDate(e.endDate) : "Present"}</p>
              </div>
              <div className="col-span-3">
                <p className="font-medium text-gray-900">{e.degree} in {e.field}</p>
                <p className="text-sm text-gray-500">{e.institution}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="text-sm text-gray-600 border border-gray-200 px-3 py-1 rounded-full">{s.name}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
