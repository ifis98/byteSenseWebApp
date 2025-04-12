'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import HomePageNav from './components/common/nav';
import Sidebar from './components/common/drawer';
import PatientRequest from './components/homepageContent/patientRequest';
import PatientList from './components/homepageContent/patientList';
import PatientReport from './components/homepageContent/patientReport';
import ComingSoon from './components/homepageContent/comingSoon';
import styles from '../styles/HomePage.module.scss';

function HomePage() {
  const path = usePathname();
  // A state that we update just to force a re-render on hash changes.
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    const handleHashChange = () => {
      setUpdateCounter((prev) => prev + 1);
      console.log('Hash changed, new window.location.href:', window.location.href);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Using window.location.href to determine the current hash.
  const currentURL = typeof window !== 'undefined' ? window.location.href : '';
  const currentHash = currentURL.split('#')[1] ? `#${currentURL.split('#')[1]}` : '';

  console.log('Current path:', path, 'Current hash:', currentHash);

  const renderComponent = () => {
    if (path === '/list') {
      // If the current URL hash exactly equals "#report", then render PatientReport.
      // Otherwise, render PatientList.
      if (currentHash === '#report') {
        return <PatientReport key="report" />;
      } else {
        return <PatientList key="list" />;
      }
    }
    if (path === '/' || path === '/home') return <ComingSoon />;
    if (path.startsWith('/request')) return <PatientRequest />;
    if (
      path.startsWith('/chat') ||
      path.startsWith('/alerts') ||
      path.startsWith('/help')
    ) {
      return <ComingSoon />;
    }
    return <ComingSoon />;
  };

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <HomePageNav />
        {renderComponent()}
      </div>
    </div>
  );
}

export default HomePage;
