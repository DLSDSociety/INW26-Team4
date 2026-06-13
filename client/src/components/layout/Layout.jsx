import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-surface">
    <Navbar />
    <main className="flex-1 w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;