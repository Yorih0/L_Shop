import Header from "./Header";
import Footer from "./Footer";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <>
      <Header />

      <main className="main">
        <LoginForm />
      </main>

      <Footer />
    </>
  );
}