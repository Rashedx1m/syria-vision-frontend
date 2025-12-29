"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import {
  User,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Loader2,
  Save,
  Camera,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    twitter: "",
    github: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setFormData({
      full_name: user.full_name || "",
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
      website: user.website || "",
      linkedin: user.linkedin || "",
      twitter: user.twitter || "",
      github: user.github || "",
    });

    if (user.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user, router]);

  // معالجة اختيار الصورة
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      setError("يرجى اختيار ملف صورة صالح");
      return;
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    // معاينة الصورة
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // رفع الصورة
    uploadAvatar(file);
  };

  // رفع الصورة للخادم
  const uploadAvatar = async (file: File) => {
    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // استدعاء API لرفع الصورة
      await authAPI.uploadAvatar(formData);
      await refreshUser();
      setSuccess("تم تحديث الصورة بنجاح!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "فشل في رفع الصورة");
      // إعادة الصورة القديمة في حالة الفشل
      setAvatarPreview(user?.avatar || null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.updateProfile(formData);
      await refreshUser();
      setSuccess("تم تحديث الملف الشخصي بنجاح!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "فشل في تحديث الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-8">ملفي الشخصي</h1>

        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-center gap-6">
            {/* صورة الملف الشخصي مع زر التعديل */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                ) : avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-600" />
                )}
              </div>

              {/* زر تغيير الصورة */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 hover:bg-primary-700 
                         text-white rounded-full flex items-center justify-center shadow-lg
                         transition-all duration-200 group-hover:scale-110"
                title="تغيير الصورة"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* حقل الملف المخفي */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.full_name || user.username}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm capitalize">
                {user.role}
              </span>
            </div>
          </div>

          {/* نص مساعد */}
          <p className="text-sm text-gray-500 mt-4">
            انقر على أيقونة الكاميرا لتغيير صورة الملف الشخصي
          </p>
        </div>

        {/* Edit Form */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            تعديل الملف الشخصي
          </h3>

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... باقي الحقول كما هي ... */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="input pl-10"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label">الهاتف</label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">نبذة عني</label>
              <textarea
                className="input"
                rows={4}
                placeholder="أخبرنا عن نفسك..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">الموقع</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="input pl-10"
                    placeholder="المدينة، البلد"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label">الموقع الإلكتروني</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    className="input pl-10"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">روابط التواصل</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="label">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      className="input pl-10"
                      placeholder="رابط LinkedIn"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Twitter</label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      className="input pl-10"
                      placeholder="رابط Twitter"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="label">GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      className="input pl-10"
                      placeholder="رابط GitHub"
                      value={formData.github}
                      onChange={(e) =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
