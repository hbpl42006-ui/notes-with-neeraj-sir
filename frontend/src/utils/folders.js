export function folderLabel(module) {
  if (!module) return '';
  if (module.is_notes_collection) return module.title || 'Notes/PDFs';
  return module.title;
}

export function groupModulesByCourse(courses, modules) {
  return courses.map((course) => {
    const folders = modules
      .filter((module) => String(module.course) === String(course.id))
      .sort((a, b) => {
        if (a.is_notes_collection !== b.is_notes_collection) {
          return a.is_notes_collection ? 1 : -1;
        }
        return (a.module_number || 0) - (b.module_number || 0);
      });
    return { course, folders };
  });
}
