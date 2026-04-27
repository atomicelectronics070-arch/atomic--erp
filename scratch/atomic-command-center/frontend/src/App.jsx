import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Loader2,
  RefreshCw,
  Copy,
  User as UserIcon
} from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

function App() {
  const [view, setView] = useState('dashboard'); // dashboard, chats
  const [activeAccount, setActiveAccount] = useState('main');
  const [status, setStatus] = useState('disconnected');
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([
    { id: 1, type: 'info', text: 'Sistema listo. Conecta una cuenta para empezar.', time: 'Ahora' }
  ]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('qr', (data) => {
      if (data.id === activeAccount) {
        setQr(data.qr);
        setStatus('initializing');
      }
    });

    socket.on('ready', (data) => {
      if (data.id === activeAccount) {
        setStatus('connected');
        setQr(null);
        fetchChats();
      }
    });

    socket.on('new_activity', (data) => {
      setActivities(prev => [{
        id: Date.now(),
        type: 'ai',
        chatId: data.chatId,
        text: `IA ${data.tone === 'balanced' ? 'sugirió' : 'generó variante'} para ${data.chatId.split('@')[0]}`,
        suggestion: data.suggestion,
        original: data.message,
        time: 'Recién'
      }, ...prev]);
    });

    return () => socket.disconnect();
  }, [activeAccount]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/chats/${activeAccount}`);
      setChats(res.data);
    } catch (e) {
      console.error("Error fetching chats", e);
    }
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/messages/${activeAccount}/${chat.id}`);
      setMessages(res.data);
    } catch (e) {
      console.error("Error fetching messages", e);
    }
  };

  const generateVariant = async (tone) => {
    if (!selectedChat || messages.length === 0) return;
    setAiLoading(true);
    try {
      const lastMsg = [...messages].reverse().find(m => !m.fromMe);
      await axios.post(`${API_BASE}/ai/variant`, {
        accountId: activeAccount,
        chatId: selectedChat.id,
        message: lastMsg ? lastMsg.body : "Resumen del chat",
        tone
      });
    } catch (e) {
      console.error("Error generating variant", e);
    } finally {
      setAiLoading(false);
    }
  };

  const initWhatsApp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/whatsapp/init`, { id: activeAccount });
      setStatus('initializing');
    } catch (err) {
      console.error("Error initializing WhatsApp", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copiado!');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">A</div>
          <h1>Atomic</h1>
        </div>
        <nav className="nav-links">
          <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'active' : ''}><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => { setView('chats'); fetchChats(); }} className={view === 'chats' ? 'active' : ''}><MessageSquare size={20} /> Chats</button>
          <button><Users size={20} /> Clientes</button>
          <button><Settings size={20} /> Configuración</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-box"><input type="text" placeholder="Buscar..." /></div>
          <div className="user-profile"><span>Santiago</span><div className="avatar">S</div></div>
        </header>

        <div className="content-area">
          {view === 'dashboard' ? (
            <>
              <div className="stats-grid">
                <div className="stat-card"><h3>Estado</h3><div className={`status-badge ${status}`}>{status === 'connected' ? 'Activo' : 'Desconectado'}</div></div>
                <div className="stat-card"><h3>Chats Hoy</h3><div className="value">{chats.length}</div></div>
                <div className="stat-card"><h3>IA Sugerencias</h3><div className="value">{activities.filter(a => a.type === 'ai').length}</div></div>
              </div>

              <div className="main-grid">
                <div className="card account-card">
                  <div className="card-header"><h2>WhatsApp Status</h2></div>
                  <div className="qr-section">
                    {status === 'disconnected' && <button className="btn-primary" onClick={initWhatsApp}>{loading ? <Loader2 className="animate-spin" /> : 'Conectar WhatsApp'}</button>}
                    {status === 'initializing' && (qr ? <QRCodeCanvas value={qr} size={180} /> : <Loader2 className="animate-spin" size={40} />)}
                    {status === 'connected' && <div className="success-msg"><CheckCircle2 size={40} /> Conectado</div>}
                  </div>
                </div>

                <div className="card activity-card">
                  <div className="card-header"><h2>IA Live Activity</h2></div>
                  <div className="activity-list">
                    {activities.map(a => (
                      <div key={a.id} className={`activity-item ${a.type}`}>
                        <p>{a.text}</p>
                        {a.type === 'ai' && (
                          <div className="ai-box">
                            <p className="suggestion">{a.suggestion}</p>
                            <button onClick={() => copyToClipboard(a.suggestion)}><Copy size={12} /> Copiar</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="chats-view">
              <div className="chats-sidebar card">
                <h3>Chats Recientes</h3>
                <div className="chat-list">
                  {chats.map(c => (
                    <div key={c.id} className={`chat-item ${selectedChat?.id === c.id ? 'active' : ''}`} onClick={() => selectChat(c)}>
                      <p className="name">{c.name}</p>
                      <p className="last">{c.lastMessage.substring(0, 30)}...</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chat-main card">
                {selectedChat ? (
                  <>
                    <div className="chat-header">
                      <h2>{selectedChat.name}</h2>
                      <div className="ai-controls">
                        <button className="btn-review" onClick={() => generateVariant('balanced')}>Revisar con IA</button>
                        <div className="tone-variants">
                          <button className="btn-tone friendly" onClick={() => generateVariant('friendly')} title="Más Amable">▲</button>
                          <button className="btn-tone direct" onClick={() => generateVariant('direct')} title="Más Directo">▼</button>
                        </div>
                      </div>
                    </div>
                    <div className="messages-area">
                      {messages.map((m, i) => (
                        <div key={i} className={`message ${m.fromMe ? 'sent' : 'received'}`}>
                          {m.body}
                        </div>
                      ))}
                    </div>
                  </>
                ) : <div className="empty-state">Selecciona un chat para ver la conversación y sugerencias de IA</div>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;



