import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import Select from '../../components/Select';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { apiService } from '../../services/api';
import { unwrapList } from '../../utils/lists';

const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, material: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, modulesRes] = await Promise.all([
          apiService.getMaterials(),
          apiService.getModules(),
        ]);
        
        setMaterials(unwrapList(materialsRes.data));
        setFilteredMaterials(unwrapList(materialsRes.data));
        setModules(unwrapList(modulesRes.data));
      } catch (err) {
        setError('Failed to load materials');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...materials];

    if (searchQuery) {
      filtered = filtered.filter(
        (material) =>
          material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedModule) {
      filtered = filtered.filter((material) => material.module === parseInt(selectedModule));
    }

    if (selectedFileType) {
      filtered = filtered.filter((material) => material.file_type === selectedFileType);
    }

    setFilteredMaterials(filtered);
  }, [searchQuery, selectedModule, selectedFileType, materials]);

  const handleDelete = async () => {
    if (!deleteModal.material) return;

    try {
      await apiService.deleteMaterial(deleteModal.material.id);
      setMaterials(materials.filter((m) => m.id !== deleteModal.material.id));
      setDeleteModal({ isOpen: false, material: null });
    } catch (err) {
      console.error('Error deleting material:', err);
      alert('Failed to delete material');
    }
  };

  const moduleOptions = [
    { value: '', label: 'All Modules' },
    ...modules.map((m) => ({ value: m.id, label: `${m.course_name}: ${m.title}` })),
  ];

  const fileTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Document' },
    { value: 'code', label: 'Code' },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
              Study Materials
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all course materials
            </p>
          </div>
          <Link to="/admin/upload">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Search
              </label>
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials..."
              />
            </div>
            <Select
              label="Module"
              options={moduleOptions}
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
            />
            <Select
              label="File Type"
              options={fileTypeOptions}
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
            />
          </div>
        </Card>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'} found
          </p>
        </div>

        {/* Materials Table */}
        {filteredMaterials.length === 0 ? (
          <EmptyState
            icon="file"
            title="No materials found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Material
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Module
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Uploaded
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => (
                    <tr
                      key={material.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center dark:bg-primary-900/30">
                            <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {material.title}
                            </p>
                            {material.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {material.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="primary" size="sm">
                          {material.course_name ? `${material.course_name} · ${material.module_title}` : material.module_title}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default" size="sm">
                          {material.file_type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(material.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/materials/${material.id}`}>
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link to={`/admin/edit/${material.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteModal({ isOpen: true, material })}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, material: null })}
          title="Delete Material"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete "{deleteModal.material?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteModal({ isOpen: false, material: null })}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminMaterials;
