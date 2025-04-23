import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Flame, Home, Plus, Compass, User, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Flame className="h-8 w-8 text-purple-600" />
          <span className="text-xl font-bold text-gray-900 hidden sm:inline-block">LoopList</span>
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-1 sm:space-x-4">
            <nav className="hidden sm:flex space-x-1">
              <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline-block">Home</span>
              </NavLink>
              <NavLink to="/create" active={location.pathname === '/create'}>
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline-block">Create</span>
              </NavLink>
              <NavLink to="/discover" active={location.pathname === '/discover'}>
                <Compass className="h-5 w-5" />
                <span className="hidden sm:inline-block">Discover</span>
              </NavLink>
            </nav>
            
            <div className="flex items-center ml-4 space-x-3">
              <div className="flex items-center space-x-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full border border-gray-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-700" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                  {user?.name}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                aria-label="Log out"
                className="text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-x-3">
            <Button 
              as={Link} 
              to="/login" 
              variant="outline" 
              size="sm"
              className="hidden sm:inline-flex"
            >
              Log in
            </Button>
            <Button as={Link} to="/signup" size="sm">
              Sign up
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-2">
          <div className="flex justify-around">
            <NavLink to="/dashboard" active={location.pathname === '/dashboard'} isMobile>
              <Home className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </NavLink>
            <NavLink to="/create" active={location.pathname === '/create'} isMobile>
              <Plus className="h-6 w-6" />
              <span className="text-xs">Create</span>
            </NavLink>
            <NavLink to="/discover" active={location.pathname === '/discover'} isMobile>
              <Compass className="h-6 w-6" />
              <span className="text-xs">Discover</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children, isMobile = false }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center space-x-1 px-3 py-2 rounded-md transition-colors',
        {
          'bg-purple-100 text-purple-700': active,
          'text-gray-700 hover:bg-gray-100': !active,
          'flex-col space-y-1 space-x-0': isMobile
        }
      )}
    >
      {children}
    </Link>
  );
};

// Import cn utility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};