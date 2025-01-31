// /assets/js/script.js

// script.js
$(document).ready(function() {
    // Función global para actualizar el contador del carrito
    function updateCartCount() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      $('.cart-count').text(totalCount); // Asegúrate de que el selector sea correcto
    }
  
    // Hacer la función accesible globalmente
    window.updateCartCount = updateCartCount;
  
    // Mostrar una notificación
    function showNotification(message) {
      const notification = $('<div class="notification"></div>').text(message);
      $('body').append(notification);
      notification.fadeIn().delay(3000).fadeOut(function() {
        $(this).remove();
      });
    }
  
    // Inicializar en cada carga de página
    updateCartCount();
  
    // Manejo de eventos para añadir al carrito
    $(document).on('click', '.btn-add-cart', function() {
      const product = {
        id: $(this).data('id'),
        name: $(this).data('name'),
        price: $(this).data('price'),
        image: $(this).data('image'),
        quantity: 1
      };
  
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
      if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity += 1;
      } else {
        cart.push(product);
      }
  
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      showNotification(`${product.name} añadido al carrito.`);
    });
  
    // Cargar el navbar y luego actualizar el contador del carrito
    $('#navbar').load('../components/navbar.html', function() {
      updateCartCount(); // Actualizar el contador una vez que el navbar se ha cargado
    });
  
    // Cargar el footer
    $('#footer').load('../components/footer.html');
});
  