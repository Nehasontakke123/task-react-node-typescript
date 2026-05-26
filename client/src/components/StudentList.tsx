import { Edit3, Trash2 } from 'lucide-react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  page: number;
  totalPages: number;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onPageChange: (page: number) => void;
}

const StudentList = ({ students, page, totalPages, onEdit, onDelete, onPageChange }: StudentListProps) => {
  if (!students.length) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <p className="text-lg font-bold">No students found</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try a different search or add a new student record.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-4">Student</th>
              <th className="px-4 py-4">Phone</th>
              <th className="px-4 py-4">Course</th>
              <th className="px-4 py-4">Gender</th>
              <th className="px-4 py-4">DOB</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {students.map((student) => (
              <tr key={student._id} className="transition hover:bg-cyan-50/50 dark:hover:bg-white/5">
                <td className="px-4 py-4">
                  <p className="font-bold">{student.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                </td>
                <td className="px-4 py-4">{student.phoneNumber}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-200">{student.courseEnrolled}</span>
                </td>
                <td className="px-4 py-4">{student.gender}</td>
                <td className="px-4 py-4">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(student)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700 dark:border-white/10 dark:text-slate-300" aria-label={`Edit ${student.fullName}`}>
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(student)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-rose-200 hover:text-rose-700 dark:border-white/10 dark:text-slate-300" aria-label={`Delete ${student.fullName}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 text-sm dark:border-white/10">
        <span className="text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button className="btn-secondary px-3 py-1.5" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
          <button className="btn-secondary px-3 py-1.5" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
