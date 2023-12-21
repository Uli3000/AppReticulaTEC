//Variables globales
var nombrePlanEstudiosGlobal;
var nombreEspecialidadGlobal;
var cvePEGlobal;
var cveEspecialidadGlobal;
var existingCell;
var celdaActual;

// Función para cargar opciones en un combo elegido
function cargarOpciones(combo, opciones) {
    var select = document.querySelector('[name="' + combo + '"]');
    opciones.forEach(function (opcion) {
        var option = document.createElement("option");
        option.value = opcion;
        option.text = opcion;
        select.add(option);
    });
}

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


// Función para agregar información seleccionada a la tabla
function agregarInformacion() {
// Obtener valores seleccionados
var nombreMateria = document.forms["formulario2"]["columna_tabla1"].value;
var numero = document.forms["formulario2"]["numero"].value;

// Obtener los datos correspondientes a la materia seleccionada
var index = opcionesMaterias.tabla1.indexOf(nombreMateria);
var credt = opcionesMaterias.credt[index];
var credp = opcionesMaterias.credp[index];
var totalcred = opcionesMaterias.totalcred[index];
var cveMateria = opcionesMaterias.cveMateria[index];

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
    return row.cells.length > 0 && row.cells[Number(numero) - 1].children.length === 0;
});

// Verificar si la columna del semestre ya está llena
if (semestreCount[Number(numero) - 1] >= 8) {
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
existingCell = existingRow.cells[Number(numero) - 1];
celdaActual = existingRow.cells[Number(numero) - 1];

// Actualizar el conteo para la columna del semestre
semestreCount[Number(numero) - 1]++;

//Enviar solicitud para insercción a la base de datos
enviarSolicitud({
    accion: 'insertMPE',
    valor1: numero,
    valor2: cveMateria,
    valor3: cvePEGlobal,
    valor4: cveEspecialidadGlobal
});

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
botonPre.classList.add("btn", "btn-secondary");
botonPre.style.width = "100%";

newContent.appendChild(pCred);
newContent.appendChild(botonPre);

// Agregar la nueva celda al contenido existente
existingCell.appendChild(newContent);

//Reload a la pagina para que se actaulize los datos en prerequisitos en las materias nuevas
location.reload();

}

//Funcion para eliminar una materia elegida del PE actual
function eliminarInformacion() {
    // Obtener información para la eliminación
    var nombreMateria = document.forms["formulario2"]["columna_tabla1"].value;
    var index = opcionesMaterias.tabla1.indexOf(nombreMateria);
    var semestre = Number(document.forms["formulario2"]["numero"].value); // Obtener el número del semestre actual
    var cveMateria = opcionesMaterias.cveMateria[index];

    //Obtener las cves de las materias prerequisitos y las materias a las que pertenecen
    var arraycvespres = [];
    for(var i = 0; i <opcionesMaterias.allMatPre.length; i++){
        arraycvespres.push(opcionesMaterias.allMatPre[i].CVEMATERIA);
        arraycvespres.push(opcionesMaterias.allMatPre[i].CVEMATERIAPRE);
    }
    //En caso de tener alguna relacion la materia a eliminar con la tabla prerequisitos manejar el error de la bd y mandarle un mensaje
    if(arraycvespres.includes(cveMateria)){
        Swal.fire({
            title: 'Error',
            text: "La materia tiene o es parte de un prerequisito, quitar las relaciones con prerequisitos en caso de querer eliminar.",
            icon: 'error',
            confirmButtonColor: "#d33",
            confirmButtonText: 'Aceptar'
          });
        return;
    }
    // Busca si existe la celda correspondiente al semestre actual y la cveMateria seleeccionada
    var celdaEliminar = Array.from(document.querySelectorAll('#tabla tbody td'))
        .find(function (celda) {
            return celda.cellIndex === semestre - 1 && celda.textContent.includes(cveMateria);
        });

        //En caso de que si eliminar la celda visualmente y en la base de datos el registro
    if (celdaEliminar) {
        // Confirmar con el usuario antes de eliminar
        Swal.fire({
            title: 'Cuidado',
            text: "¿Estás seguro de que deseas eliminar esta materia?",
            icon: 'error',
            footer: '<a>Asegurate de que no tenga relacion con alguna tabla antes</a>',
            showCancelButton: true,
            confirmButtonColor: "#ffcc00",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si, eliminar"
            }).then((result) => {
            if (result.isConfirmed) {
         // Realizar operación de eliminación en el servidor y actualizar la celda si es exitosa
         enviarSolicitud({
            accion: 'deleteMPE',
            valor1: semestre,
            valor2: cveMateria,
            valor3: cvePEGlobal,
            valor4: cveEspecialidadGlobal
        });
        celdaEliminar.innerHTML = ""; // Limpiar la celda en el cliente
        semestreCount[Number(semestre) - 1]--; //Reducir en el contador de materias que hay 1 menos en ese semestre ahora

        Swal.fire({
            title: "Listo",
            text: `Materia ${nombreMateria} en el semestre ${semestre} eliminada correctamente`,
            icon: "success",
            confirmButtonColor: "#198754",
            confirmButtonText: 'Aceptar'
            });
    }
            
    });
        
    }else{
        Swal.fire({
            title: 'Error',
            text: "No se encontró la celda correspondiente para eliminar.",
            icon: 'error',
            confirmButtonColor: "#d33",
            confirmButtonText: 'Aceptar'
          });
}
}

// Función para regresar a la primera página
function regresar() {
    window.location.href = "selectPE.html";
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
    botonPre.classList.add("btn", "btn-warning");
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
        <div class="input-group py-3 container bg-light rounded">
        <label class="pb-2" for="MateriasPre">Selecciona el nombre de la materia que quieres agregar como prerequisito:</label>
        <select class="form-select" name="MateriasPre"></select>
        <button id="btnAgregar" class="btn btn-success"><i class="bi bi-plus-circle"></i></button>
        <button id="btnEliminar" class="btn btn-danger"><i class="bi bi-trash"></i></button>
        </div>
        
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

    // Obtener el combo de materias en la ventana emergente
    var comboMat = ventanaEmergente.document.querySelector('[name="MateriasPre"]');

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
    
    // Función para cargar las opciones del combo de materias disponibles para prerequisitos en esa materia desde el backend
    function cargarOpcionesMaterias(cvePE, cveEspecialidad) {
    fetch("/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `valor1=${encodeURIComponent(cvePE)}&valor2=${encodeURIComponent(cveEspecialidad)}`,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            opcionesMaterias = data;
            console.log(opcionesMaterias);
            // Llamar a la función para crear las opciones en el combo
            crearOpcionesEnCombo(opcionesMaterias.nombreMatPreDisponibles);
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
        });
    }

    // Función para crear las opciones en el combo
    function crearOpcionesEnCombo(opciones) {
        opciones.forEach(function (opcion) {
            var option = ventanaEmergente.document.createElement("option");
            option.value = opcion.NOMBREMATERIA;
            option.text = opcion.NOMBREMATERIA;
            comboMat.add(option);
        });
    }

    // Llamar a la función para cargar opciones al abrir la ventana emergente
    cargarOpcionesMaterias(cvePEGlobal, cveEspecialidadGlobal);

    var btnAgregar = ventanaEmergente.document.getElementById("btnAgregar");

    // Agregar evento de clic al botón Agregar en la ventana emergente de prerequisitos
    btnAgregar.addEventListener("click", function () {
        Swal.fire({
            title: 'Listo',
            text: `Prerequisito agregado a la materia ${nombreMateria}`,
            icon: 'success',
            confirmButtonColor: "#198754",
            confirmButtonText: 'Aceptar'
          });
        let indexPre = comboMat.selectedIndex;
        
        // Verificar si se encontró la materia en las opciones para luego agregarla
        if (indexPre !== -1) {
            let cveMateriaPRE = opcionesMaterias.matDisponiblesPre[indexPre].CVEMATERIA;

            // Enviar solicitud para inserción a la base de datos
            enviarSolicitud({
                accion: 'insertPRE',
                valor1: cveMateriaPRE,
                valor2: cvePEGlobal,
                valor3: cveMateria,
                valor4: cveEspecialidadGlobal
            });
        } else {
            console.error("No se encontró la materia seleccionada en las opciones.");
        }

        // Cerrar la ventana emergente
        ventanaEmergente.close();

        botonPre.classList.remove("btn-warning");
        botonPre.classList.add("btn-success");

    });

    var btnEliminar = ventanaEmergente.document.getElementById("btnEliminar");

    btnEliminar.addEventListener("click", function(){
        let indexPre = comboMat.selectedIndex;
        // Verificar si se encontró la materia en las opciones para luego agregarla
        if (indexPre !== -1) {    
            let cveMateriaPRE = opcionesMaterias.matDisponiblesPre[indexPre].CVEMATERIA;
            
            //Si la materia seleccionada si es prerequisito de la materia actual se hace el delete si no no
            if(listaMateriasPre.includes(cveMateriaPRE)){
                Swal.fire({
                    title: "Listo",
                    text: `Prerequisito eliminado de la materia ${nombreMateria}`,
                    icon: "success",
                    confirmButtonColor: "#198754",
                    confirmButtonText: 'Aceptar'
                    });
            // Enviar solicitud para inserción a la base de datos
            enviarSolicitud({
                accion: 'deletePRE',
                valor1: cveMateriaPRE,
                valor2: cvePEGlobal,
                valor3: cveMateria,
                valor4: cveEspecialidadGlobal
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: "Esa materia no es prerequisito",
                icon: 'error',
                confirmButtonColor: "#d33",
                confirmButtonText: 'Aceptar'
              });
        }
        } else {
            console.error("No se encontró la materia seleccionada en las opciones.");
        }
        ventanaEmergente.close();
        
        var listaul = ventanaEmergente.document.querySelectorAll("li");

        if(listaul.length <= 1){
        botonPre.classList.remove("btn-success");
        botonPre.classList.add("btn-warning");
    }
    });

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
    // Obtener el combo conteneder de los numeros de los semestre
    var comboNumeros = document.querySelector('[name="numero"]');

    // Agregar opciones del 1 al 8
    for (var i = 1; i <= 8; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        comboNumeros.add(option);
    }

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
            cargarOpciones("columna_tabla1", opcionesMaterias.tabla1);
        }
    };
    xhr.send();
    //Ejecutar la funcion para cargar el PEActual siempre por si viene con materias ya cargadas en ese PE
    cargarPEActual();
});