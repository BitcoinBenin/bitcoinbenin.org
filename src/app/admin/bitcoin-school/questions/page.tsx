'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { FaPlus, FaTrash, FaArrowLeft, FaQuestionCircle, FaSave, FaEdit } from 'react-icons/fa';
import { getQuestions, saveQuestion, deleteQuestion, Question } from '../school-actions';

export default function BitcoinSchoolQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Question>>({
    question_text: '',
    options: ['', '', ''],
    correct_option_index: 0,
    points: 1
  });
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login?redirectTo=/admin/bitcoin-school/questions');
        return;
      }
      fetchData();
    };
    init();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getQuestions();
    if (result.success) {
      setQuestions(result.data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question_text || form.options?.some(opt => !opt)) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const result = await saveQuestion(editingId ? { ...form, id: editingId } : form);
    if (result.success) {
      setShowForm(false);
      setEditingId(null);
      setForm({
        question_text: '',
        options: ['', '', ''],
        correct_option_index: 0,
        points: 1
      });
      fetchData();
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const startEdit = (q: Question) => {
    setForm(q);
    setEditingId(q.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette question ?')) {
      const result = await deleteQuestion(id);
      if (result.success) {
        setQuestions(questions.filter(q => q.id !== id));
      }
    }
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <button 
              onClick={() => router.push('/admin/bitcoin-school')}
              className="flex items-center gap-2 text-gray-400 hover:text-brand-green mb-4 transition-colors font-medium"
            >
              <FaArrowLeft /> Retour Bitcoin School
            </button>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Gestion du 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-3">
                QCM
              </span>
            </h1>
            <p className="text-xl text-gray-400">Configurez les questions de l&apos;examen final.</p>
          </div>
          <Button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm({ question_text: '', options: ['', '', ''], correct_option_index: 0, points: 1 });
            }} 
            variant="primary" 
            className="flex items-center gap-2"
          >
            <FaPlus /> Nouvelle Question
          </Button>
        </div>

        {showForm && (
          <Card className="mb-12 p-8 bg-brand-charcoal border border-white/10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <FaQuestionCircle className="text-brand-green" />
              {editingId ? 'Modifier la question' : 'Nouvelle question'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Texte de la question</label>
                <textarea
                  className="w-full bg-brand-dark border border-white/10 p-4 rounded-xl text-white focus:border-brand-green transition-colors resize-none"
                  rows={3}
                  value={form.question_text}
                  onChange={e => setForm({...form, question_text: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {form.options?.map((opt, idx) => (
                  <div key={idx} className="relative">
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
                      Option {String.fromCharCode(65 + idx)}
                      <span className="flex items-center gap-2 cursor-pointer text-[10px]" onClick={() => setForm({...form, correct_option_index: idx})}>
                        {form.correct_option_index === idx ? (
                          <span className="text-brand-green bg-brand-green/10 px-2 py-1 rounded">CORRECTE</span>
                        ) : (
                          <span className="text-gray-600 hover:text-gray-400">MARQUER COMME CORRECTE</span>
                        )}
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`w-full bg-brand-dark border p-4 rounded-xl text-white transition-all ${
                        form.correct_option_index === idx ? 'border-brand-green/50 shadow-glow' : 'border-white/10 focus:border-white/30'
                      }`}
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(form.options || [])];
                        newOpts[idx] = e.target.value;
                        setForm({...form, options: newOpts});
                      }}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button type="submit" variant="primary" className="flex items-center gap-2">
                  <FaSave /> Enregistrer
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Chargement des questions...</div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-brand-charcoal/30 border border-white/5 rounded-3xl">
              Aucune question configurée pour le moment.
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="group bg-brand-charcoal border border-white/5 p-6 rounded-2xl hover:border-brand-green/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white">{q.question_text}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(q)} className="p-3 bg-brand-dark hover:bg-brand-green/20 text-gray-400 hover:text-brand-green rounded-xl transition-all">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-3 bg-brand-dark hover:bg-red-400/20 text-gray-400 hover:text-red-400 rounded-xl transition-all">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-14">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className={`p-4 rounded-xl text-sm border ${
                      q.correct_option_index === oIdx 
                        ? 'bg-brand-green/5 border-brand-green/20 text-brand-green' 
                        : 'bg-brand-dark border-white/5 text-gray-500'
                    }`}>
                      <span className="font-bold mr-3">{String.fromCharCode(65 + oIdx)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
