import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Plus, Trash2, Upload } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiService } from '../../services/api';
import { unwrapList } from '../../utils/lists';

const emptyForm = {
  name: '',
  code: '',
  description: '',
  technology: '',
  level: '',
};

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadSubjects = async () => {
    const response = await apiService.getCourses();
    setSubjects(unwrapList(response.data));
  };

  useEffect(() => {
    loadSubjects()
      .catch((err) => {
        setError('Failed to load subjects');
        console.error('Subject load error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setError('');
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      technology: subject.technology || '',
      level: subject.level || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        technology: formData.technology || 'General',
        level: formData.level || 'General',
      };

      if (editingId) {
        await apiService.updateCourse(editingId, payload);
      } else {
        await apiService.createCourse(payload);
      }

      resetForm();
      await loadSubjects();
    } catch (err) {
      setError(err.response?.data?.code?.[0] || 'Failed to save subject');
      console.error('Subject save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subject) => {
    const confirmed = window.confirm(`Delete "${subject.name}" and its modules/material links?`);
    if (!confirmed) return;

    try {
      await apiService.deleteCourse(subject.id);
      await loadSubjects();
    } catch (err) {
      setError('Failed to delete subject');
      console.error('Subject delete error:', err);
    }
  };

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
            Manage Subjects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add classes or course subjects, then upload notes for the selected subject.
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
              {editingId ? 'Edit Subject' : 'Add Subject'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">
              <Input label="Subject Name" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Code" name="code" value={formData.code} onChange={handleChange} required />
              <Input label="Technology" name="technology" value={formData.technology} onChange={handleChange} />
              <Input label="Level" name="level" value={formData.level} onChange={handleChange} />
              <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} required />

              <div className="flex gap-3 pt-2">
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
                {subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No subjects yet
                  </div>
                ) : (
                  subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {subject.code}: {subject.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.module_count} modules &bull; {subject.material_count} notes
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/admin/upload?course=${subject.id}`}>
                          <Button variant="primary" size="sm">
                            <Upload className="w-4 h-4" />
                            Upload
                          </Button>
                        </Link>
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(subject)}>
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(subject)}>
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

export default AdminSubjects;
