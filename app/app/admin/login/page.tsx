'use client';

import { LoginModal } from '@/src/themes/shared/auth';

export default function AdminLoginPage() {
  return (
    <LoginModal
      redirectPath="/admin/dashboard"
      logoSrc="/themes/barmentech/logo_barmentech.png"
      title="CRM Portal"
    />
  );
}
