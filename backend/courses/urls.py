from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, ModuleViewSet, StudyMaterialViewSet, 
    SyllabusViewSet, AcademicEventViewSet, DashboardViewSet, UserProfileViewSet
)
from .views import stats_view, admin_dashboard_view
from .auth_views import login_view, logout_view, me_view

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'materials', StudyMaterialViewSet, basename='material')
router.register(r'syllabus', SyllabusViewSet, basename='syllabus')
router.register(r'events', AcademicEventViewSet, basename='event')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/me/', me_view, name='me'),
    path('stats/', stats_view, name='stats'),
    path('admin/dashboard/', admin_dashboard_view, name='admin-dashboard'),
]
