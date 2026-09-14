from rest_framework import serializers
from .models import Course, Module, StudyMaterial, Syllabus, AcademicEvent
from django.contrib.auth.models import User
from pathlib import Path


class CourseSerializer(serializers.ModelSerializer):
    module_count = serializers.ReadOnlyField()
    material_count = serializers.ReadOnlyField()

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'description', 'technology', 'level',
            'module_count', 'material_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class ModuleSerializer(serializers.ModelSerializer):
    material_count = serializers.ReadOnlyField()
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)

    class Meta:
        model = Module
        fields = [
            'id', 'course', 'course_name', 'course_code', 'module_number', 'title',
            'description', 'is_notes_collection', 'material_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class StudyMaterialSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_number = serializers.IntegerField(source='module.module_number', read_only=True)
    course = serializers.IntegerField(source='module.course_id', read_only=True)
    course_name = serializers.CharField(source='module.course.name', read_only=True)
    course_code = serializers.CharField(source='module.course.code', read_only=True)
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_size = serializers.ReadOnlyField()
    file_extension = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()

    class Meta:
        model = StudyMaterial
        fields = [
            'id', 'module', 'module_title', 'module_number', 'course', 'course_name',
            'course_code', 'title', 'description', 'file', 'file_url', 'preview_url', 'file_type',
            'file_size', 'file_extension', 'uploaded_by', 'uploaded_by_username',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'uploaded_by']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None

    def get_preview_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            preview_path = f'/api/materials/{obj.pk}/preview/'
            return request.build_absolute_uri(preview_path) if request else preview_path
        return None

    def validate_file(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('File must be 5 MB or smaller.')
        extension = Path(value.name).suffix.lower()
        if extension != '.pdf':
            raise serializers.ValidationError('Only PDF files are allowed.')
        return value

    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class StudyMaterialListSerializer(serializers.ModelSerializer):
    module = serializers.PrimaryKeyRelatedField(read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_number = serializers.IntegerField(source='module.module_number', read_only=True)
    course = serializers.IntegerField(source='module.course_id', read_only=True)
    course_name = serializers.CharField(source='module.course.name', read_only=True)
    file_extension = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()

    class Meta:
        model = StudyMaterial
        fields = [
            'id', 'module', 'module_title', 'module_number', 'course', 'course_name',
            'title', 'description', 'file_type', 'file_extension', 'file_url', 'preview_url', 'created_at',
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None

    def get_preview_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            preview_path = f'/api/materials/{obj.pk}/preview/'
            return request.build_absolute_uri(preview_path) if request else preview_path
        return None


class SyllabusSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Syllabus
        fields = ['id', 'course', 'course_code', 'course_name', 'title', 'file', 
                  'file_url', 'content', 'uploaded_at', 'updated_at']
        read_only_fields = ['uploaded_at', 'updated_at']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class AcademicEventSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(source='course.code', read_only=True, allow_null=True)
    course_name = serializers.CharField(source='course.name', read_only=True, allow_null=True)

    class Meta:
        model = AcademicEvent
        fields = ['id', 'course', 'course_code', 'course_name', 'title', 'description', 
                  'event_type', 'date', 'time', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_staff', 'is_superuser',
        ]
        read_only_fields = ['id']
