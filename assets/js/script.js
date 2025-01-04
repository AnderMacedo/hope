// /assets/js/script.js

document.addEventListener("DOMContentLoaded", function() {
    // Crear una solicitud de HTTP para cargar el archivo navbar.html
    fetch('/components/navbar.html')
        .then(response => response.text())
        .then(data => {
            // Insertar el contenido del navbar en el contenedor con id="navbar"
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el navbar:', error));
});
