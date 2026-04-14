import { motion } from "framer-motion";
import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  isReview?: boolean;
  onSelectAnswer: (optionIndex: number) => void;
}

const optionLabels = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  isReview = false,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-card p-6 sm:p-8 shadow-gold"
    >
      <div className="mb-6">
        <span className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <p className="mt-4 text-lg font-medium leading-relaxed text-card-foreground">
          {question.question}
        </p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrectAnswer = question.answer === idx;
          let optionStyle = "border-border bg-card hover:bg-option-hover";

          if (isReview) {
            if (isCorrectAnswer) {
              optionStyle = "border-success bg-option-correct text-foreground";
            } else if (isSelected && !isCorrectAnswer) {
              optionStyle = "border-destructive bg-option-wrong text-foreground";
            }
          } else if (isSelected) {
            optionStyle = "border-primary bg-option-selected text-foreground shadow-gold";
          }

          return (
            <motion.button
              key={idx}
              whileHover={!isReview ? { scale: 1.01 } : {}}
              whileTap={!isReview ? { scale: 0.99 } : {}}
              onClick={() => !isReview && onSelectAnswer(idx)}
              disabled={isReview}
              className={`
                flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200
                ${optionStyle}
                ${!isReview ? "cursor-pointer" : "cursor-default"}
              `}
            >
              <span
                className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold
                  ${isSelected && !isReview ? "gradient-gold text-primary-foreground" : ""}
                  ${isReview && isCorrectAnswer ? "bg-success text-success-foreground" : ""}
                  ${isReview && isSelected && !isCorrectAnswer ? "bg-destructive text-destructive-foreground" : ""}
                  ${!isSelected && !isReview ? "bg-secondary text-secondary-foreground" : ""}
                  ${isReview && !isCorrectAnswer && !isSelected ? "bg-secondary text-secondary-foreground" : ""}
                `}
              >
                {optionLabels[idx]}
              </span>
              <span className="text-base">{option}</span>
              {isReview && isCorrectAnswer && (
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isReview && isSelected && !isCorrectAnswer && (
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
