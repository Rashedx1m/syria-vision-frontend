"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { eventsAPI } from "@/lib/api";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";

interface Registration {
  id: number;
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    image?: string;
  };
  team_name: string;
  team_members: string[];
  status: string;
  created_at: string;
}

export default function MyRegistrationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchRegistrations();
  }, [user, router]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getMyRegistrations();
      setRegistrations(response.data.results || response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || "فشل في جلب التسجيلات");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (registrationId: number) => {
    if (!confirm("هل أنت متأكد من إلغاء التسجيل؟")) return;

    setWithdrawing(registrationId);
    try {
      await eventsAPI.withdrawRegistration(registrationId);
      setRegistrations(registrations.filter((r) => r.id !== registrationId));
    } catch (err: any) {
      setError(err.response?.data?.detail || "فشل في إلغاء التسجيل");
    } finally {
      setWithdrawing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            مقبول
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            قيد المراجعة
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <XCircle className="w-4 h-4" />
            مرفوض
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            تسجيلاتي في الفعاليات
          </h1>
          <Link href="/events" className="btn-primary">
            استعراض الفعاليات
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد تسجيلات
            </h3>
            <p className="text-gray-600 mb-6">
              لم تقم بالتسجيل في أي فعالية بعد
            </p>
            <Link href="/events" className="btn-primary inline-block">
              تصفح الفعاليات
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration) => (
              <div key={registration.id} className="card">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* صورة الفعالية */}
                  {registration.event.image && (
                    <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={registration.event.image}
                        alt={registration.event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* تفاصيل التسجيل */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {registration.event.title}
                      </h3>
                      {getStatusBadge(registration.status)}
                    </div>

                    <div className="space-y-2 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(registration.event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{registration.event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>الفريق: {registration.team_name}</span>
                      </div>
                    </div>

                    {/* أعضاء الفريق */}
                    {registration.team_members &&
                      registration.team_members.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">
                            أعضاء الفريق:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {registration.team_members.map((member, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                              >
                                {member}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* الأزرار */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/events/${registration.event.id}`}
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="w-4 h-4" />
                        عرض الفعالية
                      </Link>

                      {registration.status === "pending" && (
                        <button
                          onClick={() => handleWithdraw(registration.id)}
                          disabled={withdrawing === registration.id}
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          {withdrawing === registration.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          إلغاء التسجيل
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* تاريخ التسجيل */}
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  تم التسجيل في: {formatDate(registration.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
