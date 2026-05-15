import { Plus, Edit, Trash2, Video, ArrowLeft, LayoutDashboard, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const adminOptions = [
  {
    id: 'create',
    title: 'Create Problem',
    description: 'Add a new coding problem to the platform',
    icon: Plus,
    iconBg: 'bg-[rgba(16,185,129,0.12)]',
    iconColor: 'text-[#34d399]',
    route: '/admin/create',
  },
  {
    id: 'update',
    title: 'Update Problem',
    description: 'Edit existing problems and their details',
    icon: Edit,
    iconBg: 'bg-[rgba(245,158,11,0.12)]',
    iconColor: 'text-[#fbbf24]',
    route: '/admin/update',
  },
  {
    id: 'delete',
    title: 'Delete Problem',
    description: 'Remove problems from the platform',
    icon: Trash2,
    iconBg: 'bg-[rgba(239,68,68,0.12)]',
    iconColor: 'text-[#f87171]',
    route: '/admin/delete',
  },
  {
    id: 'video',
    title: 'Video Problem',
    description: 'Upload and delete video solutions',
    icon: Video,
    iconBg: 'bg-[rgba(99,102,241,0.12)]',
    iconColor: 'text-[#a5b4fc]',
    route: '/admin/video',
  },
  {
    id: 'contest',
    title: 'Manage Contests',
    description: 'Create and manage coding contests',
    icon: Trophy,
    iconBg: 'bg-[rgba(6,182,212,0.12)]',
    iconColor: 'text-[#22d3ee]',
    route: '/admin/contest',
  },
];

function Admin() {
  return (
    <div className="min-h-screen bg-[var(--cc-bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Home</span>
        </NavLink>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[rgba(99,102,241,0.12)]">
              <LayoutDashboard size={24} className="text-[var(--cc-primary-light)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--cc-text-primary)]">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[var(--cc-text-secondary)] text-base ml-[52px]">
            Manage coding problems and video content on your platform
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {adminOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="cc-card group p-6 flex flex-col items-center text-center">
                <div className={`${option.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={26} className={option.iconColor} />
                </div>

                <h2 className="text-lg font-semibold text-[var(--cc-text-primary)] mb-2">
                  {option.title}
                </h2>

                <p className="text-sm text-[var(--cc-text-secondary)] mb-6 leading-relaxed">
                  {option.description}
                </p>

                <NavLink
                  to={option.route}
                  className="mt-auto cc-btn-primary w-full text-center text-sm inline-block"
                >
                  {option.title}
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
