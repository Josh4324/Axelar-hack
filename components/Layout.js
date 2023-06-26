import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <div
        style={{ background: "#070A0E" }}
        className="flex flex-col min-h-screen"
      >
        <Header />
        <div className="">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
