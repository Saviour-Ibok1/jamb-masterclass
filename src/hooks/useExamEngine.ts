import { useState, useEffect, useCallback, useRef } from "react";
import type { Question } from "@/data/questions";

export interface SubjectState {
  questions: Question[];
  answers: Record<number, number>; // questionIndex -> optionIndex
  timeRemaining: number; // seconds
  currentQuestion: number;
}

export interface ExamState {
  mode: "practice" | "full";
  subjects: Record<string, SubjectState>;
  activeSubject: string;
  isSubmitted: boolean;
  startTime: number;
}

export function useExamEngine(
  mode: "practice" | "full",
  sessionData: Record<string, Question[]>,
  onTimeUp?: () => void
) {
  const [state, setState] = useState<ExamState>(() => {
    const subjects: Record<string, SubjectState> = {};
    for (const [name, questions] of Object.entries(sessionData)) {
      subjects[name] = {
        questions,
        answers: {},
        timeRemaining: 30 * 60, // 30 minutes
        currentQuestion: 0,
      };
    }
    const activeSubject = Object.keys(sessionData)[0];
    return {
      mode,
      subjects,
      activeSubject,
      isSubmitted: false,
      startTime: Date.now(),
    };
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Timer
  useEffect(() => {
    if (state.isSubmitted) return;

    timerRef.current = setInterval(() => {
      setState((prev) => {
        const subject = prev.subjects[prev.activeSubject];
        if (!subject || subject.timeRemaining <= 0) return prev;

        const newTime = subject.timeRemaining - 1;
        const updated = {
          ...prev,
          subjects: {
            ...prev.subjects,
            [prev.activeSubject]: { ...subject, timeRemaining: newTime },
          },
        };

        if (newTime <= 0) {
          // Check if all subjects expired
          const allExpired = Object.values(updated.subjects).every(
            (s) => s.timeRemaining <= 0
          );
          if (allExpired) {
            onTimeUpRef.current?.();
            return { ...updated, isSubmitted: true };
          }
          // Switch to next subject with time
          const nextSubject = Object.entries(updated.subjects).find(
            ([key, s]) => key !== prev.activeSubject && s.timeRemaining > 0
          );
          if (nextSubject) {
            return { ...updated, activeSubject: nextSubject[0] };
          }
        }

        return updated;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isSubmitted, state.activeSubject]);

  const selectAnswer = useCallback((questionIndex: number, optionIndex: number) => {
    setState((prev) => {
      if (prev.isSubmitted) return prev;
      const subject = prev.subjects[prev.activeSubject];
      return {
        ...prev,
        subjects: {
          ...prev.subjects,
          [prev.activeSubject]: {
            ...subject,
            answers: { ...subject.answers, [questionIndex]: optionIndex },
          },
        },
      };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [prev.activeSubject]: {
          ...prev.subjects[prev.activeSubject],
          currentQuestion: index,
        },
      },
    }));
  }, []);

  const switchSubject = useCallback((subject: string) => {
    setState((prev) => ({ ...prev, activeSubject: subject }));
  }, []);

  const submitExam = useCallback(() => {
    setState((prev) => ({ ...prev, isSubmitted: true }));
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const calculateScores = useCallback(() => {
    const scores: Record<string, { correct: number; total: number; percentage: number }> = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const [name, subjectState] of Object.entries(state.subjects)) {
      let correct = 0;
      const total = subjectState.questions.length;
      for (const [qIdx, aIdx] of Object.entries(subjectState.answers)) {
        if (subjectState.questions[Number(qIdx)].answer === aIdx) {
          correct++;
        }
      }
      scores[name] = { correct, total, percentage: (correct / total) * 100 };
      totalCorrect += correct;
      totalQuestions += total;
    }

    const maxScore = mode === "full" ? 400 : 100;
    const overallPercentage = (totalCorrect / totalQuestions) * 100;
    const scaledScore = Math.round((overallPercentage / 100) * maxScore);

    return { scores, totalCorrect, totalQuestions, overallPercentage, scaledScore, maxScore };
  }, [state.subjects, mode]);

  const activeSubjectState = state.subjects[state.activeSubject];

  return {
    state,
    activeSubjectState,
    selectAnswer,
    goToQuestion,
    switchSubject,
    submitExam,
    calculateScores,
  };
}
