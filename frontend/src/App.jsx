import { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import Navbar from './components/Navbar';
import Sheet from './components/Sheet';
import ContactList from './pages/ContactList';
import ContactForm from './pages/ContactForm';
import './index.css';

function AppContent() {
  const [isLight, setIsLight] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'light';
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  const [sheetContact, setSheetContact] = useState(null);
  const [refreshKey,   setRefreshKey]   = useState(0);

  const isSheetOpen = sheetContact !== null;

  const openEdit   = (contact) => setSheetContact(contact);
  const openAdd    = ()        => setSheetContact({});
  const closeSheet = ()        => setSheetContact(null);

  const handleSaved = () => {
    closeSheet();
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="page-wrapper">
      <Navbar isLight={isLight} onThemeToggle={() => setIsLight((prev) => !prev)} />

      <main className="main-content">
        <ContactList onAdd={openAdd} onEdit={openEdit} refreshKey={refreshKey} />
      </main>

      <Sheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        title={sheetContact?.id ? 'Edit Patient' : 'New Patient'}
      >
        {isSheetOpen && (
          <ContactForm
            contact={sheetContact?.id ? sheetContact : null}
            onSave={handleSaved}
            onCancel={closeSheet}
          />
        )}
      </Sheet>

      <ToastContainer />
    </div>
  );
}

/** Root application wrapped in ToastProvider context. */
export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}