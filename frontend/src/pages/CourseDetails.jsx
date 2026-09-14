import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, FileText, FolderOpen } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { apiService } from '../services/api';
import { unwrapList } from '../utils/lists';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, modulesRes] = await Promise.all([
          apiService.getCourse(id),
          apiService.getCourseModules(id),
        ]);
        setCourse(courseRes.data);
        setModules(unwrapList(modulesRes.data));
      } catch (err) {
        setError('Failed to load this subject');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState icon="alert" title="Error" description={error || 'Subject not found'} />
      </div>
    );
  }

  const topicModules = modules.filter((m) => !m.is_notes_collection);
  const notesModules = modules.filter((m) => m.is_notes_collection);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="w-5 h-5" />
          All subjects
        </Link>

        <div className="mb-10">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
            Notes with Neeraj Sir
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            {course.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="primary">{course.code}</Badge>
            <Badge variant="default">{course.technology}</Badge>
            <Badge variant="default">{course.module_count} modules</Badge>
            <Badge variant="default">{course.material_count} notes</Badge>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
            Modules
          </h2>
          {topicModules.length === 0 ? (
            <EmptyState
              icon="folder"
              title="No modules yet"
              description="Modules for this subject will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topicModules.map((module) => (
                <Link key={module.id} to={`/modules/${module.id}`}>
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                          <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
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
                      <span>{module.material_count} materials</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
            Notes / PDFs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notesModules.map((module) => (
              <Link key={module.id} to={`/modules/${module.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                        <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {module.material_count} files
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              </Link>
            ))}
            <Link to={`/materials?course=${course.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                      <FolderOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        All notes for this subject
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Browse every PDF and file in {course.name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
