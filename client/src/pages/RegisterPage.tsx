import Header from "./Header";
import Footer from "./Footer";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Header />

      <main className="main">
        <RegisterForm />
      </main>

      <Footer />
    </>
  );
}