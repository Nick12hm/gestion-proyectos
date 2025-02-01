import Sidebar from './sidebar/page';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
  }

/**
 * Se usa este layout para manejar el Nav dinámico
 * @returns menu 
 */
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