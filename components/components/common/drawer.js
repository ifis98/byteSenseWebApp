'use client';

import React from "react";
import { ListGroup } from "react-bootstrap";
import styles from "../../../styles/common.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Drawer = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/list", icon: "perm_identity", label: "Patient List" },
    { href: "/request", icon: "group_add", label: "Patient Request" },
    { href: "/chat", icon: "chat_bubble_outline", label: "Chat Room" },
    { href: "/alerts", icon: "mail_outline", label: "Alerts" },
    { href: "/help", icon: "help_center", label: "Help Center" },
  ];

  return (
    <div id="Drawer" className={styles.homePageDrawer}>
      <img
        id="drawerLogo"
        src="/image.png"
        alt="EPIC's Logo"
      />
      <ListGroup variant="flush">
        {links.map(({ href, icon, label }) => (
          <Link key={href} href={href} passHref legacyBehavior>
            <ListGroup.Item action active={pathname === href}>
              <span className="material-icons">{icon}</span>
              <span className={styles.textDrawer}> {label}</span>
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </div>
  );
};

export default Drawer;
