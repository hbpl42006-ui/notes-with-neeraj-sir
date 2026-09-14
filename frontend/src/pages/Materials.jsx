import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Download, Eye } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Select from '../components/Select';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { apiService } from '../services/api';
import { unwrapList } from '../utils/lists';

const Materials = () => {
  const [searchParams] = useSearchParams();
  const courseFromUrl = searchParams.get('course') || '';
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courseFromUrl);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setSelectedCourse(courseFromUrl);
  }, [courseFromUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, modulesRes, coursesRes] = await Promise.all([
          apiService.getMaterials(),
          apiService.getModules(),
          apiService.getCourses(),
        ]);
        
        setMaterials(unwrapList(materialsRes.data));
        setFilteredMaterials(unwrapList(materialsRes.data));
        setModules(unwrapList(modulesRes.data));
        setCourses(unwrapList(coursesRes.data));
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

    if (selectedCourse) {
      filtered = filtered.filter((material) => String(material.course) === String(selectedCourse));
    }

    if (selectedModule) {
      filtered = filtered.filter((material) => material.module === parseInt(selectedModule, 10));
    }

    if (selectedFileType) {
      filtered = filtered.filter((material) => material.file_type === selectedFileType);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'az') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredMaterials(filtered);
  }, [searchQuery, selectedCourse, selectedModule, selectedFileType, sortBy, materials]);

  const visibleModules = selectedCourse
    ? modules.filter((m) => String(m.course) === String(selectedCourse))
    : modules;

  const courseOptions = [
    { value: '', label: 'All subjects' },
    ...courses.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const moduleOptions = [
    { value: '', label: 'All Modules' },
    ...visibleModules.map((m) => ({
      value: m.id,
      label: `${m.course_name}: ${m.title}`,
    })),
  ];

  const fileTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Document' },
    { value: 'code', label: 'Code' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'az', label: 'A-Z' },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            Notes / PDFs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search notes across every subject, or filter to one course
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              label="Subject"
              options={courseOptions}
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedModule('');
              }}
            />
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
            <Select
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </Card>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'} found
          </p>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <EmptyState
            icon="file"
            title="No materials found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} hover>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-primary-900/30">
                    <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 dark:text-white truncate">
                      {material.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {material.course_name && (
                        <Badge variant="primary" size="sm">
                          {material.course_name}
                        </Badge>
                      )}
                      <Badge variant="default" size="sm">
                        {material.module_title}
                      </Badge>
                    </div>
                  </div>
                </div>

                {material.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-400">
                    {material.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="default" size="sm">
                    {material.file_type.toUpperCase()}
                  </Badge>
                  {material.file_extension && (
                    <Badge variant="default" size="sm">
                      {material.file_extension}
                    </Badge>
                  )}
                </div>

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

export default Materials;
