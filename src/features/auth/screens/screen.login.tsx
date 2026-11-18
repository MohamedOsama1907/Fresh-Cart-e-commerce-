import LoginForm from "../components/login/LoginForm";
import LoginHero from "../components/login/LoginHero";

export default function LogInScreen() {
  return (
    <main className="min-h-[75vh] py-8 sm:py-12">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 items-center lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0">
          <LoginHero />
        </div>
        <div className="min-w-0">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
