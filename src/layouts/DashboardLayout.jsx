import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Notification from '../components/common/Notification';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={handleCloseSidebar}
      />

      <div className={styles.main}>
        <Header onToggleSidebar={handleToggleSidebar} />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <Notification />
    </div>
  );
}
