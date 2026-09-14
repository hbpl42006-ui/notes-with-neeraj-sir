import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, FolderOpen } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { apiService } from '../services/api';

const ModuleDetails = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moduleRes, materialsRes] = await Promise.all([
          apiService.getModule(id),
          apiService.getModuleMaterials(id),
        ]);
        
        setModule(moduleRes.data);
        setMaterials(materialsRes.data);
      } catch (err) {
        setError('Failed to load module details');
        console.error('Error fetching module:', err);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState icon="alert" title="Error" description={error} />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState icon="folder" title="Module not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to={module.course ? `/courses/${module.course}` : '/'}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to {module.course_name || 'subject'}
        </Link>

        {/* Module Header */}
        <Card className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 dark:bg-primary-900/30">
              <FolderOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <Badge variant="primary" className="mb-2">
                {module.is_notes_collection ? 'Notes / PDFs' : `Module ${module.module_number}`}
              </Badge>
              {module.course_name && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{module.course_name}</p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
                {module.title}
              </h1>
              {module.description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {module.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FileText className="w-5 h-5" />
              <span>{materials.length} {materials.length === 1 ? 'Material' : 'Materials'}</span>
            </div>
          </div>
        </Card>

        {/* Materials */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
            Study Materials
          </h2>
        </div>

        {materials.length === 0 ? (
          <EmptyState
            icon="file"
            title="No materials yet"
            description="Materials for this module will be added soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.id} hover>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-primary-900/30">
                    <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 dark:text-white truncate">
                      {material.title}
                    </h3>
                    <Badge variant="default" size="sm">
                      {material.file_type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {material.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-400">
                    {material.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Link to={`/materials/${material.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>
                  {material.file_url && (
                    <a
                      href={`http://localhost:8000${material.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="primary" size="sm" className="w-full">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetails;
