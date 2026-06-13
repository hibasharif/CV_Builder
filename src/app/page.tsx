import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-slate-800 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">CV</span>
          </div>
          <span className="font-semibold text-gray-900">CV Builder</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
          <Link href="/auth/signin" className="bg-slate-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          ✨ AI-powered CV suggestions
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Build your perfect CV<br />
          <span className="text-slate-500">in minutes, not hours</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Choose from beautiful templates, get AI-powered content suggestions, preview in real time, and export as a polished PDF.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signin" className="bg-slate-800 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-slate-700 transition-colors">
            Create my CV — it&apos;s free
          </Link>
          <Link href="#templates" className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl text-base font-medium hover:bg-gray-50 transition-colors">
            See templates
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: "🎨", title: "4 Professional Templates", desc: "Modern, Classic, Minimal, and Executive — all designed to impress recruiters." },
          { icon: "🤖", title: "AI Writing Assistant", desc: "Get smart suggestions for summaries, job descriptions, and achievements powered by Claude AI." },
          { icon: "📄", title: "One-Click PDF Export", desc: "Download a pixel-perfect PDF version of your CV, ready to send to employers." },
          { icon: "👁️", title: "Live Preview", desc: "See exactly how your CV looks as you type — no more guessing." },
          { icon: "🔐", title: "Secure Account", desc: "Sign in with Google or email. Your CVs are saved securely in the cloud." },
          { icon: "📱", title: "Multiple CVs", desc: "Create different versions for different jobs. Manage them all from your dashboard." },
        ].map((f) => (
          <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-slate-800 text-white py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to build your CV?</h2>
        <p className="text-slate-300 mb-8 text-lg">Join thousands of professionals who landed their dream job.</p>
        <Link href="/auth/signin" className="bg-white text-slate-800 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors">
          Start for free →
        </Link>
      </section>
    </main>
  );
}
