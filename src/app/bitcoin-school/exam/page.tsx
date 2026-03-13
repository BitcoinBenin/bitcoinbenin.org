'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { FaArrowRight, FaClock, FaCheckCircle, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import { validateParticipantForExam, getExamQuestions, submitExamResult, Question } from './exam-actions';

export default function BitcoinExamPage() {
  const [step, setStep] = useState<'login' | 'quiz' | 'result'>('login');
  const [email, setEmail] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await validateParticipantForExam(email);
    if (result.success) {
      setParticipantId(result.participantId!);
      const quizData = await getExamQuestions();
      if (quizData.success && quizData.questions && quizData.questions.length > 0) {
        setQuestions(quizData.questions);
        setStep('quiz');
        setStartTime(Date.now());
      } else {
        setError('Aucune question disponible. Contactez l\'organisateur.');
      }
    } else {
      setError(result.error || 'Erreur d\'identification.');
    }
    setLoading(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_option_index) {
        finalScore++;
      }
    });

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    const result = await submitExamResult(participantId, finalScore, durationSeconds);
    
    if (result.success) {
      setScore(result.totalScore!); // Utiliser le score calculé incluant la présence
      setStep('result');
    } else {
      alert('Erreur lors de l\'enregistrement : ' + result.error);
    }
    setLoading(false);
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-brand-charcoal border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green text-3xl mx-auto mb-4">
              <FaUser />
            </div>
            <h1 className="text-3xl font-display font-black text-white">Bitcoin Exam</h1>
            <p className="text-gray-400 mt-2">Identifiez-vous pour commencer</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Adresse E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green transition-colors"
                placeholder="votre@email.com"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-3">
                <FaExclamationTriangle />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button variant="primary" size="lg" className="w-full py-4" type="submit" disabled={loading}>
              {loading ? 'Chargement...' : 'Commencer l\'examen'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-brand-dark p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-4 text-gray-400 text-sm">
            <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
            <div className="flex items-center gap-2">
              <FaClock /> 
              <span>{Math.floor((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>
          <div className="w-full h-2 bg-brand-charcoal rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-brand-green transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <Card className="p-8 bg-brand-charcoal border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-8">{q.question_text}</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`
                    w-full text-left p-5 rounded-xl border transition-all
                    ${answers[currentQuestionIndex] === idx
                      ? 'bg-brand-green/10 border-brand-green text-brand-green'
                      : 'bg-brand-dark border-white/5 text-gray-400 hover:border-white/20'
                    }
                  `}
                >
                  <span className="inline-block w-8 h-8 rounded-full border border-current flex-shrink-0 mr-4 text-center leading-7">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={nextQuestion}
              disabled={answers[currentQuestionIndex] === undefined || loading}
              className="px-10"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'} <FaArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-12 bg-brand-charcoal border border-white/10 text-center">
          <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green text-5xl mx-auto mb-8">
            <FaCheckCircle />
          </div>
          <h1 className="text-4xl font-display font-black text-white mb-4">Terminé !</h1>
          <p className="text-gray-400 mb-8">Merci d&apos;avoir participé au Bitcoin School Exam. Vos résultats ont été enregistrés.</p>
          
          <div className="bg-brand-dark rounded-3xl p-8 border border-white/5 mb-8">
            <div className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-bold">Votre Score Final</div>
            <div className="text-6xl font-display font-black text-brand-green">
              {score}<span className="text-2xl text-gray-500"> / 100</span>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Inclut les points de présence (max 16) et l&apos;examen (max 84).
            </p>
          </div>

          <p className="text-sm text-gray-500">Les gagnants seront annoncés prochainement.</p>
          <Button variant="ghost" className="mt-8" onClick={() => window.location.href = '/'}>
            Retour à l&apos;accueil
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}
