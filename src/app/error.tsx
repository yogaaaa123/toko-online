'use client';

import ErrorPage from '@/components/error';

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage {...props} />;
}
