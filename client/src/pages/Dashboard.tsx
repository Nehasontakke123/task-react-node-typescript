import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, ShieldCheck, Users, UserRoundCheck, X } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import { api } from '../services/api';
import { decryptPayload, encryptPayload } from '../utils/crypto';
import type { EncryptedStudent, Student, StudentFormValues } from '../types';

const courses = ['All courses', 'Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design'];
const genders = ['All genders', 'Male', 'Female', 'Other'];
const pageSize = 6;

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState(courses[0]);
  const [gender, setGender] = useState(genders[0]);
  const [page, setPage] = useState(1);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<{ students: EncryptedStudent[] }>('/students');
      // Backend removes its AES layer. The browser removes the final frontend AES layer for display.
      const decrypted = data.students.map((item) => ({
        ...decryptPayload<Omit<Student, '_id' | 'createdAt' | 'updatedAt'>>(item.payload),
        _id: item._id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      setStudents(decrypted);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to load students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const text = `${student.fullName} ${student.email} ${student.phoneNumber}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCourse = course === 'All courses' || student.courseEnrolled === course;
      const matchesGender = gender === 'All genders' || student.gender === gender;
      return matchesSearch && matchesCourse && matchesGender;
    });
  }, [students, search, course, gender]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const pagedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, course, gender]);

  const analytics = [
    { label: 'Total Students', value: students.length, icon: Users },
    { label: 'Active Courses', value: new Set(students.map((student) => student.courseEnrolled)).size, icon: ShieldCheck },
    { label: 'Filtered Results', value: filteredStudents.length, icon: UserRoundCheck },
  ];

  const openCreate = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values: StudentFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = encryptPayload(values);
      if (editingStudent) {
        await api.put(`/student/${editingStudent._id}`, { payload });
        toast.success('Student updated');
      } else {
        await api.post('/register', { payload });
        toast.success('Student registered');
      }
      setFormOpen(false);
      setEditingStudent(null);
      await fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/student/${deleteTarget._id}`);
      toast.success('Student deleted');
      setDeleteTarget(null);
      await fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete student');
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {analytics.map(({ label, value, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
                <Icon className="h-6 w-6" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-6 glass-card rounded-xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input-field pl-9" placeholder="Search by name, email, or phone" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <select value={course} onChange={(event) => setCourse(event.target.value)} className="input-field">
              {courses.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={gender} onChange={(event) => setGender(event.target.value)} className="input-field">
              {genders.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <button onClick={openCreate} className="btn-primary py-2.5">
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </section>

      <section className="mt-6">
        {isLoading ? (
          <div className="glass-card rounded-xl p-5">
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-200/80 dark:bg-white/10" />
              ))}
            </div>
          </div>
        ) : (
          <StudentList
            students={pagedStudents}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onEdit={(student) => {
              setEditingStudent(student);
              setFormOpen(true);
            }}
            onDelete={setDeleteTarget}
          />
        )}
      </section>

      <AnimatePresence>
        {formOpen && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/30 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Encrypted form</p>
                  <h2 className="text-2xl font-black">{editingStudent ? 'Update Student' : 'Register Student'}</h2>
                </div>
                <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setFormOpen(false)} aria-label="Close form">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <StudentForm initialStudent={editingStudent} isSubmitting={isSubmitting} onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-950">
              <h2 className="text-xl font-black">Delete student?</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                This will permanently remove {deleteTarget.fullName} from the database.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700" onClick={confirmDelete}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Dashboard;
