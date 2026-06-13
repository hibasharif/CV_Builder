"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CVData, CVTemplate, WorkExperience, Education, Skill, defaultCVData } from "@/types/cv";
import { generateId } from "@/lib/utils";
import { CVPreview } from "@/components/cv/CVPreview";
import Link from "next/link";

type Section = "personal" | "experience" | "education" | "skills";
const TEMPLATES: CVTemplate[] = ["modern", "classic", "minimal", "executive"];

interface Props {
  cvId: string;
  initialTitle: string;
  initialTemplate: CVTemplate;
  initialData: CVData;
}

export function BuilderClient({ cvId, initialTitle, initialTemplate, initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState<CVData>({ ...defaultCVData, ...initialData });
  const [template, setTemplate] = useState<CVTemplate>(initialTemplate);
  const [title, setTitle] = useState(initialTitle);
  const [section, setSection] = useState<Section>("personal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [exporting, setExporting] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Auto-save
  const save = useCallback(async (d: CVData, t: CVTemplate, ti: string) => {
    setSaving(true);
    await fetch(`/api/cv/${cvId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: d, template: t, title: ti }),
    });
    setSaving(false);
    setSaved(true);
  }, [cvId]);

  function markChanged(newData: CVData, newTemplate = template, newTitle = title) {
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(newData, newTemplate, newTitle), 1500);
  }

  function updatePersonal(field: string, value: string) {
    const updated = { ...data, personalInfo: { ...data.personalInfo, [field]: value } };
    setData(updated);
    markChanged(updated);
  }

  // Work Experience
  function addExperience() {
    const exp: WorkExperience = { id: generateId(), company: "", position: "", startDate: "", endDate: "", current: false, description: "", achievements: [""] };
    const updated = { ...data, workExperience: [...data.workExperience, exp] };
    setData(updated); markChanged(updated);
  }
  function updateExperience(id: string, field: string, value: unknown) {
    const updated = { ...data, workExperience: data.workExperience.map(w => w.id === id ? { ...w, [field]: value } : w) };
    setData(updated); markChanged(updated);
  }
  function removeExperience(id: string) {
    const updated = { ...data, workExperience: data.workExperience.filter(w => w.id !== id) };
    setData(updated); markChanged(updated);
  }

  // Education
  function addEducation() {
    const edu: Education = { id: generateId(), institution: "", degree: "", field: "", startDate: "", endDate: "" };
    const updated = { ...data, education: [...data.education, edu] };
    setData(updated); markChanged(updated);
  }
  function updateEducation(id: string, field: string, value: string) {
    const updated = { ...data, education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) };
    setData(updated); markChanged(updated);
  }
  function removeEducation(id: string) {
    const updated = { ...data, education: data.education.filter(e => e.id !== id) };
    setData(updated); markChanged(updated);
  }

  // Skills
  function addSkill() {
    const skill: Skill = { id: generateId(), name: "", level: "Intermediate" };
    const updated = { ...data, skills: [...data.skills, skill] };
    setData(updated); markChanged(updated);
  }
  function updateSkill(id: string, field: string, value: string) {
    const updated = { ...data, skills: data.skills.map(s => s.id === id ? { ...s, [field]: value } : s) };
    setData(updated); markChanged(updated);
  }
  function removeSkill(id: string) {
    const updated = { ...data, skills: data.skills.filter(s => s.id !== id) };
    setData(updated); markChanged(updated);
  }

  // AI suggestions
  async function getAISuggestion(type: string, context: string) {
    setAiLoading(true);
    setAiResult("");
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, context }),
    });
    const json = await res.json();
    setAiResult(json.suggestion || "No suggestion returned.");
    setAiLoading(false);
  }

  // PDF export
  async function handleExport() {
    setExporting(true);
    const { exportToPDF } = await import("@/lib/exportPDF");
    await exportToPDF(data, template, title || "my-cv");
    setExporting(false);
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">← Dashboard</Link>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); markChanged(data, template, e.target.value); }}
            className="text-sm font-semibold text-gray-800 border-0 outline-none bg-transparent hover:bg-gray-50 px-2 py-1 rounded focus:bg-gray-50"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{saving ? "Saving..." : saved ? "✓ Saved" : "Unsaved"}</span>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {exporting ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Exporting...</> : "⬇ Export PDF"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className="w-[400px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
          {/* Section tabs */}
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {(["personal", "experience", "education", "skills"] as Section[]).map(s => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${section === s ? "text-slate-800 border-b-2 border-slate-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-1 p-5 space-y-4">
            {/* Personal Info */}
            {section === "personal" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["fullName", "Full Name"],
                    ["email", "Email"],
                    ["phone", "Phone"],
                    ["location", "Location"],
                    ["website", "Website"],
                    ["linkedin", "LinkedIn"],
                  ].map(([field, label]) => (
                    <div key={field} className={field === "fullName" ? "col-span-2" : ""}>
                      <label className={labelCls}>{label}</label>
                      <input
                        className={inputCls}
                        value={(data.personalInfo as unknown as Record<string, string>)[field] ?? ""}
                        onChange={e => updatePersonal(field, e.target.value)}
                        placeholder={label}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelCls}>Professional Summary</label>
                    <button
                      onClick={() => getAISuggestion("summary", `Name: ${data.personalInfo.fullName}, Skills: ${data.skills.map(s => s.name).join(", ")}, Experience: ${data.workExperience.map(w => w.position).join(", ")}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      ✨ AI suggest
                    </button>
                  </div>
                  <textarea
                    className={`${inputCls} min-h-[100px] resize-none`}
                    value={data.personalInfo.summary}
                    onChange={e => updatePersonal("summary", e.target.value)}
                    placeholder="A brief professional summary..."
                  />
                </div>

                {/* AI result panel */}
                {(aiLoading || aiResult) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-700 mb-1">✨ AI Suggestions</p>
                    {aiLoading ? (
                      <p className="text-xs text-blue-500 animate-pulse">Generating suggestions...</p>
                    ) : (
                      <p className="text-xs text-blue-800 whitespace-pre-wrap leading-relaxed">{aiResult}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Work Experience */}
            {section === "experience" && (
              <>
                {data.workExperience.map((w, idx) => (
                  <div key={w.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-gray-600">Position {idx + 1}</p>
                      <button onClick={() => removeExperience(w.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <label className={labelCls}>Job Title</label>
                        <input className={inputCls} value={w.position} onChange={e => updateExperience(w.id, "position", e.target.value)} placeholder="e.g. Software Engineer" />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Company</label>
                        <input className={inputCls} value={w.company} onChange={e => updateExperience(w.id, "company", e.target.value)} placeholder="Company name" />
                      </div>
                      <div>
                        <label className={labelCls}>Start Date</label>
                        <input type="month" className={inputCls} value={w.startDate} onChange={e => updateExperience(w.id, "startDate", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>End Date</label>
                        <input type="month" className={inputCls} value={w.endDate} disabled={w.current} onChange={e => updateExperience(w.id, "endDate", e.target.value)} />
                        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                          <input type="checkbox" checked={w.current} onChange={e => updateExperience(w.id, "current", e.target.checked)} className="w-3 h-3" />
                          <span className="text-xs text-gray-500">Currently working here</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className={labelCls}>Description</label>
                        <button
                          onClick={() => getAISuggestion("description", `${w.position} at ${w.company}`)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >✨ AI</button>
                      </div>
                      <textarea className={`${inputCls} resize-none min-h-[60px]`} value={w.description} onChange={e => updateExperience(w.id, "description", e.target.value)} placeholder="Brief description..." />
                    </div>
                    <div>
                      <label className={labelCls}>Key Achievements</label>
                      {w.achievements.map((a, i) => (
                        <div key={i} className="flex gap-2 mb-1.5">
                          <input className={inputCls} value={a} onChange={e => {
                            const achs = [...w.achievements]; achs[i] = e.target.value;
                            updateExperience(w.id, "achievements", achs);
                          }} placeholder={`Achievement ${i + 1}`} />
                          <button onClick={() => {
                            const achs = w.achievements.filter((_, j) => j !== i);
                            updateExperience(w.id, "achievements", achs);
                          }} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                        </div>
                      ))}
                      <button onClick={() => updateExperience(w.id, "achievements", [...w.achievements, ""])} className="text-xs text-slate-600 hover:text-slate-800">+ Add achievement</button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="w-full border-2 border-dashed border-gray-200 text-gray-400 rounded-xl py-3 text-sm hover:border-gray-300 hover:text-gray-600 transition-colors">
                  + Add work experience
                </button>
                {(aiLoading || aiResult) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-700 mb-1">✨ AI Suggestions</p>
                    {aiLoading ? <p className="text-xs text-blue-500 animate-pulse">Generating...</p> : <p className="text-xs text-blue-800 whitespace-pre-wrap leading-relaxed">{aiResult}</p>}
                  </div>
                )}
              </>
            )}

            {/* Education */}
            {section === "education" && (
              <>
                {data.education.map((e, idx) => (
                  <div key={e.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-gray-600">Education {idx + 1}</p>
                      <button onClick={() => removeEducation(e.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                    {[["institution","Institution"],["degree","Degree"],["field","Field of Study"],["grade","Grade (optional)"]].map(([f, l]) => (
                      <div key={f}>
                        <label className={labelCls}>{l}</label>
                        <input className={inputCls} value={(e as unknown as Record<string,string>)[f] ?? ""} onChange={ev => updateEducation(e.id, f, ev.target.value)} placeholder={l} />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={labelCls}>Start</label><input type="month" className={inputCls} value={e.startDate} onChange={ev => updateEducation(e.id, "startDate", ev.target.value)} /></div>
                      <div><label className={labelCls}>End</label><input type="month" className={inputCls} value={e.endDate} onChange={ev => updateEducation(e.id, "endDate", ev.target.value)} /></div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="w-full border-2 border-dashed border-gray-200 text-gray-400 rounded-xl py-3 text-sm hover:border-gray-300 hover:text-gray-600 transition-colors">
                  + Add education
                </button>
              </>
            )}

            {/* Skills */}
            {section === "skills" && (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Add your professional skills</p>
                  <button
                    onClick={() => getAISuggestion("skills", `${data.personalInfo.fullName} works as ${data.workExperience[0]?.position ?? "professional"} with experience in ${data.workExperience.map(w => w.company).join(", ")}`)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >✨ AI suggest skills</button>
                </div>
                {data.skills.map((s) => (
                  <div key={s.id} className="flex gap-2 items-center">
                    <input className={`${inputCls} flex-1`} value={s.name} onChange={e => updateSkill(s.id, "name", e.target.value)} placeholder="Skill name" />
                    <select className={`${inputCls} w-32`} value={s.level} onChange={e => updateSkill(s.id, "level", e.target.value)}>
                      {["Beginner","Intermediate","Advanced","Expert"].map(l => <option key={l}>{l}</option>)}
                    </select>
                    <button onClick={() => removeSkill(s.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none flex-shrink-0">×</button>
                  </div>
                ))}
                <button onClick={addSkill} className="w-full border-2 border-dashed border-gray-200 text-gray-400 rounded-xl py-3 text-sm hover:border-gray-300 hover:text-gray-600 transition-colors">
                  + Add skill
                </button>
                {(aiLoading || aiResult) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-700 mb-1">✨ Suggested Skills</p>
                    {aiLoading ? <p className="text-xs text-blue-500 animate-pulse">Generating...</p> : <p className="text-xs text-blue-800 whitespace-pre-wrap leading-relaxed">{aiResult}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex-1 overflow-y-auto">
          {/* Template selector */}
          <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 flex-shrink-0">
            <span className="text-xs font-medium text-gray-500 mr-2">Template:</span>
            {TEMPLATES.map(t => (
              <button
                key={t}
                onClick={() => { setTemplate(t); markChanged(data, t, title); }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-colors ${template === t ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-8 flex justify-center">
            <div id="cv-export-target" className="w-[794px]">
              <CVPreview data={data} template={template} scale={0.85} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
