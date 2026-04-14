import { motion } from "framer-motion";

interface TimerDisplayProps {
  timeRemaining: number;
  subjectName: string;
}

export function TimerDisplay({ timeRemaining, subjectName }: TimerDisplayProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isUrgent = timeRemaining < 300; // less than 5 min
  const isCritical = timeRemaining < 60;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{subjectName}</span>
      <motion.div
        className={`
          flex items-center gap-1 rounded-xl px-4 py-2 font-mono text-lg font-bold
          ${isCritical ? "bg-destructive text-destructive-foreground timer-urgent" : ""}
          ${isUrgent && !isCritical ? "bg-accent text-accent-foreground" : ""}
          ${!isUrgent ? "bg-secondary text-secondary-foreground" : ""}
        `}
        animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </motion.div>
    </div>
  );
}
