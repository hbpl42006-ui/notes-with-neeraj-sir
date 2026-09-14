import React, { useEffect, useState } from 'react';
import { FileText, Download, BookOpen } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { apiService } from '../services/api';
import { unwrapList } from '../utils/lists';

const Syllabus = () => {
  const [syllabi, setSyllabi] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await apiService.getSyllabus();
        const list = unwrapList(response.data);
        setSyllabi(list);
        if (list[0]) {
          setSelectedId(String(list[0].id));
        }
      } catch (err) {
        setError('Failed to load syllabus');
        console.error('Error fetching syllabus:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);

  const syllabus = syllabi.find((item) => String(item.id) === String(selectedId));

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

  const courseOptions = syllabi.map((item) => ({
    value: String(item.id),
    label: item.course_name || item.title,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
              Course Syllabus
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a subject to view its syllabus
            </p>
          </div>
          {courseOptions.length > 1 && (
            <div className="w-full md:w-72">
              <Select
                label="Subject"
                options={courseOptions}
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              />
            </div>
          )}
        </div>

        {!syllabus ? (
          <EmptyState
            icon="file"
            title="Syllabus not available"
            description="The course syllabus will be available soon."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 dark:bg-primary-900/30">
                    <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {syllabus.title}
                    </h2>
                    {syllabus.course_name && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {syllabus.course_name}
                      </p>
                    )}
                  </div>
                </div>

                {syllabus.file_url && (
                  <div className="space-y-3">
                    <a
                      href={`http://localhost:8000${syllabus.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="primary" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Syllabus
                      </Button>
                    </a>
                    <a
                      href={`http://localhost:8000${syllabus.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="secondary" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        View PDF
                      </Button>
                    </a>
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-2">
              {syllabus.content ? (
                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                    Syllabus Content
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                      {syllabus.content}
                    </div>
                  </div>
                </Card>
              ) : syllabus.file_url ? (
                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                    PDF Preview
                  </h2>
                  <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-700">
                    <iframe
                      src={`http://localhost:8000${syllabus.file_url}`}
                      className="w-full h-full"
                      title="Syllabus PDF"
                    />
                  </div>
                </Card>
              ) : (
                <Card>
                  <EmptyState
                    icon="file"
                    title="No syllabus content"
                    description="Syllabus content will be added soon."
                  />
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Syllabus;
