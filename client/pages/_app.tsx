import "@/styles/globals.css";
import React, { ReactNode } from 'react';
import { AppPropsType, NextComponentType } from "next/dist/shared/lib/utils";
import AppProvider, { useAuth } from '../AuthProvider';
import { useRouter } from 'next/router';

function AuthManager({ children }: { children: ReactNode | ReactNode[] }) {
  const { status } = useAuth();
  const router = useRouter();
  if (status === 'loading') {
    return <h1>loading please wait</h1>;
  }
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }
  return <>{children}</>;
}

type CustomAppProps = AppPropsType & {
  Component: NextComponentType & { protected?: boolean }; // add auth type
};

const MyApp = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <AppProvider>
      {Component.protected ? (
        <AuthManager>
          <Component {...pageProps} />
        </AuthManager>
      ) : (
        <Component {...pageProps} />
      )}
    </AppProvider>
  );
};

export default MyApp;