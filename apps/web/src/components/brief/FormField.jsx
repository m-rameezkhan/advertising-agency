import React from "react";

export function FormField({ label, as = "input", options = [], ...props }) {
  const className =
    "mt-2 w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-ink-400 dark:border-white/10 dark:bg-ink-950 dark:text-white";

  if (as === "textarea") {
    return (
      <label className="block">
        <span className="text-sm font-medium text-ink-700 dark:text-ink-100">{label}</span>
        <textarea className={`${className} min-h-28`} {...props} />
      </label>
    );
  }

  if (as === "select") {
    return (
      <label className="block">
        <span className="text-sm font-medium text-ink-700 dark:text-ink-100">{label}</span>
        <select className={className} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700 dark:text-ink-100">{label}</span>
      <input className={className} {...props} />
    </label>
  );
}
