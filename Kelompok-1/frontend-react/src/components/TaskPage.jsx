import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTasks, createTask, deleteTask, updateTask, getProfile } from '../api/api';

export default function TaskPage({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [time, setTime] = useState(new Date());
  const [mood, setMood] = useState('😊');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    loadInitialData();
    return () => clearInterval(timer);
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true); 
    try {
      const [tRes, uRes] = await Promise.all([getTasks(token), getProfile(token)]);
      setTasks(tRes.data || []);
      setUser(uRes.data);
    } catch (err) { 
      console.error(err); 
    } finally {
      setIsLoading(false); 
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    await createTask(token, { title });
    setTitle('');
    await loadInitialData();
    toast.success('Task Bloomed! 🌸');
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'active') return !t.isCompleted && matchesSearch;
    if (filter === 'done') return t.isCompleted && matchesSearch;
    return matchesSearch;
  });

  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0;

  return (
    <div className="main-wrapper">
      {/* Animasi Kelopak */}
      <div className="petal" style={{ top: '10%', left: '5%' }}>🌸</div>
      <div className="petal" style={{ bottom: '20%', right: '10%', animationDelay: '2s' }}>🌸</div>
      <div className="petal" style={{ top: '40%', right: '5%', animationDelay: '4s' }}>✨</div>

      {/* SIDEBAR */}
      <div className="side-widgets">
        <div className="widget-box">
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Welcome back,</p>
          <h2 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '24px' }}>{user?.name || 'Gardener'} ✿</h2>
        </div>

        <div className="widget-box" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: '14px' }}>{time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
        </div>

        <div className="widget-box" style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>How's your mood?</p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {['😊', '😐', '😫', '🌸'].map(m => (
              <button key={m} onClick={() => setMood(m)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>{m}</button>
            ))}
          </div>
          <p style={{ fontSize: '11px', marginTop: '10px', opacity: 0.6 }}>Current: {mood}</p>
        </div>

        <div className="widget-box">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '18px' }}>☀️ 30°C</span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>Bandung, ID</span>
          </div>
        </div>
      </div>

      {/* KOTAK UTAMA */}
      <div className="card">
        <h1 className="app-title">Blossom Tasks</h1>
        <p className="welcome-text">Your Garden of Productivity</p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <div style={{ flex: 1, background: '#fdfbff', padding: '12px', borderRadius: '20px', border: '1px solid #eee' }}>
            <div style={{ color: 'var(--purple-dark)', fontWeight: 'bold', fontSize: '20px' }}>{tasks.length}</div>
            <div style={{ fontSize: '9px', opacity: 0.6 }}>TOTAL</div>
          </div>
          <div style={{ flex: 1, background: '#fdfbff', padding: '12px', borderRadius: '20px', border: '1px solid #eee' }}>
            <div style={{ color: 'var(--purple-dark)', fontWeight: 'bold', fontSize: '20px' }}>{progress}%</div>
            <div style={{ fontSize: '9px', opacity: 0.6 }}>PROGRESS</div>
          </div>
        </div>

        {/* INPUT AREA */}
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task..." style={{ marginBottom: 0 }} />
          <button type="submit" className="main-btn" style={{ width: '80px' }}>Add</button>
        </form>

        {/* SEARCH BAR (BARU) */}
        <input 
          className="search-input" 
          placeholder="🔍 Search tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {['all', 'active', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'var(--secondary)' : 'transparent', color: 'var(--purple-dark)', fontSize: '11px', border: 'none', borderRadius: '10px', padding: '5px 12px', cursor: 'pointer' }}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LOADING STATE & TASK LIST */}
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="loading-text">
              <div className="spinner"></div>
              Sedang menanam tugas...
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="task-item">
                <input type="checkbox" checked={task.isCompleted} onChange={async () => { await updateTask(token, task.id, { isCompleted: !task.isCompleted }); loadInitialData(); }} style={{ marginRight: '10px', width: '18px', height: '18px' }} />
                <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', textDecoration: task.isCompleted ? 'line-through' : 'none', opacity: task.isCompleted ? 0.5 : 1 }}>
                  {task.title}
                </span>
                <button onClick={async () => { await deleteTask(token, task.id); loadInitialData(); }} className="delete-btn">✕</button>
              </div>
            ))
          )}
          {!isLoading && filteredTasks.length === 0 && (
            <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '20px' }}>No seeds found here 🍃</p>
          )}
        </div>

        <button onClick={onLogout} style={{ width: '100%', marginTop: '20px', background: 'none', border: '1px solid #eee', color: '#ccc', borderRadius: '15px', padding: '8px', fontSize: '10px', cursor: 'pointer' }}>
          LOGOUT ACCOUNT
        </button>
      </div>
    </div>
  );
}