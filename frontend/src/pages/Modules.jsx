import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, FolderOpen } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { apiService } from '../services/api';
import { unwrapList } from '../utils/lists';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await apiService.getModules();
        setModules(unwrapList(response.data));
      } catch (err) {
        setError('Failed to load modules');
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const grouped = useMemo(() => {
    const byCourse = {};
    modules
      .filter((module) => !module.is_notes_collection)
      .forEach((module) => {
        const key = module.course_name || 'Other';
        if (!byCourse[key]) {
          byCourse[key] = { courseId: module.course, code: module.course_code, items: [] };
        }
        byCourse[key].items.push(module);
      });
    return byCourse;
  }, [modules]);

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

  if (modules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon="folder"
          title="No Modules Available"
          description="Modules will be available soon. Please check back later."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            Modules by subject
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Each subject has its own modules. Open a subject for Notes/PDFs as well.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(grouped).map(([courseName, group]) => (
            <section key={courseName}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {courseName}
                </h2>
                {group.courseId && (
                  <Link
                    to={`/courses/${group.courseId}`}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400"
                  >
                    Open subject
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((module) => (
                  <Link key={module.id} to={`/modules/${module.id}`}>
                    <Card hover className="h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                            <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            {module.course_name && (
                              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                {module.course_name}
                              </span>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {module.title}
                            </h3>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      {module.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-400">
                          {module.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FolderOpen className="w-4 h-4" />
                        <span>{module.material_count} Materials</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modules;
