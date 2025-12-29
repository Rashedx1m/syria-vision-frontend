'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { Event } from '@/types';
import { Calendar, MapPin, Users, Award, Loader2 } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          eventsAPI.getUpcomingEvents(),
          eventsAPI.getPastEvents(),
        ]);
        setEvents(upcomingRes.data.results || upcomingRes.data);
        setPastEvents(pastRes.data.results || pastRes.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const displayEvents = activeTab === 'upcoming' ? events : pastEvents;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Events</h1>
          <p className="section-subtitle">
            Discover upcoming events and explore our past achievements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Upcoming ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'past'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Past Events ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : displayEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="card hover:-translate-y-2 cursor-pointer h-full">
                  {/* Cover Image */}
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {event.cover_image ? (
                      <img
                        src={event.cover_image}
                        alt={event.title_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Calendar className="w-16 h-16 text-white/80" />
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'upcoming'
                          ? 'bg-green-100 text-green-700'
                          : event.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    {event.is_featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title_en}
                  </h3>

                  {/* Date & Location */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })} - {new Date(event.end_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{event.registrations_count} / {event.max_participants}</span>
                    </div>
                    <div className="flex items-center gap-1 text-accent-600 font-semibold">
                      <Award className="w-4 h-4" />
                      <span>{event.total_prize} {event.prize_currency}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No {activeTab} events
            </h3>
            <p className="text-gray-500">
              {activeTab === 'upcoming'
                ? 'Stay tuned for upcoming events!'
                : 'No past events to show yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
