import { useEffect, useMemo, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Edit3,
  GraduationCap,
  IndianRupee,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type CourseStatus = 'Active' | 'Draft' | 'Archived';

interface Course {
  id: string;
  name: string;
  duration: string;
  students: number;
  instructor: string;
  description: string;
  fees: number;
  status: CourseStatus;
  completion: number;
  growth: number;
}

const initialCourses: Course[] = [
  { id: 'CRS-101', name: 'Web Development', duration: '6 Months', students: 128, instructor: 'Aarav Mehta', description: 'Modern frontend, backend, and deployment workflows.', fees: 45000, status: 'Active', completion: 88, growth: 18 },
  { id: 'CRS-102', name: 'Data Science', duration: '8 Months', students: 96, instructor: 'Maya Rao', description: 'Python, statistics, ML foundations, and dashboards.', fees: 62000, status: 'Active', completion: 82, growth: 22 },
  { id: 'CRS-103', name: 'UI/UX Design', duration: '4 Months', students: 74, instructor: 'Riya Kapoor', description: 'Research, wireframes, design systems, and prototyping.', fees: 38000, status: 'Active', completion: 76, growth: 14 },
  { id: 'CRS-104', name: 'Machine Learning', duration: '7 Months', students: 68, instructor: 'Kabir Sen', description: 'Supervised learning, neural networks, and model delivery.', fees: 72000, status: 'Draft', completion: 64, growth: 16 },
  { id: 'CRS-105', name: 'Cyber Security', duration: '5 Months', students: 82, instructor: 'Neha Iyer', description: 'Security fundamentals, monitoring, and ethical testing.', fees: 56000, status: 'Active', completion: 79, growth: 19 },
  { id: 'CRS-106', name: 'Cloud Computing', duration: '6 Months', students: 91, instructor: 'Ishaan Nair', description: 'Cloud architecture, containers, networking, and CI/CD.', fees: 59000, status: 'Active', completion: 84, growth: 25 },
];

const statusOptions = ['All status', 'Active', 'Draft', 'Archived'];
const pageSize = 5;
const chartColors = ['#0891b2', '#10b981', '#f97316', '#6366f1', '#e11d48', '#14b8a6'];

const emptyCourse: Omit<Course, 'id' | 'students' | 'completion' | 'growth'> = {
  name: '',
  duration: '',
  instructor: '',
  description: '',
  fees: 0,
  status: 'Active',
};

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const Counter = ({ value, suffix = '' }: { value: number | string; suffix?: string }) => (
  <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    {value}
    {suffix}
  </motion.span>
);

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(statusOptions[0]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyCourse);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesText = `${course.name} ${course.instructor} ${course.description}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'All status' || course.status === status;
      return matchesText && matchesStatus;
    });
  }, [courses, search, status]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const pagedCourses = filteredCourses.slice((page - 1) * pageSize, page * pageSize);
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const popularCourse = courses.reduce((top, course) => (course.students > top.students ? course : top), courses[0]);
  const completionRate = Math.round(courses.reduce((sum, course) => sum + course.completion, 0) / courses.length);

  const analytics = [
    { label: 'Total Courses', value: courses.length, icon: GraduationCap, accent: 'from-cyan-500 to-blue-600' },
    { label: 'Active Students', value: totalStudents, icon: Users, accent: 'from-emerald-500 to-teal-600' },
    { label: 'Most Popular Course', value: popularCourse.name, icon: Award, accent: 'from-orange-500 to-rose-600' },
    { label: 'Completion Rate', value: completionRate, suffix: '%', icon: CheckCircle2, accent: 'from-indigo-500 to-cyan-600' },
  ];

  const growthData = courses.map((course) => ({ name: course.name.replace(' ', '\n'), students: course.students, growth: course.growth }));

  const openCreate = () => {
    setEditingCourse(null);
    setForm(emptyCourse);
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({
      name: course.name,
      duration: course.duration,
      instructor: course.instructor,
      description: course.description,
      fees: course.fees,
      status: course.status,
    });
    setModalOpen(true);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.duration.trim() || !form.instructor.trim() || !form.description.trim() || form.fees <= 0) {
      toast.error('Please complete all course fields');
      return;
    }

    if (editingCourse) {
      setCourses((current) => current.map((course) => (course.id === editingCourse.id ? { ...course, ...form } : course)));
      toast.success('Course updated');
    } else {
      setCourses((current) => [
        {
          ...form,
          id: `CRS-${Math.floor(200 + Math.random() * 700)}`,
          students: 0,
          completion: 0,
          growth: 0,
        },
        ...current,
      ]);
      toast.success('Course added');
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCourses((current) => current.filter((course) => course.id !== deleteTarget.id));
    toast.success('Course deleted');
    setDeleteTarget(null);
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Academic operations</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Courses Management</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage all enrolled professional courses</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-3">
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analytics.map(({ label, value, suffix, icon: Icon, accent }, index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -4 }} className="glass-card overflow-hidden rounded-xl p-5">
            <div className={`mb-5 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                  <Counter value={value} suffix={suffix} />
                </p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
                <Icon className="h-6 w-6" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="glass-card rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Course popularity</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Students enrolled by course</p>
            </div>
            <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e2ee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(8,145,178,0.08)' }} />
                <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                  {growthData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Student growth</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Course growth momentum</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-4">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{course.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">{course.completion}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${course.completion}%` }} className="h-2 rounded-full bg-cyan-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 glass-card rounded-xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input-field pl-9" placeholder="Search courses or instructors" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input-field lg:w-56">
            {statusOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="mt-6">
        {isLoading ? (
          <div className="glass-card rounded-xl p-5">
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-200/80 dark:bg-white/10" />)}</div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-cyan-600 dark:text-cyan-300" />
            <p className="mt-4 text-lg font-bold">No courses found</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try a different search or create a new course.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-4">Course Name</th>
                    <th className="px-4 py-4">Duration</th>
                    <th className="px-4 py-4">Students Enrolled</th>
                    <th className="px-4 py-4">Instructor</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {pagedCourses.map((course) => (
                    <tr key={course.id} className="transition hover:bg-cyan-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-4">
                        <p className="font-bold">{course.name}</p>
                        <p className="max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">{course.description}</p>
                      </td>
                      <td className="px-4 py-4">{course.duration}</td>
                      <td className="px-4 py-4">{course.students}</td>
                      <td className="px-4 py-4">{course.instructor}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${course.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200' : course.status === 'Draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(course)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700 dark:border-white/10 dark:text-slate-300" aria-label={`Edit ${course.name}`}>
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(course)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-rose-200 hover:text-rose-700 dark:border-white/10 dark:text-slate-300" aria-label={`Delete ${course.name}`}>
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
                <button className="btn-secondary px-3 py-1.5" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                <button className="btn-secondary px-3 py-1.5" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {modalOpen && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/30 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Course details</p>
                  <h2 className="text-2xl font-black">{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
                </div>
                <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setModalOpen(false)} aria-label="Close course form">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Course Name</label>
                  <input className="input-field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </div>
                <div>
                  <label className="label">Duration</label>
                  <input className="input-field" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} placeholder="6 Months" />
                </div>
                <div>
                  <label className="label">Instructor Name</label>
                  <input className="input-field" value={form.instructor} onChange={(event) => setForm({ ...form, instructor: event.target.value })} />
                </div>
                <div>
                  <label className="label">Fees</label>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input type="number" className="input-field pl-9" value={form.fees || ''} onChange={(event) => setForm({ ...form, fees: Number(event.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input-field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as CourseStatus })}>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </div>
                <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save course</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-950">
              <h2 className="text-xl font-black">Delete course?</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This will remove {deleteTarget.name} from the course catalog.</p>
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

export default Courses;
