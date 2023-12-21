//Variables globales
var nombrePlanEstudiosGlobal;
var nombreEspecialidadGlobal;
var cvePEGlobal;
var cveEspecialidadGlobal;
var existingCell;
var celdaActual;

// Array para mantener el conteo de celdas llenas por cada semestre
var semestreCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// Función para enviar la solicitud al servidor de inserts, update, delete, segun lo que se indique en el objeto enviado como parametro
function enviarSolicitud(datos) {
    var xhr = new XMLHttpRequest();

    // Configurar la solicitud (método POST, URL del archivo PHP, asíncrono)
    xhr.open("POST", "/MateriasPlanesDeEstudiosDBA/phpDataBase/crud.php", true);

    // Establecer el encabezado de la solicitud para indicar que se está enviando datos JSON
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // Si la respuesta contiene un mensaje de error, mostrarlo al usuario
                if (xhr.responseText.includes("Error en la operación:")) {
                    Swal.fire({
                        title: 'Error',
                        text: `Error en la base de datos, intente nuevamente.`,
                        icon: 'error',
                        confirmButtonColor: "#d33",
                        confirmButtonText: 'Aceptar'
                      });
                    console.log(xhr.responseText);
                    existingCell.innerHTML = ""; // Limpiar la celda en el cliente
                } else {
                    // Si no hay errores, puedes realizar acciones adicionales si es necesario
                    console.log(xhr.responseText);
                }
            } else {
                // Manejar otros códigos de estado, si es necesario
                Swal.fire({
                    title: 'Error',
                    text: `Error en la solicitud al servidor`,
                    icon: 'error',
                    confirmButtonColor: "#d33",
                    confirmButtonText: 'Aceptar'
                  });
            }
        }
    };

    // Construir la cadena de datos a partir del objeto que se pide como parametro
    // El datosString va construllendo una cadena en base a que obtiene todas las llaves del objeto pasado como parametro y con el map
    // se va poniendo por cada llave un string que pueda leer una solicitudHTTP y cada que termina un valor se pone un & al final
    // un ejemplo de como quedaria la cadena podria ser valor1=juan&valor2=pepe
    var datosString = Object.keys(datos).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(datos[key]);
    }).join('&');

    // Enviar la solicitud al servidor con la cadena de datos
    xhr.send(datosString);
}

// Función para regresar a la primera página
function regresar() {
    window.location.href = "selectPEAlumno.php";
}

//Funcion para cargar el PE actual por si ya tiene datos anteriormente cargados
function cargarPEActual(){
fetch("/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `valor1=${encodeURIComponent(cvePEGlobal)}&valor2=${encodeURIComponent(cveEspecialidadGlobal)}`,
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        opcionesMaterias = data;
        matPE = data.cargaMatPE;
        //Ir cargando cada materia del PE y especialidad espeficos en la tabla mediante la funcion
        for(var j = 0; j < matPE.length; j++){
            cargarMateriaEnSemestre(matPE[j]);
                }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });

function cargarMateriaEnSemestre(matPEItem) {
    var index;
    // Obtener valores seleccionados
    var cveMateria = matPEItem.CVEMATERIA;
    //Obtener el indice de donde esta la materia seleccionada en la DB
    for (var i = 0; i < opcionesMaterias.cveMateria.length; i++) {
    if (opcionesMaterias.cveMateria[i] === cveMateria) {
        index = i;
        break;
    }
    }

    //Cargar los datos de la materia seleccionada con el indice encontrado de esta
    var nombreMateria = opcionesMaterias.tabla1[index];
    var credt = opcionesMaterias.credt[index];
    var credp = opcionesMaterias.credp[index];
    var totalcred = opcionesMaterias.totalcred[index];

    // Verificar si ya existe una celda con la misma cveMateria
    var celdaExistente = Array.from(document.querySelectorAll('#tabla tbody td div'))
        .find(function (celda) {
            return celda.textContent.includes(cveMateria);
        });

    if (celdaExistente) {
        Swal.fire({
            title: 'Espera',
            text: "Ya existe una celda con la misma cveMateria.",
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }

    // Obtener el cuerpo de la tabla
    var tbody = document.querySelector('#tabla tbody');

    // Buscar una fila existente con espacio en el semestre correspondiente
    var existingRow = Array.from(tbody.rows).find(function (row) {
        return row.cells.length > 0 && row.cells[Number(matPEItem.NUMSEMESTRE) - 1].children.length === 0;
    });

    // Verificar si la columna del semestre ya está llena
    if (semestreCount[Number(matPEItem.NUMSEMESTRE) - 1] >= 8) {
        Swal.fire({
            title: 'Espera',
            text: "La columna seleccionada ya tiene 8 elementos.",
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }

    // Si no se encuentra una fila existente, crear una nueva fila
    if (!existingRow) {
        existingRow = tbody.insertRow();

        // Agregar celdas vacías en todas las columnas
        for (var i = 0; i < 8; i++) {
            var cell = existingRow.insertCell();
        }
    }

    // Obtener la celda recién creada en la columna del semestre
    existingCell = existingRow.cells[Number(matPEItem.NUMSEMESTRE) - 1];
    celdaActual = existingRow.cells[Number(matPEItem.NUMSEMESTRE) - 1];

    // Actualizar el conteo para la columna del semestre
    semestreCount[Number(matPEItem.NUMSEMESTRE) - 1]++;

    // Crear una nueva celda con la información seleccionada
    var newContent = document.createElement('div');
    newContent.innerHTML =  `${nombreMateria} <br> ${cveMateria} <br> <hr>`;
    newContent.style.textAlign = "center";
    
    var pCred = document.createElement('p')
    pCred.innerHTML = `<b>${credt} - ${credp} - ${totalcred}</b>`;
    pCred.style.textAlign = "center";
    pCred.style.fontSize = "1.3vw";

    var botonPre = document.createElement("button");
    botonPre.value = "Prerequisitos";
    botonPre.textContent = "Prerequisitos";
    botonPre.classList.add("btn","btn-warning");
    botonPre.style.width = "100%";  

    fetch("/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `valor1=${encodeURIComponent(cvePEGlobal)}&valor2=${encodeURIComponent(cveEspecialidadGlobal)}&valor3=${encodeURIComponent(cveMateria)}`,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            listaPrerequisitos = data;

            if(listaPrerequisitos.prerequisitos.length > 0){
                botonPre.classList.remove("btn-warning");
                botonPre.classList.add("btn-success");
        }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
        });

    newContent.appendChild(pCred);
    newContent.appendChild(botonPre);

    // Agregar la nueva celda al contenido existente
    existingCell.appendChild(newContent);

    // Evento click para el botón Prerequisitos
    botonPre.addEventListener("click", function () {
    var listaMateriasPre = [];
    // Crear contenido para la ventana emergente
    var ventanaContenido = `
    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
    <div class="container my-3">
        <p>Materia: <b>${nombreMateria} </b>. Cve Materia: <b> ${cveMateria} </b> </p>
        <p><b>Prerequisitos:</b></p>
        <div id="listaPre">
        </div>
        <button id="btnCerrar" class="btn btn-warning">Cerrar</button>
    </div>
    </body>
    `;

    // Crear y mostrar la ventana emergente
    var ventanaEmergente = window.open("", "Prerequisitos", "width=500,height=550");
    var left = (window.innerWidth - ventanaEmergente.outerWidth) / 2 + window.screenX;
    var top = (window.innerHeight - ventanaEmergente.outerHeight) / 2 + window.screenY;

    ventanaEmergente.moveTo(left, top); // Centrar la ventana
    ventanaEmergente.focus(); // Dar foco a la ventana

    ventanaEmergente.document.title = "Ventana Prerequisitos";
    ventanaEmergente.document.body.innerHTML = ventanaContenido;

    var listaPre = ventanaEmergente.document.getElementById('listaPre');

    var lista = document.createElement("ul");
    lista.classList.add("list-group","list-group-numbered","my-2")
    listaPre.appendChild(lista);
    
    //Funcion para cargar la lista de las materias que son prerequisitos con todos sus datos
    function cargarListaPre(cvePE, cveEspecialidad, cveMateria) {
    fetch("/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `valor1=${encodeURIComponent(cvePE)}&valor2=${encodeURIComponent(cveEspecialidad)}&valor3=${encodeURIComponent(cveMateria)}`,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            listaPrerequisitos = data;

            for (let i = 0; i < listaPrerequisitos.prerequisitos.length; i++) {
                var listali = document.createElement("li");
                listali.classList.add("list-group-item","d-flex","justify-content-between","align-items-start");
                var divContenido = document.createElement("div");
                divContenido.classList.add("ms-2","me-auto","fw-bold");
                var divTitulo = document.createElement("div");
                divTitulo.style.fontWeight = "normal";
                var nums = document.createElement("span");
                nums.classList.add("badge","bg-secondary","rounded-pill");

                divTitulo.textContent += listaPrerequisitos.prerequisitos[i].CVEMATERIA 
                divContenido.textContent += listaPrerequisitos.prerequisitos[i].NOMBREMATERIA
                nums.textContent += listaPrerequisitos.prerequisitos[i].CREDT + " - " 
                + listaPrerequisitos.prerequisitos[i].CREDP + " - " 
                + listaPrerequisitos.prerequisitos[i].TOTALCREDITOS
                listaMateriasPre.push(listaPrerequisitos.prerequisitos[i].CVEMATERIA);

                lista.appendChild(listali);
                listali.appendChild(divContenido);
                divContenido.appendChild(divTitulo);
                listali.appendChild(nums);
                
            }
            
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
        });
    }  

    //Ejecutar la lista para cargar las materias prerequisitos de los datos pasados
    cargarListaPre(cvePEGlobal, cveEspecialidadGlobal, cveMateria);

    var btnCerrar = ventanaEmergente.document.getElementById("btnCerrar");

    // Agregar evento de click al botón Cerrar en la ventana emergente
    btnCerrar.addEventListener("click", function () {
        ventanaEmergente.close(); // Cerrar la ventana emergente al hacer clic en el botón cerrar
    });
    
});

}
}

// Cargar opciones al cargar la página
document.addEventListener("DOMContentLoaded", function () {

    // Obtener la información de la carrera y el plan de estudios de la URL que viene de la pagina anterior
    var urlParams = new URLSearchParams(window.location.search);
    var planEstudios = urlParams.get('planEstudios');
    var especialidad = urlParams.get('especialidad');
    var cvePE = urlParams.get('cvePE');
    var cveEspecialidad = urlParams.get('cveEspecialidad');

    //Indicarle el PE y especialidad a la variable global para usarla luego
    nombrePlanEstudiosGlobal = planEstudios;
    nombreEspecialidadGlobal = especialidad;

    cvePEGlobal = cvePE;
    cveEspecialidadGlobal = cveEspecialidad;

    // Mostrar la información de la carrera y el plan de estudios al inicio de la pagina
    var infoCarreraDiv = document.getElementById("info-carrera");
    infoCarreraDiv.innerHTML = "<p>Carrera: <b>" + planEstudios + "</b> Especialidad: <b>" + especialidad + "</b></p>";

    // Cargar opciones para el combo de materias desde el backend
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            opcionesMaterias = JSON.parse(xhr.responseText);
        }
    };
    xhr.send();
    //Ejecutar la funcion para cargar el PEActual siempre por si viene con materias ya cargadas en ese PE
    cargarPEActual();
});