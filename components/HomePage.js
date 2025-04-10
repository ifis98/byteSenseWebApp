'use client';

import React from "react";
import { usePathname } from 'next/navigation';
import HomePageNav from "./components/common/nav";
import Drawer from "./components/common/drawer";
import PatientRequest from "./components/homepageContent/patientRequest";
import PatientList from "./components/homepageContent/patientList";
import PatientReport from "./components/homepageContent/patientReport";
import ComingSoon from "./components/homepageContent/comingSoon";
import styles from '../styles/HomePage.module.scss'; // if you have one

function switchComp(path) {
  switch (true) {
    case path === "/list#report":
      return <PatientReport />;
    case path === "/" || path === "/home":
      return <ComingSoon />;
    case path.startsWith("/list"):
      return <PatientList />;
    case path.startsWith("/chat"):
    case path.startsWith("/alerts"):
    case path.startsWith("/help"):
      return <ComingSoon />;
    case path.startsWith("/request"):
      return <PatientRequest />;
    default:
      return <ComingSoon />;
  }
}

function HomePage() {
  const path = usePathname();

  return (
    <div id="homePage">
      <HomePageNav />
      <Drawer />
      {switchComp(path)}
    </div>
  );
}

export default HomePage;
