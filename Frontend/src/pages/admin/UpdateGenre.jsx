import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getGenres, updateGenre } from '../../services/fetchArtwork';
import './Admin.css';
import { useAuth } from '../../services/AuthContext';

const UpdateGenre = () => {
  const { token } = useAuth();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEditClick = (genre) => {
    setSelectedGenre(genre);
    setFormData({
      name: genre.name || '',
      description: genre.description || ''
    });
  };

  const handleCancel = () => {
    setSelectedGenre(null);
    setFormData({ name: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }
    setIsEditing(true);
    try {
      await updateGenre(selectedGenre.idGenre, {
        name: formData.name,
        description: formData.description
      }, token);

      toast.success(`Género actualizado exitosamente.`);

      setGenres(prevGenres =>
        prevGenres.map(g =>
          g.idGenre === selectedGenre.idGenre
            ? { ...g, name: formData.name, description: formData.description }
            : g
        )
      );

      handleCancel();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error al actualizar el género.';
      toast.error(msg);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="admin-section">
      <ToastContainer position="top-center" theme="dark" />
      <h1 className="section-title">Actualizar Género</h1>
      <div className="admin-line"></div>
      <p className="admin-subtitle">Selecciona un género para modificar su nombre y descripción.</p>

      {loading ? (
        <div className="empty-state">Cargando géneros...</div>
      ) : (
        <div className="table-wrapper" style={{ marginTop: '40px' }}>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {genres.map(genre => (
                <tr key={genre.idGenre}>
                  <td className="td-id">#{genre.idGenre}</td>
                  <td>{genre.name}</td>
                  <td>{genre.description}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-invoice" onClick={() => handleEditClick(genre)}>
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {genres.length === 0 && (
                <tr><td colSpan="4" className="empty-state">No hay géneros registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedGenre && (
        <div className="admin-form-container" style={{ marginTop: '40px', maxWidth: '100%' }}>
          <h2 className="section-title" style={{ fontSize: '24px' }}>
            Editando: {selectedGenre.name}
          </h2>
          <form onSubmit={handleSave} className="admin-form" style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del género"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del género"
                required
              />
            </div>
            <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
              <button type="submit" className="btn-primary" disabled={isEditing}>
                {isEditing ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isEditing}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateGenre;