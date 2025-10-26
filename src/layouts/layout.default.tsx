import Footer from "@/components/common/footer";
import Header from "@/components/common/header";

function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative">{children}</main>
      <Footer />
    </>
  );
}

export default LayoutDefault;