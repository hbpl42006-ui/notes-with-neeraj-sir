import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, User } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { apiService } from '../services/api';

const MaterialDetails = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await apiService.getMaterial(id);
        setMaterial(response.data);
      } catch (err) {
        setError('Failed to load material');
        console.error('Error fetching material:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
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

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState icon="file" title="Material not found" />
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const previewUrl = material.preview_url || material.file_url;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/materials" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 dark:text-primary-400 dark:hover:text-primary-300">
          <ArrowLeft className="w-5 h-5" />
          Back to Materials
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Material Info */}
          <div className="lg:col-span-1">
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 dark:bg-primary-900/30">
                  <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="primary" className="mb-2">
                    Module {material.module_number}
                  </Badge>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {material.title}
                  </h1>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">File Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {material.file_type.toUpperCase()}
                    </p>
                  </div>
                </div>

                {material.file_extension && (
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Extension</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {material.file_extension}
                      </p>
                    </div>
                  </div>
                )}

                {material.file_size && (
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">File Size</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatFileSize(material.file_size)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Uploaded</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(material.created_at)}
                    </p>
                  </div>
                </div>

                {material.uploaded_by_username && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Uploaded By</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {material.uploaded_by_username}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {material.file_url && (
                <div className="mt-6 space-y-3">
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="primary" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </a>
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="secondary" className="w-full">
                      Open in New Tab
                    </Button>
                  </a>
                </div>
              )}
            </Card>
          </div>

          {/* Description & PDF Preview */}
          <div className="lg:col-span-2 space-y-6">
            {material.description && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {material.description}
                </p>
              </Card>
            )}

            {previewUrl ? (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                  PDF Preview
                </h2>
                <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-700">
                  <embed
                    src={previewUrl}
                    type="application/pdf"
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                </div>
              </Card>
            ) : (
              <Card>
                <EmptyState
                  icon="file"
                  title="No file available"
                  description="The file for this material is not available."
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails;
