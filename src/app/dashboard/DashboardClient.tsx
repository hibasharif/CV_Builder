"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CVTemplate } from "@/types/cv";

interface CV { id: string; title: string; template: string; updatedAt: Date }
interface User { name?: string | null; email?: string | null; image?: string | null }

const TEMPLATE_LABELS: Record<CVTemplate, string> = {
  modern: "Modern",
  classic: "Classic",
  minimal: "Minimal",
  executive: "Executive",
};

const TEMPLATE_COLORS: Record<CVTemplate, string> = {
  modern: "bg-slate-100 text-slate-700",
  classic: "bg-amber-50 text-amber-700",
  minimal: "bg-gray-100 text-gray-600",
  executive: "bg-blue-50 text-blue-700",
};

export function DashboardClient({ user, cvs: initialCVs }: { user: User; cvs: CV[] }) {
  const router = useRouter();
  const [cvs, setCVs] = useState(initialCVs);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function createCV() {
    setCreating(true);
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled CV", template: "modern" }),
    });
    const cv = await res.json();
    setCreating(false);
    router.push(`/builder/${cv.id}`);
  }

  async function deleteCV(id: string) {
    if (!confirm("Delete this CV? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/cv/${id}`, { method: "DELETE" });
    setCVs((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-800 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">CV</span>
            </div>
            <span className="font-semibold text-gray-900">CV Builder</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My CVs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {cvs.length} {cvs.length === 1 ? "CV" : "CVs"} saved
            </p>
          </div>
          <button
            onClick={createCV}
            disabled={creating}
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {creating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>+ New CV</>
            )}
          </button>
        </div>

        {cvs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No CVs yet</h2>
            <p className="text-gray-400 mb-6">Create your first CV to get started</p>
            <button
              onClick={createCV}
              className="bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              + Create my first CV
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Preview thumbnail */}
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100 relative">
                  <span className="text-4xl opacity-40">📄</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm truncate flex-1 mr-2">{cv.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TEMPLATE_COLORS[cv.template as CVTemplate] ?? "bg-gray-100 text-gray-600"}`}>
                      {TEMPLATE_LABELS[cv.template as CVTemplate] ?? cv.template}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Updated {new Date(cv.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/builder/${cv.id}`}
                      className="flex-1 text-center bg-slate-800 text-white text-xs py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCV(cv.id)}
                      disabled={deleting === cv.id}
                      className="px-3 py-2 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
                    >
                      {deleting === cv.id ? "..." : "🗑"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
