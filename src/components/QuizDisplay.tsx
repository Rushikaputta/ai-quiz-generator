import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

interface QuizDisplayProps {
  questions: Question[];
  quizTitle: string;
  onComplete: (score: number) => void;
  onRestart: () => void;
}

const QuizDisplay = ({ questions, quizTitle, onComplete, onRestart }: QuizDisplayProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleAnswerSelect = (answer: string) => {
    if (!answered[currentQuestion]) {
      setSelectedAnswer(answer);
      setShowExplanation(true);
      
      const newAnswered = [...answered];
      newAnswered[currentQuestion] = true;
      setAnswered(newAnswered);

      if (answer === question.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{quizTitle}</h2>
            <Button variant="outline" onClick={onRestart} size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Quiz
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}/{questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="p-8 shadow-card border-primary/20 animate-fade-in">
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

          <div className="space-y-3 mb-6">
            {Object.entries(question.options).map(([key, value]) => {
              const isSelected = selectedAnswer === key;
              const isCorrectAnswer = key === question.correctAnswer;
              const showCorrect = showExplanation && isCorrectAnswer;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  disabled={answered[currentQuestion]}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all",
                    "hover:border-primary/50 disabled:cursor-not-allowed",
                    isSelected && !showExplanation && "border-primary bg-primary/5",
                    showCorrect && "border-success bg-success/10",
                    showIncorrect && "border-destructive bg-destructive/10",
                    !isSelected && !showCorrect && !showIncorrect && "border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-primary">{key}.</span>
                      <span>{value}</span>
                    </div>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={cn(
              "p-4 rounded-lg mb-6 animate-fade-in",
              isCorrect ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
            )}>
              <div className="flex items-start gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                )}
                <span className="font-semibold">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">{question.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <Button
              onClick={handleNext}
              size="lg"
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {isLastQuestion ? "View Results" : "Next Question"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuizDisplay;