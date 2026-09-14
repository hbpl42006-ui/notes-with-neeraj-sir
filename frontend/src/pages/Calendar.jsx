import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { apiService } from '../services/api';
import { unwrapList } from '../utils/lists';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.getEvents();
        setEvents(unwrapList(response.data));
      } catch (err) {
        setError('Failed to load calendar events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'All day';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventColor = (eventType) => {
    const colors = {
      class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      exam: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      holiday: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      assignment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    };
    return colors[eventType] || colors.other;
  };

  const groupEventsByMonth = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const date = new Date(event.date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState icon="alert" title="Error" description={error} />
      </div>
    );
  }

  const groupedEvents = groupEventsByMonth(events);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            Academic Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with class schedules, exams, and important dates
          </p>
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No events scheduled"
            description="Academic calendar events will be added soon."
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([month, monthEvents]) => (
              <div key={month}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
                  {month}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monthEvents.map((event) => (
                    <Card key={event.id} hover>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-primary-900/30">
                          <CalendarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 dark:text-white truncate">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            <Badge className={getEventColor(event.event_type)}>
                              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                            </Badge>
                            {event.course_name && (
                              <Badge variant="default">{event.course_name}</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(event.time)}</span>
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 dark:text-gray-400">
                          {event.description}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
