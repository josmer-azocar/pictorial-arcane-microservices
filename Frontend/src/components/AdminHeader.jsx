import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      <div 
        className="admin-header-logo" 
        onClick={() => navigate("/admin")}
      >
        PICTORIAL <span>ARCANE</span>
      </div>

      <div className="admin-header-center">
        <span className="admin-header-badge">
          <span className="admin-header-dot"></span>
          Panel de Administración
        </span>
      </div>

      <div className="admin-header-right">
        <span className="admin-header-name">
          Hola, <strong>Administrador</strong>
        </span>
        <button 
          className="admin-header-logout"
          onClick={() => navigate("/")}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;