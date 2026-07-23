import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getGenres, deleteGenre } from '../../services/fetchArtwork';
import './Admin.css';
import { useConfirm } from '../../services/useConfirm';

const DeleteGenre = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirmDialog, showConfirm } = useConfirm();

  const loadGenres = async () => {
    setLoading(true);
    try {
      const response = await getGenres();
      setGenres(response);
    } catch (err) {
      toast.error('Error al cargar los géneros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const handleDelete = async (id, description) => {
    const ok = await showConfirm({
      title: '¿Eliminar género?',
      message: `¿Estás seguro de que deseas eliminar el género "${description}"?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      icon: 'danger',
    });
    if (ok) {
        try {
            await deleteGenre(id, null);
            toast.success(`El género "${description}" ha sido eliminado.`);
            loadGenres();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar el género.");
        }
    }
  };

  return (
    <div className="admin-section">
      {confirmDialog}
      <ToastContainer position="top-center" theme="dark" />
      <h1 className="section-title">Borrar Género</h1>
      <div className="admin-line"></div>
      <p className="admin-subtitle">
        Elimina un género o categoría del sistema.
      </p>

      {loading ? (
        <div className="empty-state">Cargando géneros...</div>
      ) : (
        <div className="table-wrapper" style={{ marginTop: '40px' }}>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Descripción</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {genres.map(genre => (
                <tr key={genre.id}>
                  <td className="td-id">#{genre.id}</td>
                  <td>{genre.description}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-cancel" onClick={() => handleDelete(genre.id, genre.description)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {genres.length === 0 && <tr><td colSpan="3" className="empty-state">No hay géneros registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeleteGenre;