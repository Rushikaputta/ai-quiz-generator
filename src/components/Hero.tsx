import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Brain } from "lucide-react";

interface HeroProps {
  onGenerateQuiz: (topic: string, difficulty: string, questionCount: number) => void;
  isGenerating: boolean;
}

const Hero = ({ onGenerateQuiz, isGenerating }: HeroProps) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerateQuiz(topic, difficulty, questionCount);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,109,255,0.1),transparent_50%)]" />
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Quiz Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Generate Custom Quizzes
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Harness the power of AI to create personalized quizzes on any topic. 
            Perfect for learning, teaching, or testing your knowledge.
          </p>
        </div>

        <Card className="p-8 shadow-card border-primary/20 backdrop-blur-sm bg-card/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-base">What topic would you like to learn?</Label>
              <Input
                id="topic"
                placeholder="e.g., JavaScript, World History, Biology..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-base">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions" className="text-base">Number of Questions</Label>
                <Select value={questionCount.toString()} onValueChange={(v) => setQuestionCount(Number(v))}>
                  <SelectTrigger id="questions" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Hero;