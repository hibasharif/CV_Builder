import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-sm font-bold">CV</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your CVs</p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
            Continue with Google
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative text-center"><span className="bg-white px-3 text-xs text-gray-400">or use email</span></div>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            const email = formData.get("email") as string;
            await signIn("resend", { email, redirectTo: "/dashboard" });
          }}
          className="space-y-3"
        >
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button
            type="submit"
            className="w-full bg-slate-800 text-white rounded-xl py-3 text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Send magic link
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in you agree to our Terms of Service
        </p>
      </div>
    </main>
  );
}
