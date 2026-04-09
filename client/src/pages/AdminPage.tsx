import Header from "./Header";
import Footer from "./Footer";
import AdminForm from "./AdminForm";

export default function ProfilePage() {
  return (
    <>
      <Header />

      <main className="main-p">
        <AdminForm />
      </main>

      <Footer />
    </>
  );
}