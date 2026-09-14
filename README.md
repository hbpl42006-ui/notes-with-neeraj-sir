# Data Structure Using C - Learning Management System

A modern, professional Learning Management System (LMS) for the course "Data Structure Using C" (Course Code: NCCML4403). Built with Django REST Framework backend and React frontend with Tailwind CSS.

## Features

### For Students
- **Beautiful Homepage**: Modern hero section with course information and statistics
- **Module Browser**: Explore course modules with material counts
- **Study Materials**: Searchable and filterable library of PDFs and resources
- **Material Details**: View PDFs inline, download files, see detailed information
- **Syllabus**: Access course syllabus with PDF preview
- **Academic Calendar**: View class schedules, exams, and important dates
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark Mode**: Toggle between light and dark themes

### For Administrators
- **Dashboard**: Overview with statistics and recent uploads
- **Material Management**: Create, edit, delete study materials
- **File Upload**: Drag-and-drop PDF upload with validation
- **Module Management**: Organize course content into modules
- **Search & Filter**: Powerful search and filtering capabilities
- **Secure Authentication**: Admin-only access to management features

## Technology Stack

### Backend
- **Django 5.0.7**: Python web framework
- **Django REST Framework 3.15.2**: API development
- **django-cors-headers**: CORS support
- **django-filter**: Advanced filtering
- **SQLite**: Development database (PostgreSQL ready for production)
- **Token Authentication**: Secure API authentication

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Lucide React**: Modern icon library

## Project Structure

```
data-structure-lms/
├── backend/
│   ├── config/          # Django project settings
│   ├── courses/         # Main Django app
│   │   ├── models.py    # Database models
│   │   ├── serializers.py # DRF serializers
│   │   ├── views.py     # API views
│   │   ├── urls.py      # API routes
│   │   ├── admin.py     # Django admin configuration
│   │   └── management/  # Custom management commands
│   ├── media/           # Uploaded files
│   ├── manage.py        # Django management script
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout components
│   │   ├── contexts/    # React contexts (Auth, Theme)
│   │   ├── services/    # API service
│   │   └── App.jsx      # Main React app
│   ├── package.json     # Node dependencies
│   └── vite.config.js   # Vite configuration
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**
- Windows:
```bash
venv\Scripts\activate
```
- macOS/Linux:
```bash
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Load sample data** (optional)
```bash
python manage.py load_sample_data
```
This creates:
- Admin user: `admin` / `admin123`
- Sample course with modules
- Sample study materials
- Academic calendar events
- Syllabus

7. **Start Django server**
```bash
python manage.py runserver
```
Backend will run on: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

## Accessing the Application

### Public Access
- Homepage: `http://localhost:5173/`
- Modules: `http://localhost:5173/modules`
- Materials: `http://localhost:5173/materials`
- Syllabus: `http://localhost:5173/syllabus`
- Calendar: `http://localhost:5173/calendar`

### Admin Access
1. Login at: `http://localhost:5173/login`
2. Use credentials: `admin` / `admin123`
3. Access admin dashboard: `http://localhost:5173/admin/dashboard`

### Django Admin Panel
- URL: `http://localhost:8000/admin`
- Same credentials: `admin` / `admin123`

## Database Models

### Course
- Course information (name, code, description, technology, level)

### Module
- Course modules with module number, title, and description
- Related to Course

### StudyMaterial
- Study materials with title, description, file, file type
- Related to Module and User (uploaded_by)

### Syllabus
- Course syllabus with file and/or text content
- One-to-one with Course

### AcademicEvent
- Calendar events (classes, exams, holidays, assignments)
- Related to Course

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login and get token
- `POST /api/auth/logout/` - Logout

### Courses
- `GET /api/courses/` - List all courses
- `GET /api/courses/{id}/` - Get course details

### Modules
- `GET /api/modules/` - List all modules
- `GET /api/modules/{id}/` - Get module details
- `GET /api/modules/{id}/materials/` - Get materials for a module

### Study Materials
- `GET /api/materials/` - List all materials
- `GET /api/materials/{id}/` - Get material details
- `POST /api/materials/` - Create new material (admin only)
- `PUT /api/materials/{id}/` - Update material (admin only)
- `DELETE /api/materials/{id}/` - Delete material (admin only)
- `GET /api/materials/search/` - Search materials

### Syllabus
- `GET /api/syllabus/` - Get syllabus
- `POST /api/syllabus/` - Create/update syllabus (admin only)

### Academic Events
- `GET /api/events/` - List all events
- `GET /api/events/{id}/` - Get event details
- `POST /api/events/` - Create event (admin only)
- `PUT /api/events/{id}/` - Update event (admin only)
- `DELETE /api/events/{id}/` - Delete event (admin only)

### Dashboard
- `GET /api/dashboard/` - Get dashboard statistics (admin only)

### Profile
- `GET /api/profile/` - Get user profile (authenticated)

## Development

### Adding New Models
1. Create model in `backend/courses/models.py`
2. Run `python manage.py makemigrations`
3. Run `python manage.py migrate`
4. Create serializer in `backend/courses/serializers.py`
5. Add ViewSet in `backend/courses/views.py`
6. Register router in `backend/courses/urls.py`

### Adding New Frontend Pages
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Update navigation in `frontend/src/components/Header.jsx`

### Customizing Design
- Edit `frontend/tailwind.config.js` for theme customization
- Modify `frontend/src/index.css` for global styles
- Update component styles in individual component files

## Production Deployment

### Backend
1. Set `DEBUG = False` in `backend/config/settings.py`
2. Configure `ALLOWED_HOSTS`
3. Use PostgreSQL instead of SQLite
4. Set up proper static file serving
5. Use Gunicorn or uWSGI as WSGI server
6. Configure Nginx as reverse proxy

### Frontend
1. Build production bundle: `npm run build`
2. Serve static files with Nginx or similar
3. Configure environment variables for API URL
4. Enable HTTPS

## Security Features

- Token-based authentication
- CSRF protection
- Admin-only access to management features
- File upload validation
- CORS configuration
- Secure password handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is for educational purposes.

## Support

For issues or questions, please contact the development team.

## Course Information

- **Course Name**: Data Structure Using C
- **Course Code**: NCCML4403
- **Technology**: C Programming
- **Level**: Undergraduate

## Credits

Built with modern web technologies following best practices for educational platforms.
