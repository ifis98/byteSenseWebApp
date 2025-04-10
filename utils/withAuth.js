'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { backendLink } from '../exports/variable';

const withAuth = (WrappedComponent) => {
  return function AuthWrapper(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      axios
        .get(backendLink + "user/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .catch(() => {
          router.push("/login");
        });
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
