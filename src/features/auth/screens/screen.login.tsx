import LoginForm from "../components/login/LoginForm";
import LoginHero from "../components/login/LoginHero";


export default function LogInScreen() {
  return (
    <>
      <div className="grid grid-col-1 lg:grid-cols-2 lg:gap-10 container max-w-7xl">
        <div className="min-w-0 ">
          <LoginHero />
        </div>
        <div className="min-w-0">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
