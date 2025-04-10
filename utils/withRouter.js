'use client';
import { useRouter } from 'next/router';

export default function withRouter(Component) {
  return function WrappedComponent(props) {
    const router = useRouter();
    return <Component {...props} router={router} />;
  };
}
