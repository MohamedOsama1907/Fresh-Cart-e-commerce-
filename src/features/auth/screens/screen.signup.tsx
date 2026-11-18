import SignupForm from "../components/signup/signupForm";
import SignupHero from "../components/signup/signupHero";

export default function SignUpScreen() {
  return (
    <main className="min-h-[75vh] py-8 sm:py-12">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 items-center lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0">
          <SignupHero />
        </div>
        <div className="min-w-0">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
