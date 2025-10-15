import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import QuizDisplay from "@/components/QuizDisplay";
import QuizResults from "@/components/QuizResults";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

type Question = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
};

type QuizState = "home" | "quiz" | "results";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [quizId, setQuizId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGenerateQuiz = async (topic: string, difficulty: string, questionCount: number) => {
    if (!session) {
      toast.error("Please sign in to generate quizzes");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { topic, difficulty, questionCount },
      });

      if (error) throw error;

      setQuestions(data.questions);
      setQuizTitle(data.quiz.title);
      setQuizId(data.quiz.id);
      setQuizState("quiz");
      toast.success("Quiz generated successfully!");
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      if (error.message?.includes("429")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else {
        toast.error("Failed to generate quiz. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizComplete = async (score: number) => {
    setFinalScore(score);
    setQuizState("results");

    if (quizId && session) {
      try {
        await supabase.from("quiz_attempts").insert({
          quiz_id: quizId,
          user_id: session.user.id,
          score,
          total_questions: questions.length,
        });
      } catch (error) {
        console.error("Error saving quiz attempt:", error);
      }
    }
  };

  const handleRestart = () => {
    setQuizState("home");
    setQuestions([]);
    setQuizTitle("");
    setFinalScore(0);
    setQuizId(null);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        {quizState === "home" && (
          <Hero onGenerateQuiz={handleGenerateQuiz} isGenerating={isGenerating} />
        )}
        {quizState === "quiz" && (
          <QuizDisplay
            questions={questions}
            quizTitle={quizTitle}
            onComplete={handleQuizComplete}
            onRestart={handleRestart}
          />
        )}
        {quizState === "results" && (
          <QuizResults
            score={finalScore}
            totalQuestions={questions.length}
            onRestart={handleRestart}
            onHome={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
