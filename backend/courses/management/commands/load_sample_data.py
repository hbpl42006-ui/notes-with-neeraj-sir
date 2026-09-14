from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from courses.models import Course, Module, StudyMaterial, Syllabus, AcademicEvent
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Load sample subjects, modules, and notes for Notes with Neeraj Sir'

    def handle(self, *args, **options):
        self.stdout.write('Loading sample data...')

        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@lms.edu',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user: admin / admin123'))

        admin = User.objects.get(username='admin')
        today = datetime.now().date()

        subjects = [
            {
                'code': 'NCCML4403',
                'name': 'Data Structure Using C',
                'description': 'Learn fundamental and advanced data structures, algorithms, linked lists, stacks, queues, recursion and problem-solving using C programming.',
                'technology': 'C Programming',
                'modules': [
                    {
                        'number': 1,
                        'title': 'Module 1',
                        'description': 'Introduction to recursion, backtracking, and problem-solving techniques',
                        'materials': [
                            {'title': 'Backtracking', 'description': 'Introduction to backtracking algorithm with examples', 'file_type': 'pdf'},
                            {'title': 'Tower of Hanoi (TOH)', 'description': 'Tower of Hanoi problem and recursive solution', 'file_type': 'pdf'},
                            {'title': 'Non-Tail Recursion Example', 'description': 'Examples of non-tail recursive functions', 'file_type': 'code'},
                        ],
                    },
                    {
                        'number': 2,
                        'title': 'Module 2',
                        'description': 'Data structures: linked lists, stacks, queues and their implementations',
                        'materials': [
                            {'title': 'Introduction to Linked List', 'description': 'Basic concepts and operations on linked lists', 'file_type': 'pdf'},
                            {'title': 'Linked List (C Program)', 'description': 'Complete C program for linked list operations', 'file_type': 'code'},
                            {'title': 'Circular Linked List', 'description': 'Circular linked list data structure', 'file_type': 'pdf'},
                            {'title': 'Basics of Queue', 'description': 'Queue data structure fundamentals', 'file_type': 'pdf'},
                            {'title': 'Stack using Array', 'description': 'Array-based stack implementation', 'file_type': 'code'},
                            {'title': 'Application of Stack', 'description': 'Real-world applications of stack data structure', 'file_type': 'pdf'},
                        ],
                    },
                ],
                'notes': [
                    {'title': 'DSA Quick Revision Notes', 'description': 'Compact PDF notes covering Modules 1 and 2', 'file_type': 'pdf'},
                    {'title': 'C Programs Cheatsheet', 'description': 'Common C implementations for interviews', 'file_type': 'pdf'},
                ],
                'syllabus': '''Module 1: Fundamentals & Recursion
- Introduction to Recursion
- Backtracking Algorithms
- Tower of Hanoi Problem

Module 2: Linked List, Stack & Queue
- Linked List Operations
- Stack and Queue Implementation
- Applications
''',
                'events': [
                    {'title': 'Introduction to Data Structures', 'description': 'First class of the semester', 'event_type': 'class', 'date': today + timedelta(days=7), 'time': '10:00:00'},
                    {'title': 'DSA Mid-Term', 'description': 'Covers Modules 1 and 2', 'event_type': 'exam', 'date': today + timedelta(days=30), 'time': '09:00:00'},
                ],
            },
            {
                'code': 'PYTHON101',
                'name': 'Python Programming',
                'description': 'Start with Python syntax and build up to object-oriented programming, with notes and PDFs for every topic.',
                'technology': 'Python',
                'modules': [
                    {
                        'number': 1,
                        'title': 'Python Basics',
                        'description': 'Variables, data types, control flow, functions, and standard library essentials',
                        'materials': [
                            {'title': 'Python Syntax Overview', 'description': 'Variables, operators, and control statements', 'file_type': 'pdf'},
                            {'title': 'Functions and Modules', 'description': 'Writing reusable Python functions', 'file_type': 'pdf'},
                        ],
                    },
                    {
                        'number': 2,
                        'title': 'OOP',
                        'description': 'Classes, objects, inheritance, and polymorphism in Python',
                        'materials': [
                            {'title': 'Classes and Objects', 'description': 'Building classes in Python', 'file_type': 'pdf'},
                            {'title': 'Inheritance Notes', 'description': 'Single and multiple inheritance examples', 'file_type': 'pdf'},
                        ],
                    },
                ],
                'notes': [
                    {'title': 'Python Interview Notes', 'description': 'Frequently asked Python questions and answers', 'file_type': 'pdf'},
                ],
                'syllabus': '''Python Basics
- Syntax, data types, loops, functions

OOP
- Classes, objects, inheritance, polymorphism
''',
                'events': [
                    {'title': 'Python Lab', 'description': 'Hands-on basics lab', 'event_type': 'class', 'date': today + timedelta(days=8), 'time': '14:00:00'},
                ],
            },
            {
                'code': 'DBMS201',
                'name': 'DBMS',
                'description': 'Relational databases, SQL, and normalization with downloadable notes and PDFs.',
                'technology': 'SQL',
                'modules': [
                    {
                        'number': 1,
                        'title': 'SQL',
                        'description': 'SELECT, JOINs, aggregations, and writing queries',
                        'materials': [
                            {'title': 'SQL Basics', 'description': 'DDL, DML, and simple queries', 'file_type': 'pdf'},
                            {'title': 'Joins and Subqueries', 'description': 'INNER, LEFT, RIGHT joins with examples', 'file_type': 'pdf'},
                        ],
                    },
                    {
                        'number': 2,
                        'title': 'Normalization',
                        'description': '1NF, 2NF, 3NF, BCNF and how to design schemas',
                        'materials': [
                            {'title': 'Normalization Steps', 'description': 'Worked examples from 1NF to BCNF', 'file_type': 'pdf'},
                        ],
                    },
                ],
                'notes': [
                    {'title': 'DBMS Formula Sheet', 'description': 'Keys, normal forms, and ER diagrams', 'file_type': 'pdf'},
                ],
                'syllabus': '''SQL
- Queries, joins, aggregations

Normalization
- 1NF, 2NF, 3NF, BCNF
''',
                'events': [
                    {'title': 'SQL Quiz', 'description': 'Short quiz on SELECT and JOINs', 'event_type': 'exam', 'date': today + timedelta(days=21), 'time': '11:00:00'},
                ],
            },
        ]

        for subject in subjects:
            course, created = Course.objects.get_or_create(
                code=subject['code'],
                defaults={
                    'name': subject['name'],
                    'description': subject['description'],
                    'technology': subject['technology'],
                    'level': 'Undergraduate',
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created subject: {course.name}'))

            for module_data in subject['modules']:
                module, created = Module.objects.get_or_create(
                    course=course,
                    module_number=module_data['number'],
                    defaults={
                        'title': module_data['title'],
                        'description': module_data['description'],
                        'is_notes_collection': False,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'  Created {module.title}'))
                else:
                    module.title = module_data['title']
                    module.description = module_data['description']
                    module.is_notes_collection = False
                    module.save()

                for material_data in module_data['materials']:
                    StudyMaterial.objects.get_or_create(
                        module=module,
                        title=material_data['title'],
                        defaults={
                            **material_data,
                            'uploaded_by': admin,
                        }
                    )

            notes_module, created = Module.objects.get_or_create(
                course=course,
                module_number=99,
                defaults={
                    'title': 'Notes / PDFs',
                    'description': f'All extra notes and PDFs for {course.name}',
                    'is_notes_collection': True,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created Notes/PDFs folder'))
            else:
                notes_module.title = 'Notes / PDFs'
                notes_module.is_notes_collection = True
                notes_module.save()

            for material_data in subject['notes']:
                StudyMaterial.objects.get_or_create(
                    module=notes_module,
                    title=material_data['title'],
                    defaults={
                        **material_data,
                        'uploaded_by': admin,
                    }
                )

            Syllabus.objects.get_or_create(
                course=course,
                defaults={
                    'title': f'{course.name} Syllabus',
                    'content': subject['syllabus'],
                }
            )

            for event_data in subject['events']:
                AcademicEvent.objects.get_or_create(
                    course=course,
                    title=event_data['title'],
                    defaults={**event_data, 'course': course}
                )

        AcademicEvent.objects.get_or_create(
            title='Fall Break',
            defaults={
                'description': 'No classes during fall break',
                'event_type': 'holiday',
                'date': today + timedelta(days=45),
            }
        )

        self.stdout.write(self.style.SUCCESS('Sample data loaded successfully!'))
        self.stdout.write('Login with: admin / admin123')
