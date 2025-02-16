document.addEventListener("DOMContentLoaded", function () {
    // Cargar el navbar
    $("#navbar").load("../components/navbar.html");
    // Cargar el footer
    $("#footer").load("../components/footer.html");    

    // Inicializar EmailJS
    emailjs.init("TFY4P409cNNWKcJgW"); // Asegúrate de usar tu Public Key

    const form = document.getElementById("reclamoForm");
    const googleSheetsURL = "https://script.google.com/macros/s/AKfycbzewImG9ftC5aOVWL_NJ4o9u7HvhU8dINj916k2UP0pXQXjinHOJXFMn9sBkgkbXDx-TA/exec"; 

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!validarFormulario(form)) {
            alert("Por favor, corrige los errores antes de enviar.");
            return;
        }

        const formData = capturarDatos(form);

        try {
            console.log("Datos capturados:", formData);

            await enviarEmail(formData);
            await guardarEnGoogleSheets(formData);

            Swal.fire({
                title: "¡Reclamo enviado!",
                text: "Tu reclamo ha sido registrado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                timer: 3000,  // Se cierra automáticamente en 3 segundos
                showConfirmButton: false
            });
            form.reset();
        } catch (error) {
            console.error("Error en el proceso:", error);
            Swal.fire({
                title: "¡Error!",
                text: "Hubo un problema al enviar tu reclamo. Inténtalo de nuevo.",
                icon: "error",
                confirmButtonText: "Intentar otra vez"
            });            
        }
    });

    function validarFormulario(form) {
        let isValid = true;
        const inputs = form.querySelectorAll("input[required], select[required], textarea[required]");

        inputs.forEach(input => {
            const value = input.value.trim();
            input.classList.remove("error");

            if (value === "") {
                isValid = false;
                input.classList.add("error");
            } else if (input.type === "email" && !/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(value)) {
                isValid = false;
                input.classList.add("error");
                alert("Correo electrónico inválido.");
            } else if (input.name === "celular" && !/^\d{9}$/.test(value)) {
                isValid = false;
                input.classList.add("error");
                alert("El celular debe tener 9 dígitos.");
            } else if (input.type === "number" && parseFloat(value) < 0) {
                isValid = false;
                input.classList.add("error");
                alert("El monto reclamado debe ser positivo.");
            } else if (input.type === "date") {
                const fechaReclamo = new Date(value);
                const fechaActual = new Date();
                if (fechaReclamo > fechaActual) {
                    isValid = false;
                    input.classList.add("error");
                    alert("La fecha de reclamo no puede ser futura.");
                }
            } else if (input.name === "numeroDocumento") {
                const tipoDoc = form.querySelector("select[name='tipoDocumento']").value;
                const validDocLength = tipoDoc === "DNI" ? 8 : tipoDoc === "Carné de extranjería" ? 9 : 12;
                if (!new RegExp(`^\\d{${validDocLength}}$`).test(value)) {
                    isValid = false;
                    input.classList.add("error");
                    alert(`El documento debe tener ${validDocLength} dígitos.`);
                }
            }
        });

        return isValid;
    }

    function capturarDatos(form) {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        return data;
    }

    async function enviarEmail(data) {
        const emailData = {
            from_name: data.nombre || "Usuario desconocido",
            email: data.email || "No proporcionado",
            reason: data.tipoReclamo || "No especificado",
            message: data.detalleReclamo || "No hay detalles",
            date: new Date().toLocaleDateString("es-ES"),
            to_name: "Equipo de Atención al Cliente",
        };

        console.log("Enviando Email con datos:", emailData);

        try {
            const response = await emailjs.send("service_quewstt", "template_5m3bdd9", emailData);
            console.log("Correo enviado exitosamente:", response);
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            throw error;
        }
    }

    async function guardarEnGoogleSheets(data) {
        try {
            const response = await fetch(googleSheetsURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                mode: "no-cors",
            });
    
            console.log("Solicitud enviada a Google Sheets.");
        } catch (error) {
            console.error("Error al guardar en Google Sheets:", error);
        }
    }
});
