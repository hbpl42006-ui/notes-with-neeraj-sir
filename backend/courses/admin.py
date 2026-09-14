from django.contrib import admin
from .models import Course, Module, StudyMaterial, Syllabus, AcademicEvent


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'technology', 'level', 'created_at']
    search_fields = ['code', 'name', 'description']
    list_filter = ['level', 'technology']


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['module_number', 'title', 'course', 'is_notes_collection', 'material_count', 'created_at']
    search_fields = ['title', 'description', 'course__code']
    list_filter = ['course', 'is_notes_collection', 'module_number']


@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'file_type', 'uploaded_by', 'created_at']
    search_fields = ['title', 'description', 'module__title']
    list_filter = ['file_type', 'module', 'created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Syllabus)
class SyllabusAdmin(admin.ModelAdmin):
    list_display = ['course', 'title', 'uploaded_at', 'updated_at']
    search_fields = ['course__code', 'title']


@admin.register(AcademicEvent)
class AcademicEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'date', 'time', 'course']
    search_fields = ['title', 'description']
    list_filter = ['event_type', 'date', 'course']
    date_hierarchy = 'date'
