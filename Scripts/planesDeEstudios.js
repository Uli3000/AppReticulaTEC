var comboPE = document.getElementById("comboPE");
var comboEspecialidad = document.getElementById("comboEspecialidad");
var arregloEspe = [];

//Metodo para volver a cargar las opciones del combo cuando se haga una actualizacion en la base de datos
function actualizCombo(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            opcionesPE = JSON.parse(xhr.responseText);
    //Vuelve a cargar los combos para que se actualizen, el de especialidad se pone vacio para que lo cargue cuando se seleccione un PE
            cargarOpciones("comboPE", opcionesPE.tabla2);
            cargarOpciones("comboEspecialidad", []);
            cargarOpciones("comboPEAgregar", opcionesPE.tabla2);
        }
    };
    xhr.send();
}

//Funcion para enviar datos de parametros y a ejecutar inserts, deletes, o updates
function enviarSolicitud(datos) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/MateriasPlanesDeEstudiosDBA/phpDataBase/crud.php", true);
    // Establecer el encabezado de la solicitud para indicar que se está enviando datos JSON
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // Procesar la respuesta del servidor si es necesario
            
            if (xhr.status == 200) {
                // Si la respuesta contiene un mensaje de error, mostrarlo al usuario
                if (xhr.responseText.includes("Error en la operación:")) {
                    // alert("Error en la base de datos, intente nuevamente.");
                   Swal.fire({
                    title: 'Error',
                    text: `Error en la base de datos, intente nuevamente.`,
                    icon: 'error',
                    confirmButtonColor: "#d33",
                    confirmButtonText: 'Aceptar'
                  });
                    console.log(xhr.responseText);
                } else {
                    // Si no hay errores
                    console.log(xhr.responseText);
                }
            } else {
                // Manejar otros códigos de estado, si es necesario
                // alert("Error en la solicitud al servidor");
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

//Funcion utilizada para cargar opciones en el combo(select) que se indique y limpiar el combo primero para resetear los datos y que 
//no se acumulen dentro
function cargarOpciones(combo, opciones) {
            var select = document.querySelector('[name="' + combo + '"]');
            select.innerHTML = "";
            opciones.forEach(function (opcion) {
                var option = document.createElement("option");
                option.value = opcion;
                option.text = opcion;
                select.add(option);
            });
        }

//Change del combo por si quiere elegir agregar una especialidad en un PE existente y ahorrar escribirlo
comboPEAgregar.addEventListener("change", function () {
    var cvePEAgregar = document.getElementById('agregarCvePE')
    var peAgregar = document.getElementById('agregarNombrePE')
    var valorCVEPEAgregar = opcionesPE.cvePE[comboPEAgregar.selectedIndex];

    cvePEAgregar.value = valorCVEPEAgregar;
    peAgregar.value = comboPEAgregar.value;
});

//Funcion para que cargue los datos en los inputs ya actualizados
function actualizarPEEsp(){
    var peActualizar = document.getElementById('actualizarNombrePE')
    var especialidadActualizar = document.getElementById('actualizarNombreEspecialidad')

    var valorCVEPESeleccionado = opcionesPE.cvePE[comboPE.selectedIndex];
    var valorCVEEspecialidadSeleccionado = arregloEspe[comboEspecialidad.selectedIndex];
    
    fetch("/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `valor1=${encodeURIComponent(valorCVEPESeleccionado)}&valor2=${encodeURIComponent(valorCVEEspecialidadSeleccionado)}`,
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
        peActualizar.value = datosPE.selectPE[0].NOMBREPLANESTUDIOS;
        especialidadActualizar.value = datosPE.selectPE[0].NOMBREESPECIALIDAD;
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
}

// Evento change del PE 
comboPE.addEventListener("change", function () {

    var valorCVEPESeleccionado = opcionesPE.cvePE[comboPE.selectedIndex];

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
        
        cargarOpciones("comboEspecialidad", arrayEsp);
        
        actualizarPEEsp();
        
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
    let botonDisabled = document.getElementById("btnEliminar");
    botonDisabled.disabled = false;
});

comboEspecialidad.addEventListener("change", function () {
    // Ejecutar la funcion para poner en los inputs los datos
    actualizarPEEsp();
});

btnAgregar = document.getElementById('btnAgregar');
btnAgregar.addEventListener("click", function(){
    var cvePEAgregar = document.getElementById('agregarCvePE')
    var peAgregar = document.getElementById('agregarNombrePE')
    var cveEspecialidadAgregar = document.getElementById('agregarCveEspecialidad')
    var especialidadAgregar = document.getElementById('agregarNombreEspecialidad')

    //Validar que las claves no esten vacias
    if(cvePEAgregar.value === ""){
        Swal.fire({
            title: 'Espera',
            text: `La claves no puede estar vacias`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }

    if(cveEspecialidadAgregar.value === ""){
        Swal.fire({
            title: 'Espera',
            text: `La claves no pueden estar vacias`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }
    
    //Enviar solicitud con los valores necesarios para realizarla y la accion que se hara
    enviarSolicitud({
    accion: 'insertPE',
    valor1: cvePEAgregar.value,
    valor2: peAgregar.value,
    valor3: cveEspecialidadAgregar.value,
    valor4: especialidadAgregar.value
});

    Swal.fire({
        title: 'Listo',
        text: `Plan de estudios ${peAgregar.value} con la especialidad ${especialidadAgregar.value} agregada con exito`,
        icon: 'success',
        confirmButtonColor: "#198754",
        confirmButtonText: 'Aceptar'
      });

    //Actualiza el combo con los PE nuevos
    actualizCombo();
    
    //Limpia los inputs
    cvePEAgregar.value = "";
    peAgregar.value = "";
    cveEspecialidadAgregar.value = "";
    especialidadAgregar.value = "";
});

btnEliminar = document.getElementById('btnEliminar');
btnEliminar.addEventListener("click", function(){
    var valorCVEPESeleccionado = opcionesPE.cvePE[comboPE.selectedIndex];
    var valorCVEEspecialidadSeleccionado = arregloEspe[comboEspecialidad.selectedIndex];

    Swal.fire({
        title: 'Cuidado',
        text: `¿ Seguro que quieres eliminar el plan de estudios ${opcionesPE.tabla2[comboPE.selectedIndex]} con especialidad ${comboEspecialidad[comboEspecialidad.selectedIndex].value} ?`,
        icon: 'error',
        footer: '<a>Asegurate de que no tenga relacion con alguna tabla antes</a>',
        showCancelButton: true,
        confirmButtonColor: "#ffcc00",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, eliminar"
        }).then((result) => {
        if (result.isConfirmed) {
    enviarSolicitud({
    accion: 'deletePE',
    valor1: valorCVEPESeleccionado,
    valor2: valorCVEEspecialidadSeleccionado
});

    Swal.fire({
        title: "Listo",
        text: `Plan de estudios ${opcionesPE.tabla2[comboPE.selectedIndex]} con especialidad ${comboEspecialidad[comboEspecialidad.selectedIndex].value} eliminada con exito`,
        icon: "success",
        confirmButtonColor: "#198754",
        confirmButtonText: 'Aceptar'
        });

    //Actualizar con el PE borrado
    actualizCombo();

    //Limpiar los inputs
    var peActualizar = document.getElementById('actualizarNombrePE')
    var especialidadActualizar = document.getElementById('actualizarNombreEspecialidad')

    peActualizar.value = "";
    especialidadActualizar.value = "";

    var cvePEAgregar = document.getElementById('agregarCvePE')
    var peAgregar = document.getElementById('agregarNombrePE')
    var cveEspecialidadAgregar = document.getElementById('agregarCveEspecialidad')
    var especialidadAgregar = document.getElementById('agregarNombreEspecialidad')

    cvePEAgregar.value = "";
    peAgregar.value = "";
    cveEspecialidadAgregar.value = "";
    especialidadAgregar.value = "";
}
        
});
});

btnActualizar = document.getElementById('btnActualizar');
btnActualizar.addEventListener("click", function(){
var valorCVEPESeleccionado = opcionesPE.cvePE[comboPE.selectedIndex];
var valorCVEEspecialidadSeleccionado = arregloEspe[comboEspecialidad.selectedIndex];
var peActualizar = document.getElementById('actualizarNombrePE')
var especialidadActualizar = document.getElementById('actualizarNombreEspecialidad')

enviarSolicitud({
accion: 'updatePE',
valor1: peActualizar.value,
valor2: especialidadActualizar.value,
valor3: valorCVEPESeleccionado,
valor4: valorCVEEspecialidadSeleccionado
});

actualizCombo();

//Limpiar los inputs
peActualizar.value = "";
especialidadActualizar.value = "";

var cvePEAgregar = document.getElementById('agregarCvePE')
var peAgregar = document.getElementById('agregarNombrePE')
var cveEspecialidadAgregar = document.getElementById('agregarCveEspecialidad')
var especialidadAgregar = document.getElementById('agregarNombreEspecialidad')

cvePEAgregar.value = "";
peAgregar.value = "";
cveEspecialidadAgregar.value = "";
especialidadAgregar.value = "";

Swal.fire({
    title: 'Listo',
    text: `Valores actualizados correctamente`,
    icon: 'success',
    confirmButtonColor: "#198754",
    confirmButtonText: 'Aceptar'
  });

});

document.addEventListener("DOMContentLoaded", function () {
    // Cargar opciones para el combo de materias desde el backend
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //El comboEspecialidad no se cargar porque se hace luego
            opcionesPE = JSON.parse(xhr.responseText);
            cargarOpciones("comboPE", opcionesPE.tabla2);
            cargarOpciones("comboPEAgregar", opcionesPE.tabla2);
        }
    };
    xhr.send();

});