import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Wallet, ArrowDownToLine } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/explorar', icon: Compass, label: 'Explorar' },
  { to: '/wallet', icon: Wallet, label: 'Carteira' },
  { to: '/depositar', icon: ArrowDownToLine, label: 'Depositar' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-card-border flex lg:hidden z-40">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            [
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all duration-150',
              isActive ? 'text-violet-600' : 'text-gray-400',
            ].join(' ')
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
