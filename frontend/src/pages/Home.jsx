import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, GraduationCap } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import NotesTree from '../components/NotesTree';
import { apiService } from '../services/api';
import { unwrapList } from '../utils/lists';
import { groupModulesByCourse } from '../utils/folders';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [coursesRes, modulesRes, statsRes] = await Promise.all([
          apiService.getCourses(),
          apiService.getModules(),
          apiService.getStats(),
        ]);
        setCourses(unwrapList(coursesRes.data));
        setModules(unwrapList(modulesRes.data));
        setStats(statsRes.data);
      } catch (err) {
        setError('Failed to load subjects');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const tree = groupModulesByCourse(courses, modules);

  const totalModules = stats?.modules ?? courses.reduce((sum, course) => sum + (course.module_count || 0), 0);
  const totalNotes = stats?.notes ?? courses.reduce((sum, course) => sum + (course.material_count || 0), 0);

  return (
    <div className="min-h-screen">
      <section className="bg-primary-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-5 h-5" />
              <span className="text-sm font-medium">Study notes by subject</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Notes with Neeraj Sir
            </h1>
            <p className="text-lg text-primary-100">
              Open a subject to find its modules, then download notes and PDFs.
              Data Structure Using C, Python, DBMS, and more.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats?.subjects ?? courses.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totalModules}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Modules</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totalNotes}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notes / PDFs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
            Browse notes
          </h2>

          {!loading && !error && courses.length > 0 && (
            <div className="mb-10">
              <NotesTree subjects={tree} />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
            Subjects
          </h2>

          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {!loading && error && (
            <EmptyState icon="alert" title="Error" description={error} />
          )}

          {!loading && !error && courses.length === 0 && (
            <EmptyState
              icon="folder"
              title="No subjects yet"
              description="Subjects will appear here once they are added."
            />
          )}

          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <Card hover className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                        <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <Badge variant="primary">{course.code}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3 dark:text-gray-400 flex-1">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.module_count} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {course.material_count} notes
                      </span>
                      <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
                        Open
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
