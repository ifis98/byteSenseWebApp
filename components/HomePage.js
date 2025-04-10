'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
    // Set initial hash
    setHash(window.location.hash);

    // Listen for hash changes
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderComponent = () => {
    // For debugging
    console.log('Current path:', path);
    console.log('Current hash:', hash);

    if (path === '/list') {
      if (hash === '#report') {
        return <PatientReport />;
      } else {
        return <PatientList />;
      }
    }

    if (path === '/' || path === '/home') return <ComingSoon />;
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