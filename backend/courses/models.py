from django.db import models
from django.contrib.auth.models import User
import os


def get_material_upload_path(instance, filename):
    """Generate upload path for study materials"""
    ext = filename.split('.')[-1]
    filename = f"{instance.title.replace(' ', '_')}.{ext}"
    return os.path.join('materials', filename)


def get_syllabus_upload_path(instance, filename):
    """Generate upload path for syllabus"""
    return os.path.join('syllabus', filename)


class Course(models.Model):
    """A subject under Notes with Neeraj Sir (e.g. DSA, Python, DBMS)."""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    technology = models.CharField(max_length=100, default='C Programming')
    level = models.CharField(max_length=50, default='Undergraduate')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.code} - {self.name}"

    @property
    def module_count(self):
        return self.modules.filter(is_notes_collection=False).count()

    @property
    def material_count(self):
        return StudyMaterial.objects.filter(module__course=self).count()


class Module(models.Model):
    """Topic folder inside a subject, or a Notes/PDFs collection."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    module_number = models.IntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_notes_collection = models.BooleanField(
        default=False,
        help_text='If true, this folder is shown as Notes/PDFs rather than a numbered module.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['is_notes_collection', 'module_number']
        unique_together = ['course', 'module_number']

    def __str__(self):
        return f"Module {self.module_number}: {self.title}"

    @property
    def material_count(self):
        return self.materials.count()


class StudyMaterial(models.Model):
    """Study material model for PDFs and other resources"""
    FILE_TYPES = [
        ('pdf', 'PDF'),
        ('doc', 'Document'),
        ('code', 'Code'),
        ('other', 'Other'),
    ]

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=get_material_upload_path)
    file_type = models.CharField(max_length=10, choices=FILE_TYPES, default='pdf')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def file_size(self):
        if self.file:
            return self.file.size
        return 0

    @property
    def file_extension(self):
        if self.file:
            return self.file.name.split('.')[-1].upper()
        return ''


class Syllabus(models.Model):
    """Syllabus model for course syllabus"""
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='syllabus')
    title = models.CharField(max_length=200, default='Course Syllabus')
    file = models.FileField(upload_to=get_syllabus_upload_path, blank=True, null=True)
    content = models.TextField(blank=True, help_text='Text content of syllabus if not using file')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Syllabi'

    def __str__(self):
        return f"{self.course.code} Syllabus"


class AcademicEvent(models.Model):
    """Academic calendar events"""
    EVENT_TYPES = [
        ('class', 'Class'),
        ('exam', 'Exam'),
        ('holiday', 'Holiday'),
        ('assignment', 'Assignment'),
        ('other', 'Other'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='events', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='class')
    date = models.DateField()
    time = models.TimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.title} - {self.date}"
