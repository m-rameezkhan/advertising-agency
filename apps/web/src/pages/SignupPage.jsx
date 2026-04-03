import React, { useState } from "react";

export function SignupPage({ onSubmit, onNavigate, submitting, error }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-white/88 p-7 shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur dark:bg-slate-950/84">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-300">Create account</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">New workspace user</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Create a clean account for dashboard access.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(form);
          }}
        >
          <input
            className="input-field w-full"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Full name"
          />
          <input
            className="input-field w-full"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email address"
          />
          <input
            className="input-field w-full"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Password (min 8 characters)"
          />

          {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-100">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-ink-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-900 disabled:opacity-60 dark:bg-white dark:text-ink-950"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-300">
          Already have an account?{" "}
          <button type="button" onClick={() => onNavigate("/login")} className="font-semibold text-sky">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
