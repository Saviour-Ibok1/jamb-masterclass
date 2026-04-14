import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Calculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const handleNumber = (n: string) => {
    if (resetNext) {
      setDisplay(n);
      setResetNext(false);
    } else {
      setDisplay(display === "0" ? n : display + n);
    }
  };

  const handleOp = (operator: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !resetNext) {
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(operator);
    setResetNext(true);
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prev !== null && op) {
      const current = parseFloat(display);
      const result = calculate(prev, current, op);
      setDisplay(String(parseFloat(result.toFixed(10))));
      setPrev(null);
      setOp(null);
      setResetNext(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setResetNext(false);
  };

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-primary-foreground shadow-gold-lg transition-transform hover:scale-110"
        title="Calculator"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-72 rounded-2xl bg-card p-4 shadow-gold-lg border border-border"
          >
            <div className="mb-3 rounded-xl bg-secondary p-4 text-right">
              <div className="text-xs text-muted-foreground h-4">
                {prev !== null && op ? `${prev} ${op}` : ""}
              </div>
              <div className="text-2xl font-bold text-foreground truncate">{display}</div>
            </div>

            <div className="grid gap-2">
              {buttons.map((row, ri) => (
                <div key={ri} className="grid grid-cols-4 gap-2">
                  {row.map((btn) => {
                    const isOp = ["+", "-", "×", "÷"].includes(btn);
                    const isEquals = btn === "=";
                    const isZero = btn === "0";
                    return (
                      <button
                        key={btn}
                        onClick={() => {
                          if (btn === "C") handleClear();
                          else if (btn === "=") handleEquals();
                          else if (btn === "±") setDisplay(String(-parseFloat(display)));
                          else if (btn === "%") setDisplay(String(parseFloat(display) / 100));
                          else if (isOp) handleOp(btn);
                          else handleNumber(btn);
                        }}
                        className={`
                          flex h-12 items-center justify-center rounded-xl text-base font-semibold transition-all active:scale-95
                          ${isZero ? "col-span-2" : ""}
                          ${isEquals ? "gradient-gold text-primary-foreground" : ""}
                          ${isOp ? "bg-primary text-primary-foreground" : ""}
                          ${!isOp && !isEquals && btn !== "C" && btn !== "±" && btn !== "%" ? "bg-secondary text-foreground hover:bg-muted" : ""}
                          ${["C", "±", "%"].includes(btn) ? "bg-muted text-foreground" : ""}
                        `}
                      >
                        {btn}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
