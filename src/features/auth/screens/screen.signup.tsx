import SignupForm from "../components/signup/signupForm";
import SignupHero from "../components/signup/signupHero";

export default function SignUpScreen() {
  return (
    <>
      <div className="grid grid-col-1 lg:grid-cols-2 lg:gap-10 container max-w-7xl">
        {" "}
        <div className="items-center">
          <SignupHero />
        </div>
        <div className="">
          <SignupForm />
        </div>
      </div>
    </>
  );
}
