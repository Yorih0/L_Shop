import Header from "./Header";
import Footer from "./Footer";
import ProfileForm from "./ProfileUserForm";

export default function ProfilePage() {
  return (
    <>
      <Header />

      <main className="main-p">
        <ProfileForm />
      </main>

      <Footer />
    </>
  );
}