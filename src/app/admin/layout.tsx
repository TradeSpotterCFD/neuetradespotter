"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Users,
  Globe,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ImageIcon
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Admin');
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log(">>> [AdminLayout useEffect] Setting up onAuthStateChange listener.");
    setIsLoadingUser(true);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(">>> [AdminLayout onAuthStateChange] Event:", event);

      if (session?.user) {
        // Vereinfachte Logik: Nur prüfen, ob eine Sitzung vorhanden ist
        setUserName('Admin'); // Benutzername auf Standard setzen
        console.log(">>> [AdminLayout] User session found.");
      } else {
        // Nur zur Login-Seite umleiten, wenn der aktuelle Pfad nicht bereits eine Admin-Route ist (außer /login selbst)
        if (!pathname.startsWith('/admin') || pathname === '/login') {
          console.log(">>> [AdminLayout] No session, redirecting to /login");
          router.push('/login');
        } else {
          console.log(">>> [AdminLayout] No session, but already on an admin route. Not redirecting immediately.");
          // Optional: Hier könnte man eine Meldung anzeigen oder einen Ladezustand beibehalten
        }
      }
      setIsLoadingUser(false); // Ensure isLoadingUser is set to false after auth check
    });

    return () => {
      console.log(">>> [AdminLayout useEffect] Cleaning up auth listener.");
      authListener?.subscription?.unsubscribe();
    };
  }, [router, pathname]);

  const handleSignOut = async () => {
    try {
      console.log(">>> [AdminLayout] Attempting to sign out..."); // Log vor signOut
      const { error } = await supabase.auth.signOut();
      console.log(">>> [AdminLayout] signOut result:", { error }); // Log Ergebnis von signOut

      if (error) {
        console.error(">>> [AdminLayout] Error during sign out:", error); // Log Fehler
        alert(`Fehler beim Abmelden: ${error.message}`); // Benutzer benachrichtigen
      } else {
        console.log(">>> [AdminLayout] Sign out successful, redirecting to /login"); // Log Erfolg
        router.push('/login');
      }
    } catch (error: any) {
      console.error(">>> [AdminLayout] Caught exception during sign out:", error); // Log gefangene Exception
      alert(`Ein unerwarteter Fehler ist beim Abmelden aufgetreten: ${error.message}`); // Benutzer benachrichtigen
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'CFD Brokers', href: '/admin/brokers', icon: <Users className="w-5 h-5" /> },
    { name: 'Future Brokers', href: '/admin/future-brokers', icon: <Users className="w-5 h-5" /> },
    { name: 'Stock Brokers', href: '/admin/stock-brokers', icon: <Users className="w-5 h-5" /> },
    { name: 'Crypto Exchanges', href: '/admin/crypto-exchanges', icon: <Users className="w-5 h-5" /> },
    { name: 'Countries', href: '/admin/countries', icon: <Globe className="w-5 h-5" /> },
    { name: 'Payment Methods', href: '/admin/payment-methods', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Banners', href: '/admin/banners', icon: <ImageIcon className="w-5 h-5" /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>Loading Admin Area...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="font-bold text-xl text-[#145588]">TradeSpotter Admin</div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="font-bold text-xl text-[#145588]">TradeSpotter Admin</div>
            </div>
            <div className="p-4 border-b">
              <div className="font-medium">Welcome, {userName}</div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md ${
                        pathname === item.href
                          ? 'bg-[#145588] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full p-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="ml-3">Sign Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:block fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b">
          <div className="font-bold text-xl text-[#145588]">TradeSpotter Admin</div>
        </div>
        <div className="p-4 border-b">
          <div className="font-medium">Welcome, {userName}</div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md ${
                    pathname === item.href
                      ? 'bg-[#145588] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="hidden lg:block fixed left-64 top-4 z-30 p-2 bg-white rounded-full shadow-md transform translate-x-1/2"
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Main content */}
      <div className={`lg:pl-64 pt-16 lg:pt-0 transition-all duration-300 ${!isSidebarOpen && 'lg:pl-0'}`}>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
