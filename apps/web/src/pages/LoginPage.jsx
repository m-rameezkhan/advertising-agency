import React, { useState } from "react";

export function LoginPage({ onSubmit, onNavigate, submitting, error }) {
  const [form, setForm] = useState({ email: "admin", password: "admin" });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white/88 shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur dark:bg-slate-950/84 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-slate-950 px-7 py-8 text-white">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Agency Suite</p>
          <h1 className="mt-3 text-3xl font-semibold">Operations login</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">Access campaigns, analytics, and creative tools.</p>
        </section>

        <section className="px-7 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-300">Sign in</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Use the default admin account or your own signup.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await onSubmit(form);
            }}
          >
            <input
              className="input-field w-full"
              type="text"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Username or email"
            />
            <input
              className="input-field w-full"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Password"
            />

            {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-100">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-ink-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-900 disabled:opacity-60 dark:bg-white dark:text-ink-950"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500 dark:text-slate-300">
            Need an account?{" "}
            <button type="button" onClick={() => onNavigate("/signup")} className="font-semibold text-sky">
              Create one
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
