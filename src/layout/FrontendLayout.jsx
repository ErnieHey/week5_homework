import { Link, Outlet } from "react-router";


function FrontendLayout() {
  return (
    <>
      <header className="container mt-3">
        <ul className="nav nav-pills custom-nav">
          <li className="nav-item">
            <Link className="nav-link active" to="/">
              首頁
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to="/products">
              產品列表
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to="/cart">
              購物車
            </Link>
          </li>

        </ul>
      </header>

      <main className="container mt-4">
    
        <Outlet />
      </main>

      <footer className="container mt-5 py-3 border-top text-center text-muted">
        <p>&copy; 2026 E&E. LTD </p>
      </footer>
    </>
  );
}

export default FrontendLayout;
