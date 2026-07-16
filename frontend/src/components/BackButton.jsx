import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;

  return (
    <button
      className={`back-button-global ${!canGoBack ? 'disabled' : ''}`}
      onClick={() => canGoBack && navigate(-1)}
      disabled={!canGoBack}
    >
      ← Volver
    </button>
  );
};

export default BackButton;
