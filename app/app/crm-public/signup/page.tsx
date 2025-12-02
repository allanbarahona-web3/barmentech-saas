'use client';

import { SignupModal } from '@/src/themes/shared/auth';

export default function CRMSignupPage() {
  return (
    <SignupModal
      apiEndpoint="http://localhost:3000/api/v1/auth/crm/signup"
      redirectPath="/crm/conversations"
      logoSrc="/themes/barmentech/logo_barmentech.png"
      title="Barmentech CRM"
      showFeatures={true}
      language="es"
    />
  );
}
