import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { StepCard } from "../components/brief/StepCard";
import { FormField } from "../components/brief/FormField";

const initialState = {
  clientName: "",
  industry: "",
  website: "",
  competitors: "",
  objective: "awareness",
  targetAudience: "",
  budget: "",
  tone: "",
  imageryStyle: "",
  colorDirection: "",
  dosDonts: ""
};

const steps = [
  { id: 1, title: "Client details", description: "Step 1 of 4" },
  { id: 2, title: "Campaign objective", description: "Step 2 of 4" },
  { id: 3, title: "Creative preferences", description: "Step 3 of 4" },
  { id: 4, title: "Review & submit", description: "Step 4 of 4" }
];

export function CreativeBriefPage() {
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const printRef = useRef(null);

  const summary = useMemo(
    () => [
      ["Client", form.clientName],
      ["Industry", form.industry],
      ["Website", form.website],
      ["Competitors", form.competitors],
      ["Objective", form.objective],
      ["Audience", form.targetAudience],
      ["Budget", form.budget],
      ["Tone", form.tone],
      ["Imagery style", form.imageryStyle],
      ["Color direction", form.colorDirection],
      ["Do / don't", form.dosDonts]
    ],
    [form]
  );

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL || "http://localhost:4010"}/generate/brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("The AI service could not generate a brief right now.");
      }

      setResult(await response.json());
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = async () => {
    if (!printRef.current) {
      return;
    }

    const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 10, 10, width, height);
    pdf.save("creative-direction.pdf");
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <StepCard title="Client details" description="Step 1 of 4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Client name" value={form.clientName} onChange={(e) => updateField("clientName", e.target.value)} />
            <FormField label="Industry" value={form.industry} onChange={(e) => updateField("industry", e.target.value)} />
          </div>
          <FormField label="Website" value={form.website} onChange={(e) => updateField("website", e.target.value)} />
          <FormField label="Key competitors" as="textarea" value={form.competitors} onChange={(e) => updateField("competitors", e.target.value)} />
        </StepCard>
      );
    }

    if (step === 2) {
      return (
        <StepCard title="Campaign objective" description="Step 2 of 4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Objective"
              as="select"
              value={form.objective}
              onChange={(e) => updateField("objective", e.target.value)}
              options={[
                { label: "Awareness", value: "awareness" },
                { label: "Consideration", value: "consideration" },
                { label: "Conversion", value: "conversion" }
              ]}
            />
            <FormField label="Budget (USD)" value={form.budget} onChange={(e) => updateField("budget", e.target.value)} />
          </div>
          <FormField label="Target audience" as="textarea" value={form.targetAudience} onChange={(e) => updateField("targetAudience", e.target.value)} />
        </StepCard>
      );
    }

    if (step === 3) {
      return (
        <StepCard title="Creative preferences" description="Step 3 of 4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Tone" value={form.tone} onChange={(e) => updateField("tone", e.target.value)} />
            <FormField label="Imagery style" value={form.imageryStyle} onChange={(e) => updateField("imageryStyle", e.target.value)} />
          </div>
          <FormField label="Color direction" value={form.colorDirection} onChange={(e) => updateField("colorDirection", e.target.value)} />
          <FormField label="Do's and don'ts" as="textarea" value={form.dosDonts} onChange={(e) => updateField("dosDonts", e.target.value)} />
        </StepCard>
      );
    }

    return (
      <StepCard title="Review & submit" description="Step 4 of 4">
        <div className="grid gap-3 md:grid-cols-2">
          {summary.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-ink-50 px-4 py-4 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-500 dark:text-ink-300">{label}</p>
              <p className="mt-2 text-sm text-ink-900 dark:text-white">{value || "Not provided yet"}</p>
            </div>
          ))}
        </div>
      </StepCard>
    );
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">Task 1.2</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-950 dark:text-white">AI-Assisted Creative Brief Builder</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/70 p-5 shadow-panel backdrop-blur dark:bg-ink-900/80">
          <div className="space-y-3">
            {steps.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl px-4 py-4 ${
                  item.id === step ? "bg-ink-950 text-white" : "bg-ink-50 text-ink-700 dark:bg-white/5 dark:text-ink-100"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">{item.description}</p>
                <p className="mt-2 text-sm font-semibold">{item.title}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {renderStep()}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 1))}
              disabled={step === 1}
              className="rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm font-semibold text-ink-900 shadow-panel disabled:opacity-50 dark:bg-ink-900/80 dark:text-white"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(current + 1, 4))}
                className="rounded-2xl bg-ink-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-ink-950"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate creative direction"}
              </button>
            )}
          </div>

          {error && <div className="rounded-2xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</div>}

          {result && (
            <div ref={printRef} className="rounded-[28px] border border-white/10 bg-white p-8 shadow-panel">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-ink-500">AI Creative Direction</p>
                  <h2 className="mt-3 text-3xl font-semibold text-ink-950">{result.campaignTitle}</h2>
                </div>
                <button type="button" onClick={exportPdf} className="rounded-2xl bg-ink-950 px-4 py-3 text-sm font-semibold text-white">
                  Export as PDF
                </button>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <section>
                  <h3 className="text-lg font-semibold text-ink-950">Headline options</h3>
                  <ul className="mt-3 space-y-3 text-sm text-ink-700">
                    {result.headlines.map((headline) => (
                      <li key={headline} className="rounded-2xl bg-ink-50 px-4 py-3">
                        {headline}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-ink-950">Tone of voice guide</h3>
                  <p className="mt-3 rounded-2xl bg-ink-50 px-4 py-4 text-sm leading-7 text-ink-700">{result.toneGuide}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-ink-950">Channel allocation</h3>
                  <div className="mt-3 space-y-3">
                    {result.channels.map((channel) => (
                      <div key={channel.name} className="rounded-2xl bg-ink-50 px-4 py-4">
                        <div className="flex items-center justify-between text-sm font-semibold text-ink-900">
                          <span>{channel.name}</span>
                          <span>{channel.allocation}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-ink-950">Hero visual direction</h3>
                  <p className="mt-3 rounded-2xl bg-ink-50 px-4 py-4 text-sm leading-7 text-ink-700">{result.heroVisual}</p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
