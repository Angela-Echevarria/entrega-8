(() => {
  // Actualizar badge del carrito en el navbar
  const actualizarBadgeCarritoGlobal = () => {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    
    try {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const total = items.reduce((sum, item) => sum + (parseInt(item.count) || 0), 0);
      badge.textContent = total;
      badge.style.display = total > 0 ? 'inline-block' : 'none';
    } catch (e) {
      console.error('Error al actualizar badge del carrito:', e);
    }
  };

  document.addEventListener('DOMContentLoaded', actualizarBadgeCarritoGlobal);
  
  window.addEventListener('storage', (evt) => {
    if (evt.key === 'cartItems') actualizarBadgeCarritoGlobal();
  });
})();
