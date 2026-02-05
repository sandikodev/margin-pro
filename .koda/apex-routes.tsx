/**
 * 🏔️ Koda Zenith: Auto-Generated Apex Routes
 * DO NOT EDIT MANUALLY.
 */
import React, { lazy, Suspense } from 'react';

const Layout_0 = lazy(() => import('../src/client/routes/(public)/layout.tsx'));
const Error_1 = lazy(() => import('../src/client/routes/(public)/error.tsx'));
const Page_0 = lazy(() => import('../src/client/routes/(public)/PublicErrorTest.tsx'));
const Page_1 = lazy(() => import('../src/client/routes/(public)/auth.tsx'));
const Page_2 = lazy(() => import('../src/client/routes/(public)/blog/index.tsx'));
const Page_3 = lazy(() => import('../src/client/routes/(public)/blog/post.tsx'));
const Page_4 = lazy(() => import('../src/client/routes/(public)/demo-tour.tsx'));
const Page_5 = lazy(() => import('../src/client/routes/(public)/index.tsx'));
const Page_6 = lazy(() => import('../src/client/routes/(public)/invite.tsx'));
const Page_7 = lazy(() => import('../src/client/routes/(public)/landing.tsx'));
const Page_8 = lazy(() => import('../src/client/routes/(public)/legal/document.tsx'));
const Page_9 = lazy(() => import('../src/client/routes/(public)/legal/index.tsx'));
const Page_10 = lazy(() => import('../src/client/routes/(public)/pricing.tsx'));
const Layout_2 = lazy(() => import('../src/client/routes/app/layout.tsx'));
const Error_3 = lazy(() => import('../src/client/routes/app/error.tsx'));
const Page_11 = lazy(() => import('../src/client/routes/app/AppDXTest.tsx'));
const Page_12 = lazy(() => import('../src/client/routes/app/AppErrorTest.tsx'));
const Page_13 = lazy(() => import('../src/client/routes/app/about.tsx'));
const Page_14 = lazy(() => import('../src/client/routes/app/academy.tsx'));
const Page_15 = lazy(() => import('../src/client/routes/app/calculator-page.tsx'));
const Page_16 = lazy(() => import('../src/client/routes/app/calculator.tsx'));
const Page_17 = lazy(() => import('../src/client/routes/app/changelog.tsx'));
const Page_18 = lazy(() => import('../src/client/routes/app/dashboard-page.tsx'));
const Page_19 = lazy(() => import('../src/client/routes/app/finance-page.tsx'));
const Page_20 = lazy(() => import('../src/client/routes/app/finance.tsx'));
const Page_21 = lazy(() => import('../src/client/routes/app/index.tsx'));
const Page_22 = lazy(() => import('../src/client/routes/app/insights-page.tsx'));
const Page_23 = lazy(() => import('../src/client/routes/app/insights.tsx'));
const Page_24 = lazy(() => import('../src/client/routes/app/market-page.tsx'));
const Page_25 = lazy(() => import('../src/client/routes/app/market.tsx'));
const Page_26 = lazy(() => import('../src/client/routes/app/onboarding.tsx'));
const Page_27 = lazy(() => import('../src/client/routes/app/profile-page.tsx'));
const Page_28 = lazy(() => import('../src/client/routes/app/profile.tsx'));
const Page_29 = lazy(() => import('../src/client/routes/app/topup.tsx'));
const Layout_4 = lazy(() => import('../src/client/routes/labs/layout.tsx'));
const Error_5 = lazy(() => import('../src/client/routes/labs/error.tsx'));
const Page_30 = lazy(() => import('../src/client/routes/labs/index.tsx'));
const Page_31 = lazy(() => import('../src/client/routes/onboarding.tsx'));
const Layout_6 = lazy(() => import('../src/client/routes/system/layout.tsx'));
const Error_7 = lazy(() => import('../src/client/routes/system/error.tsx'));

export const apexRoutes = [
  {
    path: '.',
    element: <Suspense fallback={null}><Layout_0 /></Suspense>,
    errorElement: <Suspense fallback={null}><Error_1 /></Suspense>,
    children: [
    {
      path: 'PublicErrorTest',
      element: <Suspense fallback={null}><Page_0 /></Suspense>
    },
    {
      path: 'auth',
      element: <Suspense fallback={null}><Page_1 /></Suspense>
    },
    {
      path: 'blog',
      element: <Suspense fallback={null}><Page_2 /></Suspense>
    },
    {
      path: 'blog/post',
      element: <Suspense fallback={null}><Page_3 /></Suspense>
    },
    {
      path: 'demo-tour',
      element: <Suspense fallback={null}><Page_4 /></Suspense>
    },
    {
      path: '',
      element: <Suspense fallback={null}><Page_5 /></Suspense>
    },
    {
      path: 'invite',
      element: <Suspense fallback={null}><Page_6 /></Suspense>
    },
    {
      path: 'landing',
      element: <Suspense fallback={null}><Page_7 /></Suspense>
    },
    {
      path: 'legal/document',
      element: <Suspense fallback={null}><Page_8 /></Suspense>
    },
    {
      path: 'legal',
      element: <Suspense fallback={null}><Page_9 /></Suspense>
    },
    {
      path: 'pricing',
      element: <Suspense fallback={null}><Page_10 /></Suspense>
    }
    ]  },
  {
    path: 'app',
    element: <Suspense fallback={null}><Layout_2 /></Suspense>,
    errorElement: <Suspense fallback={null}><Error_3 /></Suspense>,
    children: [
    {
      path: 'AppDXTest',
      element: <Suspense fallback={null}><Page_11 /></Suspense>
    },
    {
      path: 'AppErrorTest',
      element: <Suspense fallback={null}><Page_12 /></Suspense>
    },
    {
      path: 'about',
      element: <Suspense fallback={null}><Page_13 /></Suspense>
    },
    {
      path: 'academy',
      element: <Suspense fallback={null}><Page_14 /></Suspense>
    },
    {
      path: 'calculator-page',
      element: <Suspense fallback={null}><Page_15 /></Suspense>
    },
    {
      path: 'calculator',
      element: <Suspense fallback={null}><Page_16 /></Suspense>
    },
    {
      path: 'changelog',
      element: <Suspense fallback={null}><Page_17 /></Suspense>
    },
    {
      path: 'dashboard-page',
      element: <Suspense fallback={null}><Page_18 /></Suspense>
    },
    {
      path: 'finance-page',
      element: <Suspense fallback={null}><Page_19 /></Suspense>
    },
    {
      path: 'finance',
      element: <Suspense fallback={null}><Page_20 /></Suspense>
    },
    {
      path: '',
      element: <Suspense fallback={null}><Page_21 /></Suspense>
    },
    {
      path: 'insights-page',
      element: <Suspense fallback={null}><Page_22 /></Suspense>
    },
    {
      path: 'insights',
      element: <Suspense fallback={null}><Page_23 /></Suspense>
    },
    {
      path: 'market-page',
      element: <Suspense fallback={null}><Page_24 /></Suspense>
    },
    {
      path: 'market',
      element: <Suspense fallback={null}><Page_25 /></Suspense>
    },
    {
      path: 'onboarding',
      element: <Suspense fallback={null}><Page_26 /></Suspense>
    },
    {
      path: 'profile-page',
      element: <Suspense fallback={null}><Page_27 /></Suspense>
    },
    {
      path: 'profile',
      element: <Suspense fallback={null}><Page_28 /></Suspense>
    },
    {
      path: 'topup',
      element: <Suspense fallback={null}><Page_29 /></Suspense>
    }
    ]  },
  {
    path: 'labs',
    element: <Suspense fallback={null}><Layout_4 /></Suspense>,
    errorElement: <Suspense fallback={null}><Error_5 /></Suspense>,
    children: [
    {
      path: '',
      element: <Suspense fallback={null}><Page_30 /></Suspense>
    }
    ]  },
  {
    path: 'onboarding',
    element: <Suspense fallback={null}><Page_31 /></Suspense>
  },
  {
    path: 'system',
    element: <Suspense fallback={null}><Layout_6 /></Suspense>,
    errorElement: <Suspense fallback={null}><Error_7 /></Suspense>
  }
];
