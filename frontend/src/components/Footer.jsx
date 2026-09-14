import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto dark:bg-gray-800 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
              Notes with Neeraj Sir
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Subject-wise modules, notes, and PDFs for Data Structure Using C, Python, DBMS, and other courses.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  Subjects
                </Link>
              </li>
              <li>
                <Link to="/materials" className="text-gray-600 hover:text-primary-600 text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  All Notes
                </Link>
              </li>
              <li>
                <Link to="/syllabus" className="text-gray-600 hover:text-primary-600 text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  Syllabus
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-600 hover:text-primary-600 text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  Academic Calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
              Contact
            </h3>
            <div className="space-y-2">
              <a href="mailto:support@lms.edu" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 text-sm dark:text-gray-400 dark:hover:text-primary-400">
                <Mail className="w-4 h-4" />
                support@lms.edu
              </a>
              <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                <BookOpen className="w-4 h-4" />
                Academic Resources
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center dark:border-gray-700">
          <p className="text-gray-500 text-sm dark:text-gray-400">
            © 2026 Notes with Neeraj Sir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
