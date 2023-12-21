var cvesPE;
var cvesEspecialidad;
var comboPE = document.getElementById("comboPE");
var comboEspecialidad = document.getElementById("comboEspecialidad");
var arregloEspe = [];

// Función para cargar opciones en un combo especifico
function cargarOpciones(combo, opciones) {
    var select = document.querySelector('[name="' + combo + '"]');
    select.innerHTML = ""; //Limpia el combo de especialidad para volverle a cargar lo de su respectivo PE luego
    opciones.forEach(function (opcion) {
        var option = document.createElement("option");
        option.value = opcion;
        option.text = opcion;
        select.add(option);
    });
}

// Evento change del PE 
comboPE.addEventListener("change", function () {
    var valorCVEPESeleccionado = opciones.cvePE[comboPE.selectedIndex];

    fetch("/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `valor1=${encodeURIComponent(valorCVEPESeleccionado)}`,
}
)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        datosPE = data;
        // Llenar el comboEspecialidad en base a que plan de estudios se haya elegido
        var arrayEsp = [];
        for(var i=0; i<datosPE.selectEspecialidad.length;i++){
            arrayEsp.push(datosPE.selectEspecialidad[i].NOMBREESPECIALIDAD);
            arregloEspe[i] = datosPE.selectEspecialidad[i].CVEESPECIALIDAD;
        }
        
        //Cargar el comboEspecialidad con los nombres de las especialidades segun el PE elegido
        cargarOpciones("comboEspecialidad", arrayEsp);
        
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });

    let botonDisabled = document.getElementById("botonDisabled");
    botonDisabled.disabled = false;
});


// Función para guardar la selección y pasar a la siguiente pagina
function guardarSeleccion() {
    var planEstudios = document.forms["formulario1"]["comboPE"].value;
    var especialidad = document.forms["formulario1"]["comboEspecialidad"].value;

    // Obtener el índice seleccionado en los combos
    var indicePlanEstudios = document.forms["formulario1"]["comboPE"].selectedIndex;
    var indiceEspecialidad = document.forms["formulario1"]["comboEspecialidad"].selectedIndex;

    // Obtener las claves correspondientes a los índices seleccionados
    var cvePE = cvesPE[indicePlanEstudios];
    var cveEspecialidad = arregloEspe[indiceEspecialidad];

    // Redireccionar a la segunda página con los parámetros del PE y especialidad elegidos
    window.location.href = "reticulaAlumno.php?planEstudios=" + encodeURIComponent(planEstudios) 
    + "&especialidad=" + encodeURIComponent(especialidad)+ "&cvePE=" + encodeURIComponent(cvePE)
    + "&cveEspecialidad=" + encodeURIComponent(cveEspecialidad);
}

// Cargar opciones en el combo PE al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    // Realizar una petición AJAX para obtener opciones desde el backend
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            opciones = JSON.parse(xhr.responseText);
            cargarOpciones("comboPE", opciones.tabla2);
            //Solo se carga el comboPE porque el otro se hace luego y se guarda todas las cves para poder luego mandar la indicada 
            //a la siguiente pagina
            cvesPE = opciones.cvePE;
        }
    };
    xhr.send();
});