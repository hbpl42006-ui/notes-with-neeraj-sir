import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiService } from '../../services/api';
import { unwrapList } from '../../utils/lists';

const emptyForm = {
  course: '',
  module_number: '',
  title: '',
  description: '',
  is_notes_collection: false,
};

const AdminModules = () => {
  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    const [modulesResponse, subjectsResponse] = await Promise.all([
      apiService.getModules(),
      apiService.getCourses(),
    ]);
    setModules(unwrapList(modulesResponse.data));
    setSubjects(unwrapList(subjectsResponse.data));
  };

  useEffect(() => {
    loadData()
      .catch((err) => {
        setError('Failed to load modules');
        console.error('Module load error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (module) => {
    setEditingId(module.id);
    setFormData({
      course: module.course || '',
      module_number: module.module_number || '',
      title: module.title || '',
      description: module.description || '',
      is_notes_collection: Boolean(module.is_notes_collection),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        module_number: Number(formData.module_number),
      };

      if (editingId) {
        await apiService.updateModule(editingId, payload);
      } else {
        await apiService.createModule(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Failed to save module');
      console.error('Module save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (module) => {
    const confirmed = window.confirm(`Delete "${module.title}" and its material links?`);
    if (!confirmed) return;

    try {
      await apiService.deleteModule(module.id);
      await loadData();
    } catch (err) {
      setError('Failed to delete module');
      console.error('Module delete error:', err);
    }
  };

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    ...subjects.map((subject) => ({ value: subject.id, label: `${subject.code}: ${subject.name}` })),
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            Manage Modules
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create folders under each subject so notes can be uploaded in the right place.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">
              {editingId ? 'Edit Module' : 'Add Module'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">
              <Select label="Subject" name="course" value={formData.course} onChange={handleChange} options={subjectOptions} required />
              <Input label="Module Number" name="module_number" type="number" min="0" value={formData.module_number} onChange={handleChange} required />
              <Input label="Module Title" name="title" value={formData.title} onChange={handleChange} required />
              <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} />

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="is_notes_collection"
                  checked={formData.is_notes_collection}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Notes/PDFs collection
              </label>

              <div className="flex gap-3 pt-4">
                <Button type="submit" loading={saving} disabled={saving}>
                  <Plus className="w-4 h-4" />
                  {editingId ? 'Save' : 'Add'}
                </Button>
                {editingId && (
                  <Button type="button" variant="secondary" onClick={resetForm} disabled={saving}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-4">
                {modules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No modules yet
                  </div>
                ) : (
                  modules.map((module) => (
                    <div
                      key={module.id}
                      className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {module.course_code}: Module {module.module_number} - {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {module.material_count} notes
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(module)}>
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(module)}>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModules;
