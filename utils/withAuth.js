"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { backendLink } from "../exports/variable";
import { UPDATE_USER_DETAIL } from "../store/actions/actionTypes/ActionTypes";
import { useDispatch, useSelector } from "react-redux";

const withAuth = (WrappedComponent) => {
  return function AuthWrapper(props) {
    const dispatch = useDispatch();
    const { isAccepted } = useSelector((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Allow access to waiting page and profile page even if not accepted
        const allowedPaths = ["/waiting", "/profile"];
        if (allowedPaths.includes(pathname)) {
          setIsChecking(false);
          return;
        }

        if (!isAccepted) {
          try {
            const response = await axios.get(
              backendLink + "user/approvalStatus",
              {
                headers: {
                  Authorization: "Bearer " + token,
                  "X-Is-Doctor": "true",
                },
              },
            );
            // Check if user is accepted
            const isAccepted = response.data.isAccepted !== false;
            dispatch({
              type: UPDATE_USER_DETAIL,
              payload: { isAccepted: isAccepted },
            });
            if (!isAccepted) {
              // Redirect to waiting page if not accepted
              router.push("/waiting");
              return;
            }

            setIsChecking(false);
          } catch (error) {
            // If profile fetch fails, redirect to login
            router.push("/login");
          }
        } else {
          setIsChecking(false);
        }
      };

      checkAuth();
    }, [router, pathname]);

    // Show nothing while checking
    if (isChecking) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
