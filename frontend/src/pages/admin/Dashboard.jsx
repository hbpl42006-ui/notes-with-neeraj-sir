import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Calendar, Plus, TrendingUp, Users } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_courses: 0,
    total_modules: 0,
    total_materials: 0,
    total_pdfs: 0,
    total_events: 0,
    recent_uploads: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiService.getAdminDashboard();
        const { stats: adminStats, recent_notes } = response.data;
        setStats({
          total_courses: adminStats.subjects,
          total_modules: adminStats.modules,
          total_materials: adminStats.notes,
          total_pdfs: adminStats.pdfs,
          total_events: 0,
          recent_uploads: recent_notes,
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            Welcome back, Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening across all subjects.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Subjects
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total_courses}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Modules
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total_modules}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Study Materials
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total_materials}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  PDF Files
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total_pdfs}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Calendar Events
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total_events}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/upload">
            <Card hover className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Upload Material
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add new study materials
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/admin/materials">
            <Card hover className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Manage Materials
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Edit or delete materials
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/admin/modules">
            <Card hover className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Manage Modules
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize course modules
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/admin/subjects">
            <Card hover className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Manage Subjects
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add or edit classes and courses
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Uploads */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Uploads
            </h2>
            <Link to="/admin/materials">
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {stats.recent_uploads.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent uploads
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recent_uploads.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                      <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {material.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Module {material.module_number} • {formatDate(material.created_at)}
                      </p>
                    </div>
                  </div>
                  <Link to={`/materials/${material.id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
