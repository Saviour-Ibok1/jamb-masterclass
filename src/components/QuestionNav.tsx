interface QuestionNavProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, number>;
  onNavigate: (index: number) => void;
}

export function QuestionNav({ totalQuestions, currentQuestion, answers, onNavigate }: QuestionNavProps) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Question Navigator</h3>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isActive = i === currentQuestion;
          const isAnswered = i in answers;
          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`
                flex h-9 w-full items-center justify-center rounded-lg text-xs font-bold transition-all
                ${isActive ? "gradient-gold text-primary-foreground shadow-gold" : ""}
                ${!isActive && isAnswered ? "bg-success/20 text-success border border-success/30" : ""}
                ${!isActive && !isAnswered ? "bg-secondary text-muted-foreground hover:bg-muted" : ""}
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-success/20 border border-success/30" /> Answered
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-secondary" /> Unanswered
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded gradient-gold" /> Current
        </span>
      </div>
    </div>
  );
}
