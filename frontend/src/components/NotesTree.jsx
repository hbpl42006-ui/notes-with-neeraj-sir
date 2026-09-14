import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, FolderOpen } from 'lucide-react';
import { folderLabel } from '../utils/folders';

const NotesTree = ({ subjects }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-primary-50 dark:border-gray-700 dark:bg-primary-900/20">
        <FolderOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Notes with Neeraj Sir</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Open a subject, then a module or Notes/PDFs
          </p>
        </div>
      </div>

      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {subjects.map(({ course, folders }) => {
          return (
            <li key={course.id} className="px-5 py-4">
              <Link
                to={`/courses/${course.id}`}
                className="flex items-center justify-between gap-3 group"
              >
                <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                  <span className="text-gray-400 font-mono text-sm w-6">
                    ├──
                  </span>
                  <FolderOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  {course.name}
                </span>
                <span className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400">
                  Open
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              <ul className="mt-2 ml-8 space-y-1">
                {folders.map((folder, folderIndex) => {
                  const isLastFolder = folderIndex === folders.length - 1;
                  return (
                    <li key={folder.id}>
                      <Link
                        to={`/modules/${folder.id}`}
                        className="flex items-center gap-2 py-1.5 text-sm text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                      >
                        <span className="text-gray-400 font-mono text-sm w-6">
                          {isLastFolder ? '└──' : '├──'}
                        </span>
                        {folder.is_notes_collection ? (
                          <FileText className="w-4 h-4 text-gray-500" />
                        ) : (
                          <FolderOpen className="w-4 h-4 text-gray-500" />
                        )}
                        <span>{folderLabel(folder)}</span>
                        <span className="text-xs text-gray-400">
                          {folder.material_count || 0} {(folder.material_count || 0) === 1 ? 'file' : 'files'}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
        <li className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-sm w-6">└──</span>
            Other Subjects...
          </span>
        </li>
      </ul>
    </div>
  );
};

export default NotesTree;
