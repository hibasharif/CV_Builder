"use client";
import { CVData } from "@/types/cv";
import { formatDate } from "@/lib/utils";

interface Props {
  data: CVData;
  scale?: number;
}

export function ModernTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, workExperience, education, skills, languages } = data;

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: `${100 / scale}%` }}
      className="bg-white font-sans text-gray-900 min-h-[1123px] w-[794px]"
    >
      {/* Header */}
      <div className="bg-slate-800 text-white px-10 py-8">
        <h1 className="text-3xl font-bold tracking-tight">{p.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-300 text-sm">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.website && <span>🌐 {p.website}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
        </div>
      </div>

      <div className="px-10 py-6 grid grid-cols-3 gap-8">
        {/* Left column */}
        <div className="col-span-1 space-y-6">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Skills</h2>
              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{s.name}</span>
                      <span className="text-slate-400">{s.level}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-slate-700 rounded-full"
                        style={{ width: { Beginner: "25%", Intermediate: "50%", Advanced: "75%", Expert: "100%" }[s.level] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Education</h2>
              {education.map((e) => (
                <div key={e.id} className="mb-3">
                  <p className="font-semibold text-sm text-slate-800">{e.institution}</p>
                  <p className="text-xs text-slate-600">{e.degree} in {e.field}</p>
                  <p className="text-xs text-slate-400">{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : "Present"}</p>
                  {e.grade && <p className="text-xs text-slate-500">Grade: {e.grade}</p>}
                </div>
              ))}
            </section>
          )}

          {languages && languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Languages</h2>
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{l.name}</span>
                  <span className="text-slate-400 text-xs">{l.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="col-span-2 space-y-6">
          {p.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Profile</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>
            </section>
          )}

          {workExperience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Experience</h2>
              {workExperience.map((w) => (
                <div key={w.id} className="mb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-slate-800">{w.position}</p>
                      <p className="text-sm text-slate-600">{w.company}</p>
                    </div>
                    <p className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(w.startDate)} – {w.current ? "Present" : formatDate(w.endDate)}
                    </p>
                  </div>
                  {w.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{w.description}</p>}
                  {w.achievements.filter(Boolean).length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {w.achievements.filter(Boolean).map((a, i) => (
                        <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                          <span className="text-slate-400 mt-0.5">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
