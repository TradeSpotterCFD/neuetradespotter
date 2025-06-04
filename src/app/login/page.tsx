import { Suspense } from 'react';
import LoginContent from '@/components/LoginContent'; // Import the new client component

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
