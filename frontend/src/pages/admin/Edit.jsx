import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import FileUpload from '../../components/FileUpload';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiService } from '../../services/api';

const EditMaterial = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    module: '',
    description: '',
    file: null,
    file_type: 'pdf',
  });
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialRes, modulesRes] = await Promise.all([
          apiService.getMaterial(id),
          apiService.getModules(),
        ]);
        
        const material = materialRes.data;
        setFormData({
          title: material.title,
          module: material.module,
          description: material.description || '',
          file: null,
          file_type: material.file_type,
        });
        setModules(modulesRes.data.results || modulesRes.data);
      } catch (err) {
        setError('Failed to load material');
        console.error('Error fetching material:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileSelect = (file) => {
    setFormData({
      ...formData,
      file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.title.trim()) {
      setError('Material name is required');
      setSubmitting(false);
      return;
    }

    if (!formData.module) {
      setError('Module is required');
      setSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('module', formData.module);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('file_type', formData.file_type);
      
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      await apiService.updateMaterial(id, formDataToSend);
      navigate('/admin/materials');
    } catch (err) {
      setError('Failed to update material. Please try again.');
      console.error('Update error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const moduleOptions = [
    { value: '', label: 'Select a module' },
    ...modules.map((m) => ({ value: m.id, label: `Module ${m.module_number}: ${m.title}` })),
  ];

  const fileTypeOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Document' },
    { value: 'code', label: 'Code' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/materials')}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Materials
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            Edit Study Material
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update material information
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            <Input
              label="Material Name"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter material name"
              required
            />

            <Select
              label="Module"
              name="module"
              options={moduleOptions}
              value={formData.module}
              onChange={handleChange}
              required
            />

            <Select
              label="File Type"
              name="file_type"
              options={fileTypeOptions}
              value={formData.file_type}
              onChange={handleChange}
            />

            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of the material"
              rows={3}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Update File (Optional)
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt"
              />
              <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                Leave empty to keep the existing file
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/materials')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditMaterial;
