"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // ✅ for client components
import HomePageNav from "./components/common/nav";
import Sidebar from "./components/common/drawer";
import PatientRequest from "./components/homepageContent/patientRequest";
import PatientList from "./components/homepageContent/patientList";
import PatientReport from "./components/homepageContent/patientReport";
import ComingSoon from "./components/homepageContent/comingSoon";
import OrderForm from "./components/homepageContent/orderForm";
import OrderSuccess from "./components/homepageContent/orderSuccess";
import PreOrderForm from "./components/homepageContent/preorder";
import PreorderSuccess from "./components/homepageContent/preorderSuccess";

import styles from "../styles/HomePage.module.scss";
import FAQ from "./components/homepageContent/FAQ";
import StaffTraining from "./components/homepageContent/StaffTraining";
import ProductInformation from "./components/homepageContent/ProductInformation";
import SalesMaterial from "./components/homepageContent/SalesMaterial";
import LabSlip from "./components/homepageContent/LabSlip";
import FAQ1 from "./components/homepageContent/FAQ1";

function HomePage() {
  const path = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
        setAuthChecked(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setUpdateCounter((prev) => prev + 1);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  if (!authChecked) return null; // Wait for token check before rendering

  const currentURL = typeof window !== "undefined" ? window.location.href : "";
  const currentHash = currentURL.split("#")[1]
    ? `#${currentURL.split("#")[1]}`
    : "";

  const renderComponent = () => {
    if (path === "/list") {
      return currentHash === "#report" ? (
        <PatientReport key="report" />
      ) : (
        <PatientList key="list" />
      );
    }
    if (path === "/" || path === "/home") return <PreOrderForm />;
    if (path.startsWith("/request")) return <PatientRequest />;
    if (path === "/order") return <OrderForm />;
    if (path === "/order-success") return <OrderSuccess />;
    if (path === "/preorder-success") return <PreorderSuccess />;
    if (
      path.startsWith("/chat") ||
      path.startsWith("/alerts") ||
      path.startsWith("/help")
    ) {
      return <ComingSoon />;
    }
    if (path === "/faq") return <FAQ />;
    if (path === "/faq1") return <FAQ1 />;
    if (path === "/staff_training") return <StaffTraining />;
    if (path === "/product_information") return <ProductInformation />;
    if (path === "/sales_material") return <SalesMaterial />;
    if (path === "/lab_slip") return <LabSlip />;
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

//note
