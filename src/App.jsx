import React, { useState, useEffect, useRef } from 'react';
import { Camera, Download, Users, TrendingUp, AlertTriangle, QrCode, Eye, LogOut, Menu, X, CheckCircle, Send, Image, BarChart3, MapPin, Award, Zap, Settings, MessageCircle, FileText, Star, Trophy, Target, Clock, Map } from 'lucide-react';

const initialData = {
  users: [
    { id: 1, username: 'camilo', password: 'admin123', name: 'Camilo', role: 'admin', zone: null, phone: '+5215512345678', points: 0 },
    { id: 2, username: 'carlos', password: 'admin123', name: 'Carlos Estrella', role: 'reports', zone: null, phone: '+5215512345679', points: 0 },
    { id: 3, username: 'yazmin', password: 'admin123', name: 'Yazmin', role: 'documents', zone: null, phone: '+5215512345680', points: 0 },
    { id: 4, username: 'zona1', password: 'zona123', name: 'Líder Zona 1', role: 'zone', zone: 1, phone: '+5215512345681', points: 0 },
    { id: 5, username: 'secc1z1', password: 'secc123', name: 'Líder Seccional 1-A', role: 'section', zone: 1, section: '1-A', phone: '+5215512345683', points: 0 },
  ],
  affiliates: [],
  zones: [
    { id: 1, name: 'Zona 1 Norte', goal: 500, alertThreshold: 50, color: '#3B82F6' },
    { id: 2, name: 'Zona 2 Sur', goal: 450, alertThreshold: 50, color: '#10B981' },
    { id: 3, name: 'Zona 3 Este', goal: 400, alertThreshold: 50, color: '#F59E0B' },
    { id: 4, name: 'Zona 4 Oeste', goal: 350, alertThreshold: 50, color: '#EF4444' },
    { id: 5, name: 'Zona 5 Centro', goal: 600, alertThreshold: 50, color: '#8B5CF6' },
    { id: 6, name: 'Zona 6 Metropolitana', goal: 550, alertThreshold: 50, color: '#EC4899' },
  ],
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('masData');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('masData', JSON.stringify(data));
  }, [data]);

  if (!currentUser) {
    return <LoginScreen data={data} setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <DashboardView data={data} setData={setData} currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  );
};

const LoginScreen = ({ data, setCurrentUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">MÁS Toluca</h1>
          <p className="text-gray-600">Sistema de Afiliación</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Usuario"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Contraseña"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

const DashboardView = ({ data, setData, currentUser, setCurrentUser }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const affiliates = data.affiliates.filter(a => 
    currentUser.role === 'admin' ? true : 
    currentUser.role === 'zone' ? a.zone === currentUser.zone :
    a.zone === currentUser.zone && a.section === currentUser.section
  );

  return (
    <div>
      <header className="bg-blue-600 text-white p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">MÁS Toluca</h1>
            <p className="text-sm">{currentUser.name}</p>
          </div>
          <button onClick={() => setCurrentUser(null)} className="bg-blue-700 px-4 py-2 rounded">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button onClick={() => setActiveView('dashboard')} className="bg-white p-4 rounded-lg shadow">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <p className="font-bold">Dashboard</p>
        </button>
        <button onClick={() => setActiveView('register')} className="bg-white p-4 rounded-lg shadow">
          <Camera className="w-8 h-8 text-green-600 mb-2" />
          <p className="font-bold">Afiliar</p>
        </button>
      </div>

      {activeView === 'dashboard' && <Dashboard affiliates={affiliates} data={data} />}
      {activeView === 'register' && <RegisterView data={data} setData={setData} currentUser={currentUser} />}
    </div>
  );
};

const Dashboard = ({ affiliates, data }) => {
  const total = affiliates.length;
  const goal = data.zones.reduce((sum, z) => sum + z.goal, 0);
  const progress = Math.round((total / goal) * 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600">Total</p>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-gray-600">Meta</p>
          <p className="text-3xl font-bold text-green-600">{progress}%</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
      </div>
    </div>
  );
};

const RegisterView = ({ data, setData, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    ine: '',
    phone: '',
    zone: currentUser.zone || '',
    section: currentUser.section || '',
  });
  const [affiliatePhoto, setAffiliatePhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!affiliatePhoto) {
      alert('La foto es obligatoria');
      return;
    }

    const newAffiliate = {
      id: Date.now(),
      ...formData,
      affiliatePhoto,
      affiliatedBy: currentUser.name,
      timestamp: new Date().toISOString(),
      zone: parseInt(formData.zone),
    };

    setData({ ...data, affiliates: [...data.affiliates, newAffiliate] });
    alert('¡Afiliado registrado!');
    setFormData({ name: '', ine: '', phone: '', zone: currentUser.zone || '', section: currentUser.section || '' });
    setAffiliatePhoto(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Registrar Afiliado</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          placeholder="Nombre completo"
        />
        <input
          type="text"
          required
          value={formData.ine}
          onChange={(e) => setFormData({ ...formData, ine: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          placeholder="Clave INE"
        />
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          placeholder="Teléfono"
        />
        {!currentUser.zone && (
          <select
            required
            value={formData.zone}
            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Seleccionar zona...</option>
            {data.zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        )}
        <button
          type="button"
          onClick={() => setShowCamera(true)}
          className={`w-full py-3 rounded font-bold ${affiliatePhoto ? 'bg-green-600' : 'bg-gray-600'} text-white`}
        >
          {affiliatePhoto ? '✓ Foto Capturada' : 'Tomar Foto *'}
        </button>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold">
          Registrar
        </button>
      </form>
      {showCamera && <CameraModal onClose={() => setShowCamera(false)} onCapture={setAffiliatePhoto} />}
    </div>
  );
};

const CameraModal = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => alert('No se pudo acceder a la cámara'));
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg'));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded mb-4"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="flex gap-2">
          <button onClick={capture} className="flex-1 bg-blue-600 text-white py-3 rounded font-bold">
            Capturar
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-600 text-white py-3 rounded font-bold">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
