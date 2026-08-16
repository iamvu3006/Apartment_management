"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthenticated(true);
        setUserEmail(session.user.email ?? null);
        if (isLoginPage) {
          router.replace("/admin");
        }
      } else {
        setAuthenticated(false);
        setUserEmail(null);
        if (!isLoginPage) {
          router.replace("/admin/login");
        }
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthenticated(true);
        setUserEmail(session.user.email ?? null);
        if (isLoginPage) {
          router.replace("/admin");
        }
      } else {
        setAuthenticated(false);
        setUserEmail(null);
        if (!isLoginPage) {
          router.replace("/admin/login");
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-sm border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-bold text-base text-white flex items-center gap-2"
            >
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              Admin Dashboard
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <span>View Public Site ↗</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-xs text-slate-300 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-rose-400/50 transition font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
