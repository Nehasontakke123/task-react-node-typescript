import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDownToLine,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  FileDown,
  FileText,
  IndianRupee,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ReportRow {
  id: string;
  studentName: string;
  course: string;
  status: 'Completed' | 'In Progress' | 'At Risk';
  generatedDate: string;
}

const monthlyRegistrations = [
  { month: 'Jan', students: 42, revenue: 320000 },
  { month: 'Feb', students: 58, revenue: 410000 },
  { month: 'Mar', students: 66, revenue: 470000 },
  { month: 'Apr', students: 81, revenue: 610000 },
  { month: 'May', students: 94, revenue: 720000 },
  { month: 'Jun', students: 116, revenue: 850000 },
  { month: 'Jul', students: 132, revenue: 980000 },
];

const genderDistribution = [
  { name: 'Female', value: 52 },
  { name: 'Male', value: 43 },
  { name: 'Other', value: 5 },
];

const enrollmentData = [
  { course: 'Web Dev', enrollments: 128, completed: 96 },
  { course: 'Data Science', enrollments: 96, completed: 74 },
  { course: 'UI/UX', enrollments: 74, completed: 55 },
  { course: 'ML', enrollments: 68, completed: 42 },
  { course: 'Cyber Sec', enrollments: 82, completed: 61 },
  { course: 'Cloud', enrollments: 91, completed: 73 },
];

const progressData = [
  { stage: 'Onboarding', value: 96 },
  { stage: 'Assignments', value: 84 },
  { stage: 'Projects', value: 71 },
  { stage: 'Certification', value: 63 },
];

const reportRows: ReportRow[] = [
  { id: 'RPT-2401', studentName: 'Priya Sharma', course: 'Web Development', status: 'Completed', generatedDate: '2026-05-18' },
  { id: 'RPT-2402', studentName: 'Neha Sontakke', course: 'Data Science', status: 'In Progress', generatedDate: '2026-05-19' },
  { id: 'RPT-2403', studentName: 'Rohan Verma', course: 'Cloud Computing', status: 'Completed', generatedDate: '2026-05-20' },
  { id: 'RPT-2404', studentName: 'Aisha Khan', course: 'Cyber Security', status: 'At Risk', generatedDate: '2026-05-21' },
  { id: 'RPT-2405', studentName: 'Kabir Joshi', course: 'Machine Learning', status: 'In Progress', generatedDate: '2026-05-22' },
];

const activities = [
  '18 new students enrolled this week',
  'Cloud Computing completion improved by 9%',
  '3 course reports are ready for review',
  'Revenue crossed the monthly target by 12%',
];

const insights = [
  { title: 'Best performing course', value: 'Web Development', note: 'Highest completion and strongest enrollment velocity' },
  { title: 'Growth opportunity', value: 'Machine Learning', note: 'High interest, but needs mentoring support' },
  { title: 'Retention signal', value: '84%', note: 'Students remain active after first assessment' },
];

const chartColors = ['#0891b2', '#10b981', '#f97316', '#6366f1'];

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const AnimatedValue = ({ value, prefix = '', suffix = '' }: { value: number | string; prefix?: string; suffix?: string }) => (
  <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    {prefix}
    {value}
    {suffix}
  </motion.span>
);

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const totals = useMemo(() => {
    const totalStudents = enrollmentData.reduce((sum, item) => sum + item.enrollments, 0);
    const activeCourses = enrollmentData.length;
    const revenue = monthlyRegistrations.at(-1)?.revenue || 0;
    const completionRate = Math.round((enrollmentData.reduce((sum, item) => sum + item.completed, 0) / totalStudents) * 100);
    return { totalStudents, activeCourses, revenue, completionRate };
  }, []);

  const cards = [
    { label: 'Total Students', value: totals.totalStudents, icon: Users, accent: 'from-cyan-500 to-blue-600' },
    { label: 'Active Courses', value: totals.activeCourses, icon: BookOpen, accent: 'from-emerald-500 to-teal-600' },
    { label: 'Revenue Generated', value: formatCurrency(totals.revenue), icon: IndianRupee, accent: 'from-orange-500 to-rose-600' },
    { label: 'Completion Rate', value: totals.completionRate, suffix: '%', icon: CheckCircle2, accent: 'from-indigo-500 to-cyan-600' },
  ];

  const handleExport = (label: string) => {
    toast.success(`${label} started`);
  };

  if (isLoading) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 h-24 animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/10" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-36 animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/10" />)}
        </div>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/10" />)}
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Reports center</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Track enrollment, revenue, course performance, and student progress trends.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <button onClick={() => handleExport('PDF export')} className="btn-secondary">
            <FileDown className="h-4 w-4" />
            Export PDF
          </button>
          <button onClick={() => handleExport('CSV export')} className="btn-secondary">
            <FileText className="h-4 w-4" />
            Export CSV
          </button>
          <button onClick={() => handleExport('Report download')} className="btn-primary">
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, suffix, icon: Icon, accent }, index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -4 }} className="glass-card overflow-hidden rounded-xl p-5">
            <div className={`mb-5 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                  <AnimatedValue value={value} suffix={suffix} />
                </p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
                <Icon className="h-6 w-6" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <div className="glass-card rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Monthly registrations</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Student growth trends</p>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e2ee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Gender distribution</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Current student demographics</p>
            </div>
            <PieChartIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderDistribution} dataKey="value" nameKey="name" innerRadius={68} outerRadius={108} paddingAngle={4}>
                  {genderDistribution.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Course enrollments</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Enrollment versus completions</p>
            </div>
            <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-300" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e2ee" />
                <XAxis dataKey="course" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrollments" fill="#0891b2" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Revenue trend</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue generated</p>
            </div>
            <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRegistrations}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e2ee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-card rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Student Progress Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Learning stage completion</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
          </div>
          <div className="space-y-5">
            {progressData.map((item) => (
              <div key={item.stage}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold">{item.stage}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 dark:bg-white/10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.7 }} className="h-2.5 rounded-full bg-cyan-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass-card rounded-xl p-5">
            <h2 className="text-lg font-black">Recent Activities</h2>
            <div className="mt-4 space-y-3">
              {activities.map((activity, index) => (
                <motion.div key={activity} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-600" />
                  <p className="text-sm text-slate-700 dark:text-slate-200">{activity}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h2 className="text-lg font-black">Performance Insights</h2>
            <div className="mt-4 space-y-3">
              {insights.map((insight) => (
                <div key={insight.title} className="rounded-lg border border-slate-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{insight.title}</p>
                  <p className="mt-1 font-black">{insight.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{insight.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 glass-card overflow-hidden rounded-xl">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black">Generated Reports</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Latest student report exports</p>
          </div>
          <button onClick={() => handleExport('All reports download')} className="btn-secondary">
            <ArrowDownToLine className="h-4 w-4" />
            Download Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-4">Report ID</th>
                <th className="px-4 py-4">Student Name</th>
                <th className="px-4 py-4">Course</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Generated Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {reportRows.map((row) => (
                <tr key={row.id} className="transition hover:bg-cyan-50/50 dark:hover:bg-white/5">
                  <td className="px-4 py-4 font-bold">{row.id}</td>
                  <td className="px-4 py-4">{row.studentName}</td>
                  <td className="px-4 py-4">{row.course}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200' : row.status === 'In Progress' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{new Date(row.generatedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Reports;
