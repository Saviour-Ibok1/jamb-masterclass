interface SubjectTabsProps {
  subjects: string[];
  activeSubject: string;
  subjectStates: Record<string, { answers: Record<number, number>; questions: { length: number }; timeRemaining: number }>;
  onSwitch: (subject: string) => void;
}

export function SubjectTabs({ subjects, activeSubject, subjectStates, onSwitch }: SubjectTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {subjects.map((subject) => {
        const s = subjectStates[subject];
        const answered = Object.keys(s.answers).length;
        const total = s.questions.length;
        const isActive = subject === activeSubject;
        const timeUp = s.timeRemaining <= 0;

        return (
          <button
            key={subject}
            onClick={() => !timeUp && onSwitch(subject)}
            disabled={timeUp}
            className={`
              flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all
              ${isActive ? "gradient-gold text-primary-foreground shadow-gold" : ""}
              ${!isActive && !timeUp ? "bg-secondary text-secondary-foreground hover:bg-muted" : ""}
              ${timeUp ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <span>{subject}</span>
            <span className={`
              inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold
              ${isActive ? "bg-card/30 text-primary-foreground" : "bg-card text-foreground"}
            `}>
              {answered}/{total}
            </span>
          </button>
        );
      })}
    </div>
  );
}
