import { useEffect, useState } from 'react';
import Header from './components/Header';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';
import { Auth, EditProfile, Home, ImageDetail, Profile, UploadPage } from './pages';
import type { View } from './types';

type ToastState = { message: string; type: 'success' | 'error' } | null;

export default function App() {
  const { user, login, logout, refreshProfile } = useAuth();
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message: string, type: 'success' | 'error' = 'success') =>
    setToast({ message, type });
  const navigate = (nextView: View) => setView(nextView);
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setAuthMode(null);
    notify('Chào mừng bạn trở lại.');
  };
  const handleLogout = () => {
    logout();
    navigate('home');
    notify('Bạn đã đăng xuất.');
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header
        user={user}
        view={view}
        query={query}
        onNavigate={navigate}
        onSearch={(value) => {
          setQuery(value);
          navigate('home');
        }}
        onLogin={() => setAuthMode('login')}
        onRegister={() => setAuthMode('register')}
        onLogout={handleLogout}
      />
      {view === 'home' && (
        <Home
          query={query}
          user={user}
          onOpenDetail={setDetailId}
          onLogin={() => setAuthMode('login')}
          onNotify={notify}
        />
      )}
      {view === 'create' && (
        <UploadPage
          user={user}
          onLogin={() => setAuthMode('login')}
          onDone={() => {
            navigate('home');
            notify('Đã thêm hình ảnh thành công.');
          }}
          onNotify={notify}
        />
      )}
      {view === 'profile' && (
        <Profile
          user={user}
          onEdit={() => navigate('edit-profile')}
          onOpenDetail={setDetailId}
          onNotify={notify}
        />
      )}
      {view === 'edit-profile' && user && (
        <EditProfile
          user={user}
          onCancel={() => navigate('profile')}
          onSaved={async () => {
            await refreshProfile();
            navigate('profile');
            notify('Đã cập nhật hồ sơ.');
          }}
        />
      )}
      {authMode && (
        <Auth
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={setAuthMode}
          onLogin={handleLogin}
          onNotify={notify}
        />
      )}
      {detailId !== null && (
        <ImageDetail
          id={detailId}
          user={user}
          onClose={() => setDetailId(null)}
          onLogin={() => setAuthMode('login')}
          onNotify={notify}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
