from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.http import FileResponse, Http404
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Course, Module, StudyMaterial, Syllabus, AcademicEvent
from .serializers import (
    CourseSerializer, ModuleSerializer, StudyMaterialSerializer, 
    StudyMaterialListSerializer, SyllabusSerializer, AcademicEventSerializer, UserSerializer
)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_permissions(self):
        return [AllowAny()] if self.request.method in ('GET', 'HEAD', 'OPTIONS') else [IsAuthenticated(), IsAdminUser()]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']

    @action(detail=True, methods=['get'])
    def modules(self, request, pk=None):
        course = self.get_object()
        modules = course.modules.all()
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)


class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        return [AllowAny()] if self.request.method in ('GET', 'HEAD', 'OPTIONS') else [IsAuthenticated(), IsAdminUser()]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course', 'module_number']
    search_fields = ['title', 'description']
    ordering_fields = ['module_number', 'title', 'created_at']

    @action(detail=True, methods=['get'])
    def materials(self, request, pk=None):
        module = self.get_object()
        materials = module.materials.all()
        serializer = StudyMaterialListSerializer(materials, many=True)
        return Response(serializer.data)


class StudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = StudyMaterial.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['module', 'file_type', 'module__course']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return StudyMaterialListSerializer
        return StudyMaterialSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]

    @method_decorator(xframe_options_exempt)
    @action(detail=True, methods=['get'])
    def preview(self, request, pk=None):
        material = self.get_object()
        if not material.file:
            raise Http404('File not found')

        response = FileResponse(material.file.open('rb'), content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{material.file.name.split("/")[-1]}"'
        return response

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        module_id = request.query_params.get('module', None)
        
        materials = self.queryset
        
        if query:
            materials = materials.filter(
                Q(title__icontains=query) | 
                Q(description__icontains=query)
            )
        
        if module_id:
            materials = materials.filter(module_id=module_id)
        
        serializer = StudyMaterialListSerializer(materials, many=True)
        return Response(serializer.data)


class SyllabusViewSet(viewsets.ModelViewSet):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]


class AcademicEventViewSet(viewsets.ModelViewSet):
    queryset = AcademicEvent.objects.all()
    serializer_class = AcademicEventSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course', 'event_type', 'date']
    search_fields = ['title', 'description']
    ordering_fields = ['date', 'time', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]


class DashboardViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def list(self, request):
        total_courses = Course.objects.count()
        total_modules = Module.objects.filter(is_notes_collection=False).count()
        total_materials = StudyMaterial.objects.count()
        total_pdfs = StudyMaterial.objects.filter(file_type='pdf').count()
        total_events = AcademicEvent.objects.count()
        recent_uploads = StudyMaterial.objects.all()[:5]
        
        data = {
            'total_courses': total_courses,
            'total_modules': total_modules,
            'total_materials': total_materials,
            'total_pdfs': total_pdfs,
            'total_events': total_events,
            'recent_uploads': StudyMaterialListSerializer(recent_uploads, many=True).data
        }
        return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def stats_view(request):
    return Response({
        'subjects': Course.objects.count(),
        'modules': Module.objects.filter(is_notes_collection=False).count(),
        'notes': StudyMaterial.objects.count(),
        'pdfs': StudyMaterial.objects.filter(file_type='pdf').count(),
        'calendar_events': AcademicEvent.objects.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_view(request):
    recent_notes = StudyMaterial.objects.select_related('module__course').all()[:5]
    return Response({
        'stats': {
            'subjects': Course.objects.count(),
            'modules': Module.objects.filter(is_notes_collection=False).count(),
            'notes': StudyMaterial.objects.count(),
            'pdfs': StudyMaterial.objects.filter(file_type='pdf', file__isnull=False).count(),
            'missing_files': StudyMaterial.objects.filter(file='').count(),
        },
        'recent_notes': StudyMaterialListSerializer(recent_notes, many=True, context={'request': request}).data,
    })


class UserProfileViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
