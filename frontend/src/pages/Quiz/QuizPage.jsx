import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Timer from '../../components/Timer.jsx';
import QuestionCard from '../../components/QuestionCard.jsx';

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const DURATION = 20 * 60; // 20 minutes

  useEffect(() => {
    axios.get(`/quiz/${quizId}`)
      .then(res => setQuiz(res.data))
      .catch(console.error);
  }, [quizId]);

  const handleSelect = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = useCallback(async (timeTaken) => {
    setLoading(true);
    const answersArr = quiz.questions.map((_, i) => answers[i] ?? -1);
    try {
      const res = await axios.post(`/quiz/submit/${quizId}`, {
        answers: answersArr,
        timeTaken
      });
      navigate(`/results/${quizId}`, { state: res.data });
    } catch (err) {
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  }, [answers, quiz, quizId, navigate]);

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{quiz.title}</h2>
        <Timer duration={DURATION} onExpire={t => handleSubmit(t)} />
      </div>

      {quiz.questions.map((q, qIdx) => (
        <QuestionCard
          key={qIdx}
          qIdx={qIdx}
          question={q}
          selected={answers[qIdx]}
          onSelect={handleSelect}
        />
      ))}

      <button
        onClick={() => handleSubmit(null)}
        disabled={loading}
        style={{
          padding: '0.75rem 2rem',
          background: '#1D9E75',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        {loading ? 'Submitting...' : 'Submit Exam'}
      </button>
    </div>
  );
}