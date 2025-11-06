// Helper para navegación en componentes de clase
// Usa window.history.pushState para cambiar la URL sin recargar
// y dispara un evento popstate para que React Router lo detecte

export const navigate = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

