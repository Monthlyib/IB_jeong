import SignUp from "@/components/signUpComponents/SignUp";
import { Suspense } from "react";

export default async function SignUpPage() {
  return (
    <>
      <Suspense>
        <SignUp />
      </Suspense>
    </>
  );
}
