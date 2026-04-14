import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { EXAM_SUBJECTS } from "@/data/questions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "JAMB Simulator - Practice CBT Exam" },
      { name: "description", content: "Realistic JAMB CBT simulator with Biology, Chemistry, Physics, and English questions. Practice for your JAMB UTME exam." },
    ],
  }),
});

const practiceSubjects = ["Biology", "Chemistry", "Physics", "English"];

function Index() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("Biology");

  const startFullExam = () => {
    navigate({ to: "/exam", search: { mode: "full" } as any });
  };

  const startPractice = () => {
    navigate({ to: "/exam", search: { mode: "practice", subject: selectedSubject } as any });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="gradient-gold px-4 pb-16 pt-12 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-4 text-5xl">📚</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-foreground tracking-tight">
              JAMB Simulator
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg mx-auto">
              Experience the real JAMB CBT exam. Practice with 300+ questions across Biology, Chemistry, Physics & English.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 -mt-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full Exam Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl bg-card p-8 shadow-gold-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-gold text-2xl">🎯</div>
            <h2 className="text-2xl font-bold text-card-foreground">Full Exam Mode</h2>
            <p className="mt-2 text-muted-foreground">
              4 subjects • 40 questions each (English = 60) • 30 min per subject • Score out of 400
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Switch between subjects freely
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Independent timers per subject
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Detailed score breakdown
              </li>
            </ul>
            <button onClick={startFullExam} className="mt-6 w-full rounded-xl gradient-gold px-6 py-3.5 text-base font-bold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Start Full Exam
            </button>
          </motion.div>

          {/* Practice Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl bg-card p-8 shadow-gold-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-2xl">📝</div>
            <h2 className="text-2xl font-bold text-card-foreground">Practice Mode</h2>
            <p className="mt-2 text-muted-foreground">
              Pick a subject • 40 questions (English = 60) • 30 min timer • Score out of 100
            </p>
            <div className="mt-4">
              <label className="text-sm font-semibold text-muted-foreground">Select Subject</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {practiceSubjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      selectedSubject === s
                        ? "gradient-gold text-primary-foreground shadow-gold"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={startPractice} className="mt-6 w-full rounded-xl bg-foreground px-6 py-3.5 text-base font-bold text-background transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Start Practice
            </button>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mt-12 mb-16 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "⏱️", title: "Timed Sessions", desc: "30-minute countdown per subject with visual urgency" },
            { icon: "🧮", title: "Built-in Calculator", desc: "Floating calculator for quick calculations" },
            { icon: "📊", title: "Detailed Results", desc: "Score breakdown with answer review" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="rounded-2xl bg-card p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-card-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
