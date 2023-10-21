import { SignUp } from "@clerk/nextjs";

interface SignUpPageProps {
  params: {
    id: string;
  };
}

export default function SignUpPage({ params: { id } }: SignUpPageProps) {
  console.log(id);
  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/new-user"
        afterSignUpUrl="/new-user"
      />
    </div>
  );
}
