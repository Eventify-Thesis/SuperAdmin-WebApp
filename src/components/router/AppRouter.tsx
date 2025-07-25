import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// // no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(
  () => import('@/components/layouts/AuthLayout/AuthLayout'),
);

import MainLayout from '@/components/layouts/main/MainLayout/MainLayout';


import RequireAuth from '@/components/router/RequireAuth';

import { withLoading } from '@/hocs/withLoading.hoc';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ErrorBoundary } from '../common/ErrorBoundary/ErrorBoundary';
const EventDashboardPage = React.lazy(
  () => import('@/pages/EventDashboardPage'),
);
const AdminCategoryPage = React.lazy(() => import('@/pages/AdminCategoryPage'));


const EventUploadPage = React.lazy(() => import('@/pages/EventUploadPage'));
const IssueReportsPage = React.lazy(() => import('@/pages/IssueReportsPage'));

const AuthLayoutFallback = withLoading(AuthLayout);
export const HOME_PATH = '/';

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_PATH} element={<Navigate to="/events" replace />} />

        <Route path={HOME_PATH} element={protectedLayout}>
          <Route path="events">
            <Route index element={<EventDashboardPage />} />
            <Route path="upload" element={<EventUploadPage />} />
          </Route>
<Route path="category" element={<AdminCategoryPage />} />
          <Route
            path="issue-reports"
            element={
              <ErrorBoundary>
                <IssueReportsPage />
              </ErrorBoundary>
            }
          />
        </Route>

        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<SignIn signUpUrl="/auth/sign-up" />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
