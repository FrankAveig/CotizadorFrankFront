import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import PortalSidebar from '../components/portal/PortalSidebar';
import PortalHeader from '../components/portal/PortalHeader';
import Notification from '../components/common/Notification';
import styles from './PortalLayout.module.css';

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      <PortalSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={handleCloseSidebar}
      />

      <div className={styles.main}>
        <PortalHeader onToggleSidebar={handleToggleSidebar} />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <Notification />
    </div>
  );
}
