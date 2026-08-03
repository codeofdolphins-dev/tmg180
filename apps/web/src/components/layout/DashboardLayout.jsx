import Sidebar from './Sidebar';

export default function DashboardLayout({
  portalLabel,
  activeItem,
  role,
  center = true,
  children,
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <Sidebar portalLabel={portalLabel} activeItem={activeItem} role={role} />
      <main
        className={`flex-1 p-6 overflow-y-auto ${
          center ? 'flex items-center justify-center' : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
}
