const tipos = [
    { id: "tipodesayuno", nombre: "Desayuno" },
    { id: "tipoalmuerzo", nombre: "Almuerzo" },
    { id: "tipomerienda", nombre: "Merienda" },
    { id: "tipocena", nombre: "Cena" }
];

document.addEventListener("DOMContentLoaded", function() {
    let combos = JSON.parse(localStorage.getItem("combos")) || [];
    let editIndex = -1;

    function renderizarCombos() {
        document.getElementById("listaCombo").innerHTML = "";
        renderizarFiltro();
        combos.forEach(function(combo, index) {
            let nuevoCombo = crearComboElemento(combo, index);
            document.getElementById("listaCombo").appendChild(nuevoCombo);
        });

        actualizarResumenCombos();
    }

    function crearComboElemento(combo, index) {
        let nuevoCombo = document.createElement("div");
        nuevoCombo.classList.add("combo");
        nuevoCombo.innerHTML = `
            <h3>${combo.nombre}</h3>
            <p><strong>Tipo de comida:</strong> ${combo.tipoComida}</p>
            <p><strong>Descripción de la comida:</strong> ${combo.descripcionComida}</p>
            <p><strong>Calorías de la comida:</strong> ${combo.caloriasComida}</p>
            <p><strong>Calorías a quemar:</strong> ${combo.caloriasQuemar}</p>
            <p><strong>Nombre del ejercicio:</strong> ${combo.nombreEjercicio}</p>
            <p><strong>Descripción del ejercicio:</strong> ${combo.descripcionEjercicio}</p>
        `;
    
    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");
    buttonGroup.setAttribute("role", "group");

    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("eliminar-btn", "btn", "btn-danger");
    botonEliminar.setAttribute('data-index', index);
    buttonGroup.appendChild(botonEliminar);

    let botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.classList.add("editar-btn", "btn", "btn-primary");
    botonEditar.setAttribute('data-index', index);
    buttonGroup.appendChild(botonEditar);

    nuevoCombo.appendChild(buttonGroup);

    return nuevoCombo;
} 

    function renderizarFiltro() {
        document.getElementById("filtroComida").innerHTML = "";
        let selectFiltro = document.createElement("select");
        let defaultOption = document.createElement("option");
        defaultOption.text = "Filtrar por tipo de comida";
        selectFiltro.add(defaultOption);
        tipos.forEach(function(tipo) {
            let option = document.createElement("option");
            option.value = tipo.nombre;
            option.text = tipo.nombre;
            selectFiltro.add(option);
        });

        selectFiltro.addEventListener("change", function() {
            let valorFiltro = this.value;
            if (valorFiltro === "Filtrar por tipo de comida") {
                renderizarCombos();
            } else {
                let combosFiltrados = combos.filter(combo => combo.tipoComida === valorFiltro);
                renderizarCombosFiltrados(combosFiltrados);
            }
        });

        document.getElementById("filtroComida").appendChild(selectFiltro);
    }

    function renderizarCombosFiltrados(combosFiltrados) {
        document.getElementById("listaCombo").innerHTML = "";
        combosFiltrados.forEach(function(combo, index) {
            let nuevoCombo = crearComboElemento(combo, index);
            document.getElementById("listaCombo").appendChild(nuevoCombo);
        });

        actualizarResumenCombos(combosFiltrados);
    }

    function agregarCombo(event) {
        event.preventDefault();

        let nombreCombo = document.getElementById("comboNombre").value;
        let tipoComida = document.getElementById("tipos").value;
        let descripcionComida = document.getElementById("descripción").value;
        let caloriasComida = document.getElementById("calorías").value;
        let caloriasQuemar = document.getElementById("caloriasQuemar").value;
        let nombreEjercicio = document.getElementById("nombreEjercicio").value;
        let descripcionEjercicio = document.getElementById("descripciónEjercicio").value;

        if (editIndex === -1) {
            combos.push({
                nombre: nombreCombo,
                tipoComida: tipoComida,
                descripcionComida: descripcionComida,
                caloriasComida: caloriasComida,
                nombreEjercicio: nombreEjercicio,
                descripcionEjercicio: descripcionEjercicio,
                caloriasQuemar: caloriasQuemar
            });
        } else {
            combos[editIndex] = {
                nombre: nombreCombo,
                tipoComida: tipoComida,
                descripcionComida: descripcionComida,
                caloriasComida: caloriasComida,
                nombreEjercicio: nombreEjercicio,
                descripcionEjercicio: descripcionEjercicio,
                caloriasQuemar: caloriasQuemar
            };
            editIndex = -1;
        }

        localStorage.setItem("combos", JSON.stringify(combos));
        renderizarCombos();
        document.getElementById("Combo").reset();
        document.getElementById("guardarBoton").textContent = "Guardar";
    }

    function eliminarCombo(event) {
        let index = event.target.getAttribute('data-index');
        if (confirm("¿Seguro? No podrás recuperar lo perdido luego. :( ")) {
            combos.splice(index, 1);
            localStorage.setItem("combos", JSON.stringify(combos));
            renderizarCombos();
        }
    }

    function editarCombo(event) {
        var index = event.target.getAttribute('data-index');
        let combo = combos[index];
        document.getElementById("comboNombre").value = combo.nombre;
        document.getElementById("tipos").value = combo.tipoComida;
        document.getElementById("descripción").value = combo.descripcionComida;
        document.getElementById("calorías").value = combo.caloriasComida;
        document.getElementById("caloriasQuemar").value = combo.caloriasQuemar;
        document.getElementById("nombreEjercicio").value = combo.nombreEjercicio;
        document.getElementById("descripciónEjercicio").value = combo.descripcionEjercicio;

        document.getElementById("guardarBoton").textContent = "Guardar";
        editIndex = index;
    }

    function actualizarResumenCombos(combosMostrar = combos) {
        document.getElementById("totalCombos").textContent = combosMostrar.length;
        let tiposContador = {};
        tipos.forEach(tipo => {
            tiposContador[tipo.nombre] = 0;
        });
        combosMostrar.forEach(combo => {
            tiposContador[combo.tipoComida]++;
        });

        let resumentiposHTML = "";
        tipos.forEach(tipo => {
            resumentiposHTML += `<p><strong>${tipo.nombre}:</strong> ${tiposContador[tipo.nombre]}</p>`;
        });
        document.getElementById("resumenTipos").innerHTML = resumentiposHTML;
    }

    document.getElementById("listaCombo").addEventListener("click", function(event) {
        if (event.target.classList.contains("eliminar-btn")) {
            eliminarCombo(event);
        } else if (event.target.classList.contains("editar-btn")) {
            editarCombo(event);
        }
    });

    document.getElementById("Combo").addEventListener("submit", agregarCombo);

    renderizarCombos();
});

