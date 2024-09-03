// /password/resetForm - Page where users can reset their password (after email validation)

import PassResetForm from "@/components/PassResetForm/PassResetForm";
import { Suspense } from "react";

const PassResetRequest: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PassResetForm />
    </Suspense>
  );
};

export default PassResetRequest;
