import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Wallet, ArrowDownToLine } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/explorar', icon: Compass, label: 'Explorar' },
  { to: '/wallet', icon: Wallet, label: 'Carteira' },
  { to: '/depositar', icon: ArrowDownToLine, label: 'Depositar' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-card-border flex flex-col z-40">
      <div className="px-6 py-5 border-b border-card-border">
        <span className="font-display font-bold text-xl text-ink">
          De<span className="text-violet-600">SC</span>in
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-input text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-600 hover:bg-card hover:text-ink',
              ].join(' ')
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-card-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">Bernardo</p>
            <p className="text-xs text-gray-400 truncate">becoleao@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
