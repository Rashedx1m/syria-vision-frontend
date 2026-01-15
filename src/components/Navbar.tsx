"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// دالة للحصول على رابط الصورة الكامل
const getMediaUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  ).replace("/api", "");
  return `${baseUrl}${path}`;
};

// اللغات المتاحة
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇾" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // الحصول على اللغة الحالية من الرابط
  const getCurrentLocale = () => {
    const segments = pathname.split("/");
    const localeInPath = languages.find((lang) => lang.code === segments[1]);
    return localeInPath ? localeInPath.code : "en";
  };

  const currentLocale = getCurrentLocale();
  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  // دالة لبناء الروابط مع اللغة
  const localizedHref = (path: string) => {
    if (path === "/") return `/${currentLocale}`;
    return `/${currentLocale}${path}`;
  };

  // تغيير اللغة
  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split("/");
    const isLocaleInPath = languages.some((lang) => lang.code === segments[1]);

    let newPath;
    if (isLocaleInPath) {
      segments[1] = newLocale;
      newPath = segments.join("/");
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    router.push(newPath);
    setShowLangMenu(false);
  };

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

  // مكون تغيير اللغة
  const LanguageSwitcher = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="relative">
      <button
        onClick={() => setShowLangMenu(!showLangMenu)}
        className={`flex items-center gap-2 ${
          mobile
            ? "w-full py-2 text-gray-600 hover:text-primary-600"
            : "px-3 py-2 rounded-lg hover:bg-gray-100"
        } transition-colors`}
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            showLangMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {showLangMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowLangMenu(false)}
          />
          <div
            className={`absolute ${
              mobile ? "left-0" : "right-0"
            } mt-2 w-48 bg-white rounded-lg shadow-lg border z-20`}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  currentLocale === lang.code
                    ? "bg-primary-50 text-primary-600"
                    : ""
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={localizedHref("/")} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SV</span>
              </div>
              <span className="font-bold text-xl">
                Syria <span className="text-primary-600">Vision</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(link.href)}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <LanguageSwitcher />

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
                        href={localizedHref("/profile")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href={localizedHref("/my-registrations")}
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
                  href={localizedHref("/login")}
                  className="text-gray-600 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  href={localizedHref("/register")}
                  className="btn-primary text-sm py-2"
                >
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
                href={localizedHref(link.href)}
                className="block text-gray-600 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher Mobile */}
            <div className="py-2">
              <LanguageSwitcher mobile />
            </div>

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
                  href={localizedHref("/profile")}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href={localizedHref("/my-registrations")}
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
                  href={localizedHref("/login")}
                  className="block text-gray-600 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href={localizedHref("/register")}
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
