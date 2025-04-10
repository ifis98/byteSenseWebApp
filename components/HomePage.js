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
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash);
    }
  }, []);

  const renderComponent = () => {
    if (path === '/list' && hash === '#report') return <PatientReport />;
    if (path === '/' || path === '/home') return <ComingSoon />;
    if (path.startsWith('/list')) return <PatientList />;
    if (path.startsWith('/request')) return <PatientRequest />;
    if (path.startsWith('/chat') || path.startsWith('/alerts') || path.startsWith('/help')) {
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
