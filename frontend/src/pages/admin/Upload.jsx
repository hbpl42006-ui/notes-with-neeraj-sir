import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import FileUpload from '../../components/FileUpload';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiService } from '../../services/api';
import { unwrapList } from '../../utils/lists';

const UploadMaterial = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    title: '',
    module: '',
    description: '',
    file: null,
    file_type: 'pdf',
  });
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get('course') || '');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const [modulesResponse, coursesResponse] = await Promise.all([
          apiService.getModules(), apiService.getCourses(),
        ]);
        setModules(unwrapList(modulesResponse.data));
        setCourses(unwrapList(coursesResponse.data));
      } catch (err) {
        setError('Failed to load modules');
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === 'course') setSelectedCourse(e.target.value);
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

    // Validation
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

    if (!formData.file) {
      setError('Please select a file to upload');
      setSubmitting(false);
      return;
    }

    if (formData.file.size > 5 * 1024 * 1024) {
      setError('File must be 5 MB or smaller');
      setSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('module', formData.module);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('file', formData.file);
      formDataToSend.append('file_type', formData.file_type);

      await apiService.createMaterial(formDataToSend);
      navigate('/admin/materials');
    } catch (err) {
      setError('Failed to upload material. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const moduleOptions = [
    { value: '', label: 'Select a module' },
    ...modules.filter((m) => !selectedCourse || String(m.course) === String(selectedCourse)).map((m) => ({
      value: m.id,
      label: `${m.course_name}: ${m.title}`,
    })),
  ];

  const courseOptions = [
    { value: '', label: 'Select a subject' },
    ...courses.map((course) => ({ value: course.id, label: `${course.code}: ${course.name}` })),
  ];

  const fileTypeOptions = [
    { value: 'pdf', label: 'PDF' },
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
            Upload Study Material
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a PDF or notes file under the right subject and module
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
              label="Subject"
              name="course"
              options={courseOptions}
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setFormData({ ...formData, module: '' });
              }}
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
                Upload File
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf"
                maxSize={5 * 1024 * 1024}
                maxSizeLabel="5 MB"
              />
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
                {submitting ? 'Uploading...' : 'Upload Material'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UploadMaterial;
