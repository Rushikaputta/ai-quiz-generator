import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, RotateCcw, Home } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onHome: () => void;
}

const QuizResults = ({ score, totalQuestions, onRestart, onHome }: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent Work! 🌟";
    if (percentage >= 60) return "Great Job! 👍";
    if (percentage >= 40) return "Good Effort! 💪";
    return "Keep Practicing! 📚";
  };

  const getGrade = () => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="max-w-2xl w-full relative z-10">
        <Card className="p-12 shadow-card border-primary/20 backdrop-blur-sm bg-card/95 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-6">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>

          <h2 className="text-4xl font-bold mb-3">{getMessage()}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            You've completed the quiz!
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-lg bg-muted/50">
              <div className="text-4xl font-bold text-primary mb-2">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            
            <div className="p-6 rounded-lg bg-muted/50">
              <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            
            <div className="p-6 rounded-lg bg-muted/50">
              <div className="text-4xl font-bold text-primary mb-2">{getGrade()}</div>
              <div className="text-sm text-muted-foreground">Grade</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onHome}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Home className="w-5 h-5 mr-2" />
              New Topic
            </Button>
            
            <Button
              onClick={onRestart}
              size="lg"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;