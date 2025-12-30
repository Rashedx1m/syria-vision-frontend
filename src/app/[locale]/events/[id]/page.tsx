'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import {
  Calendar, MapPin, Users, Award, Clock, User,
  Linkedin, Twitter, ArrowLeft, Loader2, CheckCircle,
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    team_name: '',
    team_members: '',
    project_idea: '',
    field: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getEvent(Number(params.id));
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setRegistering(true);
    try {
      const members = formData.team_members
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m);

      await eventsAPI.registerForEvent({
        event: Number(params.id),
        team_name: formData.team_name,
        team_members: members,
        project_idea: formData.project_idea,
        field: formData.field,
      });

      // Refresh event data
      const response = await eventsAPI.getEvent(Number(params.id));
      setEvent(response.data);
      setShowRegisterForm(false);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <Link href="/events" className="text-primary-600 hover:underline">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  event.status === 'upcoming'
                    ? 'bg-green-500/20 text-green-100'
                    : 'bg-white/20 text-white'
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title_en}</h1>
              <div className="flex flex-wrap gap-4 text-primary-100">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(event.start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {event.location}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{event.total_prize}</div>
                <div className="text-primary-100">{event.prize_currency} in prizes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description_en}
              </p>
            </div>

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-sm text-primary-600 font-medium">Day {item.day}</div>
                        <div className="text-xs text-gray-500">
                          {item.start_time} - {item.end_time}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title_en}</h3>
                        <p className="text-sm text-gray-600">{item.description_en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Speakers & Mentors</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker) => (
                    <div key={speaker.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {speaker.photo ? (
                          <img
                            src={speaker.photo}
                            alt={speaker.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{speaker.name}</h3>
                        <p className="text-sm text-primary-600">{speaker.title}</p>
                        <div className="flex gap-2 mt-2">
                          {speaker.linkedin && (
                            <a href={speaker.linkedin} target="_blank" className="text-gray-400 hover:text-primary-600">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {speaker.twitter && (
                            <a href={speaker.twitter} target="_blank" className="text-gray-400 hover:text-primary-600">
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration</h3>

              {event.user_registration ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">You're registered!</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Team: {event.user_registration.team_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize">{event.user_registration.status}</span>
                  </p>
                </div>
              ) : showRegisterForm ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="label">Team Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.team_name}
                      onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Team Members (comma separated)</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Name 1, Name 2, Name 3"
                      value={formData.team_members}
                      onChange={(e) => setFormData({ ...formData, team_members: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Project Idea</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={formData.project_idea}
                      onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Field</label>
                    <select
                      className="input"
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    >
                      <option value="">Select field</option>
                      <option value="tech">Technology</option>
                      <option value="health">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="environment">Environment</option>
                      <option value="business">Business</option>
                      <option value="social">Social Impact</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={registering}
                    className="btn-primary w-full"
                  >
                    {registering ? 'Registering...' : 'Submit Registration'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="btn-secondary w-full"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spots Available</span>
                      <span className="font-medium">{event.available_spots} / {event.max_participants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Team Size</span>
                      <span className="font-medium">{event.min_team_size} - {event.max_team_size} members</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-medium">
                        {new Date(event.registration_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {event.is_registration_open ? (
                    <button
                      onClick={() => user ? setShowRegisterForm(true) : router.push('/login')}
                      className="btn-primary w-full"
                    >
                      Register Now
                    </button>
                  ) : (
                    <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                      Registration Closed
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
