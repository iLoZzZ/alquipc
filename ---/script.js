const PRECIO_DIA = 35000;
const PRECIO_EXTRA = 20000;
const RECARGO_DOMICILIO = 15000;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAlquiler");
  const seccionFactura = document.getElementById("seccionFactura");
  const detalleFactura = document.getElementById("detalleFactura");
  const btnLimpiar = document.getElementById("btnLimpiar");
  const btnNuevo = document.getElementById("btnNuevo");

  function formatoMoneda(valor) {
    return "$" + valor.toLocaleString("es-CO");
  }

  function limpiarErrores() {
    document
      .querySelectorAll(".error-text")
      .forEach((el) => (el.textContent = ""));
    document
      .querySelectorAll("input, select")
      .forEach((el) => el.classList.remove("input-error"));
  }

  function validarFormulario() {
    limpiarErrores();
    let esValido = true;

    const nombre = document.getElementById("nombre");
    const idCliente = document.getElementById("idCliente");
    const telefono = document.getElementById("telefono");
    const email = document.getElementById("email");
    const tipoServicio = document.getElementById("tipoServicio");
    const numEquipos = document.getElementById("numEquipos");
    const diasIniciales = document.getElementById("diasIniciales");
    const diasExtra = document.getElementById("diasExtra");

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombre.value.trim() || !regexNombre.test(nombre.value)) {
      document.getElementById("errNombre").textContent =
        "Ingresa un nombre válido (sin números)";
      nombre.classList.add("input-error");
      esValido = false;
    }

    const regexNumero = /^[0-9]+$/;
    if (
      !idCliente.value.trim() ||
      !regexNumero.test(idCliente.value) ||
      parseInt(idCliente.value) <= 0
    ) {
      document.getElementById("errId").textContent =
        "Ingresa un documento válido (solo números positivos)";
      idCliente.classList.add("input-error");
      esValido = false;
    }

    if (
      !telefono.value.trim() ||
      !regexNumero.test(telefono.value) ||
      telefono.value.length < 7
    ) {
      document.getElementById("errTelefono").textContent = "Teléfono no válido";
      telefono.classList.add("input-error");
      esValido = false;
    }

    if (
      !email.value.trim() ||
      !email.value.includes("@") ||
      !email.value.includes(".")
    ) {
      document.getElementById("errEmail").textContent =
        "Ingresa un correo electrónico válido";
      email.classList.add("input-error");
      esValido = false;
    }

    if (!tipoServicio.value) {
      document.getElementById("errServicio").textContent =
        "Selecciona una opción de servicio";
      tipoServicio.classList.add("input-error");
      esValido = false;
    }

    const cantEquipos = parseInt(numEquipos.value);
    if (isNaN(cantEquipos) || cantEquipos < 1 || cantEquipos > 20) {
      document.getElementById("errEquipos").textContent =
        "Número de equipos debe ser entre 1 y 20";
      numEquipos.classList.add("input-error");
      esValido = false;
    }

    const cantDias = parseInt(diasIniciales.value);
    if (isNaN(cantDias) || cantDias < 1 || cantDias > 60) {
      document.getElementById("errDiasInit").textContent =
        "Mínimo 1 día de alquiler";
      diasIniciales.classList.add("input-error");
      esValido = false;
    }

    const cantExtra = parseInt(diasExtra.value);
    if (isNaN(cantExtra) || cantExtra < 0) {
      document.getElementById("errDiasExtra").textContent =
        "No puede ser un número negativo";
      diasExtra.classList.add("input-error");
      esValido = false;
    }

    return esValido;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const idCliente = document.getElementById("idCliente").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const servicioVal = document.getElementById("tipoServicio").value;
    const numEquipos = parseInt(document.getElementById("numEquipos").value);
    const diasIniciales = parseInt(
      document.getElementById("diasIniciales").value,
    );
    const diasExtra = parseInt(document.getElementById("diasExtra").value) || 0;

    let textoServicio = "";
    let recargo = 0;
    let porcentajeDescuento = 0;

    if (servicioVal === "1") {
      textoServicio = "Dentro de la ciudad";
    } else if (servicioVal === "2") {
      textoServicio = "Fuera de la ciudad (con domicilio)";
      recargo = RECARGO_DOMICILIO;
    } else if (servicioVal === "3") {
      textoServicio = "En establecimiento (10% descuento)";
      porcentajeDescuento = 0.1;
    }

    const subtotalBase = numEquipos * diasIniciales * PRECIO_DIA;
    const subtotalExtra = numEquipos * diasExtra * PRECIO_EXTRA;
    const subtotalBruto = subtotalBase + subtotalExtra + recargo;
    const descuento = subtotalBruto * porcentajeDescuento;
    const totalPagar = subtotalBruto - descuento;

    detalleFactura.innerHTML = `
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Cédula:</strong> ${idCliente} | <strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Servicio:</strong> ${textoServicio}</p>

            <table class="factura-tabla">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Cant.</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Alquiler Base (${diasIniciales} días x ${numEquipos} equipo/s)</td>
                        <td>${numEquipos}</td>
                        <td>${formatoMoneda(subtotalBase)}</td>
                    </tr>
                    ${
                      diasExtra > 0
                        ? `
                    <tr>
                        <td>Días adicionales (${diasExtra} días)</td>
                        <td>${numEquipos}</td>
                        <td>${formatoMoneda(subtotalExtra)}</td>
                    </tr>`
                        : ""
                    }
                    ${
                      recargo > 0
                        ? `
                    <tr>
                        <td>Domicilio fuera de la ciudad</td>
                        <td>1</td>
                        <td>${formatoMoneda(recargo)}</td>
                    </tr>`
                        : ""
                    }
                    ${
                      descuento > 0
                        ? `
                    <tr style="color: #2e7d32;">
                        <td>Descuento presencial (10%)</td>
                        <td>-</td>
                        <td>-${formatoMoneda(descuento)}</td>
                    </tr>`
                        : ""
                    }
                    <tr class="total-row">
                        <td colspan="2">TOTAL A PAGAR:</td>
                        <td>${formatoMoneda(totalPagar)}</td>
                    </tr>
                </tbody>
            </table>
        `;

    seccionFactura.classList.remove("hidden");
    seccionFactura.scrollIntoView({ behavior: "smooth" });
  });

  btnLimpiar.addEventListener("click", () => {
    form.reset();
    limpiarErrores();
    seccionFactura.classList.add("hidden");
  });

  btnNuevo.addEventListener("click", () => {
    form.reset();
    limpiarErrores();
    seccionFactura.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
