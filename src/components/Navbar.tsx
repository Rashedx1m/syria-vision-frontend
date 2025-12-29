"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, Calendar, MessageSquare } from "lucide-react";

// دالة للحصول على رابط الصورة الكامل
const getMediaUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  ).replace("/api", "");
  return `${baseUrl}${path}`;
};

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/forum", label: "Forum" },
    { href: "/about", label: "About" },
  ];

  // مكون صورة المستخدم
  const UserAvatar = ({ size = "sm" }: { size?: "sm" | "md" }) => {
    const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    const avatarUrl = getMediaUrl(user?.avatar || null);

    return (
      <div
        className={`${sizeClasses} rounded-full bg-primary-100 flex items-center justify-center overflow-hidden`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.full_name || user?.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${iconSize} text-primary-600`} />
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">
                Syria <span className="text-primary-600">Vision</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <UserAvatar size="sm" />
                  <span className="font-medium">
                    {user.full_name || user.username}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    {/* خلفية لإغلاق القائمة عند النقر خارجها */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border z-20">
                      {/* معلومات المستخدم في أعلى القائمة */}
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                          <UserAvatar size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {user.full_name || user.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href="/my-registrations"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar className="w-4 h-4" />
                        My Registrations
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-600 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-4" />

            {user ? (
              <>
                {/* معلومات المستخدم في القائمة المتنقلة */}
                <div className="flex items-center gap-3 py-3">
                  <UserAvatar size="md" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/my-registrations"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar className="w-4 h-4" />
                  My Registrations
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-600 font-medium py-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-600 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
