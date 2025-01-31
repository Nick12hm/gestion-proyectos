import Sidebar from './sidebar/page';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
  }

  const Layout = ({ children }: LayoutProps) => {
    return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;