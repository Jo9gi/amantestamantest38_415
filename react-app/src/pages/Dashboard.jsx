import { useAuth } from '../hooks';

export default function Dashboard() {
  const { user } = useAuth();
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email?.split('@')[0] || 'User';
  const initial = (fullName.charAt(0) || 'U').toUpperCase();

  return (
    <div className="animate-fade-in">
      <div className="rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-800 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xl">{initial}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize leading-tight">
              Welcome customer, {fullName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening with your account today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
