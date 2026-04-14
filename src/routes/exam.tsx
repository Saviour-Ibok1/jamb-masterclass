import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useEffect } from "react";
import { generateExamSession, EXAM_SUBJECTS, generateEnglishQuestions, getRandomQuestions } from "@/data/questions";
import { useExamEngine } from "@/hooks/useExamEngine";
import { TimerDisplay } from "@/components/TimerDisplay";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionNav } from "@/components/QuestionNav";
import { SubjectTabs } from "@/components/SubjectTabs";
import { Calculator } from "@/components/Calculator";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/exam")({
  component: ExamPage,
});

function ExamPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const mode = (searchParams.get("mode") as "practice" | "full") || "full";
  const practiceSubject = searchParams.get("subject") || "Biology";

  const [phase, setPhase] = useState<"exam" | "result" | "review">("exam");
  const [reviewSubject, setReviewSubject] = useState<string>("");
  const [rqi, setRqi] = useState(0);

  const sessionData = useMemo(() => {
    if (mode === "practice") {
      const questions = practiceSubject === "English"
        ? generateEnglishQuestions()
        : getRandomQuestions(practiceSubject, 40);
      return { [practiceSubject]: questions };
    }
    return generateExamSession([...EXAM_SUBJECTS]);
  }, [mode, practiceSubject]);

  const subjects = Object.keys(sessionData);

  const handleTimeUp = useCallback(() => setPhase("result"), []);

  const { state, activeSubjectState, selectAnswer, goToQuestion, switchSubject, submitExam, calculateScores } = useExamEngine(mode, sessionData, handleTimeUp);

  const handleSubmit = () => {
    submitExam();
    setPhase("result");
  };

  const scores = phase !== "exam" ? calculateScores() : null;

  useEffect(() => {
    if (scores && scores.overallPercentage >= 70) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#D4A017", "#E8751A", "#FFD700"] });
    }
  }, [scores]);

  if (phase === "review") {
    const subj = reviewSubject || subjects[0];
    const subjState = state.subjects[subj];
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient-gold">Review: {subj}</h1>
            <button onClick={() => setPhase("result")} className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">Back to Results</button>
          </div>
          {subjects.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {subjects.map(s => (
                <button key={s} onClick={() => { setReviewSubject(s); setRqi(0); }} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${s === subj ? "gradient-gold text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{s}</button>
              ))}
            </div>
          )}
          <QuestionCard question={subjState.questions[rqi]} questionIndex={rqi} totalQuestions={subjState.questions.length} selectedAnswer={subjState.answers[rqi]} isReview onSelectAnswer={() => {}} />
          <div className="mt-4 flex gap-3 justify-center">
            <button disabled={rqi === 0} onClick={() => setRqi(rqi - 1)} className="rounded-xl bg-secondary px-6 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
            <button disabled={rqi >= subjState.questions.length - 1} onClick={() => setRqi(rqi + 1)} className="rounded-xl gradient-gold px-6 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">Next</button>
          </div>
          <div className="mt-4">
            <QuestionNav totalQuestions={subjState.questions.length} currentQuestion={rqi} answers={subjState.answers} onNavigate={setRqi} />
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result" && scores) {
    const passed = scores.overallPercentage >= 70;
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card p-8 shadow-gold-lg text-center">
            {passed && (
              <div className="mb-4 text-5xl">🎉</div>
            )}
            <h1 className="text-3xl font-bold text-gradient-gold mb-2">
              {passed ? "Excellent! You're JAMB Ready!" : "Keep Practicing!"}
            </h1>
            <div className="my-6">
              <div className="text-6xl font-extrabold text-foreground">{scores.scaledScore}</div>
              <div className="text-lg text-muted-foreground">out of {scores.maxScore}</div>
              <div className="mt-1 text-sm text-muted-foreground">({scores.overallPercentage.toFixed(1)}%)</div>
            </div>
            <div className="space-y-3 text-left mb-8">
              {Object.entries(scores.scores).map(([name, s]) => (
                <div key={name} className="flex items-center justify-between rounded-xl bg-secondary p-4">
                  <span className="font-semibold">{name}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full gradient-gold transition-all" style={{ width: `${s.percentage}%` }} />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">{s.correct}/{s.total}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => { setReviewSubject(subjects[0]); setPhase("review"); }} className="rounded-xl gradient-gold px-6 py-3 font-semibold text-primary-foreground shadow-gold">Review Answers</button>
              <button onClick={() => navigate({ to: "/" })} className="rounded-xl bg-secondary px-6 py-3 font-semibold text-secondary-foreground">Back to Home</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Exam phase
  const currentQ = activeSubjectState.questions[activeSubjectState.currentQuestion];
  const answeredCount = Object.keys(activeSubjectState.answers).length;
  const totalAnswered = Object.values(state.subjects).reduce((sum, s) => sum + Object.keys(s.answers).length, 0);
  const totalQs = Object.values(state.subjects).reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gradient-gold hidden sm:block">JAMB Simulator</h1>
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{mode === "full" ? "Full Exam" : "Practice"}</span>
          </div>
          <TimerDisplay timeRemaining={activeSubjectState.timeRemaining} subjectName={state.activeSubject} />
          <button onClick={handleSubmit} className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">Submit</button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        {/* Subject tabs */}
        {mode === "full" && (
          <div className="mb-4">
            <SubjectTabs subjects={subjects} activeSubject={state.activeSubject} subjectStates={state.subjects} onSwitch={switchSubject} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            {currentQ && (
              <QuestionCard
                question={currentQ}
                questionIndex={activeSubjectState.currentQuestion}
                totalQuestions={activeSubjectState.questions.length}
                selectedAnswer={activeSubjectState.answers[activeSubjectState.currentQuestion]}
                onSelectAnswer={(idx) => selectAnswer(activeSubjectState.currentQuestion, idx)}
              />
            )}
            <div className="mt-4 flex justify-between">
              <button disabled={activeSubjectState.currentQuestion === 0} onClick={() => goToQuestion(activeSubjectState.currentQuestion - 1)} className="rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground disabled:opacity-40">Previous</button>
              <button disabled={activeSubjectState.currentQuestion >= activeSubjectState.questions.length - 1} onClick={() => goToQuestion(activeSubjectState.currentQuestion + 1)} className="rounded-xl gradient-gold px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-40">Next</button>
            </div>
          </div>

          <div className="hidden lg:block">
            <QuestionNav totalQuestions={activeSubjectState.questions.length} currentQuestion={activeSubjectState.currentQuestion} answers={activeSubjectState.answers} onNavigate={goToQuestion} />
            <div className="mt-4 rounded-2xl bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Progress</h3>
              <div className="text-2xl font-bold text-foreground">{totalAnswered}/{totalQs}</div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full gradient-gold transition-all" style={{ width: `${(totalAnswered / totalQs) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="mt-4 lg:hidden">
          <QuestionNav totalQuestions={activeSubjectState.questions.length} currentQuestion={activeSubjectState.currentQuestion} answers={activeSubjectState.answers} onNavigate={goToQuestion} />
        </div>
      </div>

      <Calculator />
    </div>
  );
}
