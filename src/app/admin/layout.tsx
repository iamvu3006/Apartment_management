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
    // Kiểm tra session hiện tại
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

    // Đăng ký lắng nghe thay đổi trạng thái Auth
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Đang xác thực quyền truy cập...</p>
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
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-bold text-lg text-stone-900 flex items-center gap-2"
            >
              <span className="w-3 h-3 rounded-full bg-orange-600"></span>
              Admin Control
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-stone-500 hover:text-stone-800 transition flex items-center gap-1"
            >
              <span>Xem trang public ↗</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-xs text-stone-500 hidden sm:inline">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-xs text-stone-600 hover:text-red-600 px-3 py-1.5 rounded-md border border-stone-200 hover:border-red-200 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
