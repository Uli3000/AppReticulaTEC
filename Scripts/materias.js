var comboMaterias = document.getElementById("comboMaterias");
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
//Metodo para volver a cargar las opciones del combo cuando se haga una actualizacion en la base de datos
function actualizCombo(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            opcionesMaterias = JSON.parse(xhr.responseText);
            cargarOpciones("comboMaterias", opcionesMaterias.tabla1);
        }
    };
    xhr.send();
}

//Funcion para enviar datos de parametros y a ejecutar inserts, deletes, o updates
function enviarSolicitud(datos) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/MateriasPlanesDeEstudiosDBA/phpDataBase/crud.php", true);

    // Establecer el encabezado de la solicitud para indicar que se esta enviando datos JSON
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Configurar la función de retorno
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
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
        return encodeURIComponent(key) + '=' + encodeURIComponent(datos[key]); //El encodeURIComponent codifica el string para evitar problemas con los caracteres especiales
    }).join('&');

    // Enviar la solicitud al servidor con la cadena de datos
    xhr.send(datosString);
}

// Evento change cada que se selecciona una opcion distinta en el combo de materias
comboMaterias.addEventListener("change", function () {
    var materiaActualizar = document.getElementById('actualizarNombreMateria')
    var credTActualizar = document.getElementById('actualizarCredT')
    var credPActualizar = document.getElementById('actualizarCredP')

    var valorCVESeleccionado = opcionesMaterias.cveMateria[comboMaterias.selectedIndex];
    
    //Funcion fetch para poder mandar datos como parametros y ademas despues manipular la consultas que necesiten de esos datos
    fetch("/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `valor1=${encodeURIComponent(valorCVESeleccionado)}`,
}
)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        datosMateria = data;
        materiaActualizar.value = datosMateria.selectMateria[0].NOMBREMATERIA;
        credTActualizar.valueAsNumber = datosMateria.selectMateria[0].CREDT;
        credPActualizar.valueAsNumber = datosMateria.selectMateria[0].CREDP;
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });

});

//Funcion utilizada para cargar opciones en el combo(select) que se indique
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



btnActualizar = document.getElementById('btnActualizar');

btnActualizar.addEventListener("click", function(){
    var materiaActualizar = document.getElementById('actualizarNombreMateria')
    var credTActualizar = document.getElementById('actualizarCredT')
    var credPActualizar = document.getElementById('actualizarCredP')

    var valorCVESeleccionado = opcionesMaterias.cveMateria[comboMaterias.selectedIndex];

    //Comproboar por medio de una expresion regular si es que los creditos vienen en un formato correcto (1 unico digito)
    var credTCorrecta = /^\d$/.test(credTActualizar.value);
    if(!credTCorrecta){
        Swal.fire({
            title: 'Espera',
            text: `Los creditos teoricos no son correctos`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }

    var credPCorrecta = /^\d$/.test(credPActualizar.value);
    if(!credPCorrecta){
        Swal.fire({
            title: 'Espera',
            text: `Los creditos practicos no son correctos`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }

    //Enviar solicitud al servidor indicandole que la accion a realizar es updateMateria
    enviarSolicitud({
    accion: 'updateMateria',
    valor1: materiaActualizar.value,
    valor2: credTActualizar.valueAsNumber,
    valor3: credPActualizar.valueAsNumber,
    valor4: valorCVESeleccionado
});
    //Actualiza el combo por si da el caso de que se actualize el nombre de la materia
    actualizCombo();

    //Poner en blanco los inputs
    materiaActualizar.value = "";
    credTActualizar.valueAsNumber = "";
    credPActualizar.valueAsNumber = "";

    Swal.fire({
        title: 'Listo',
        text: `Valores actualizados correctamente`,
        icon: 'success',
        confirmButtonColor: "#198754",
        confirmButtonText: 'Aceptar'
      });

});


btnAgregar = document.getElementById('btnAgregar');
btnAgregar.addEventListener("click", function(){
    var cveAgregar = document.getElementById('agregarCveMateria')
    var materiaAgregar = document.getElementById('agregarNombreMateria')
    var credTAgregar = document.getElementById('agregarCredT')
    var credPAgregar = document.getElementById('agregarCredP')

    //Comprobar si la cve no esta vacia desde el lado del cliente
    if(cveAgregar.value === ""){
        Swal.fire({
            title: 'Espera',
            text: `La clave ingresada esta vacia`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }
    //Comprueba mediante expRegulares si la clave tiene una longitud de 10 y que pueda contener o letras o numeros o - _
    var cveCorrecta = /^[A-Za-z0-9-_]{1,10}$/.test(cveAgregar.value);
    if(!cveCorrecta){
        Swal.fire({
            title: 'Espera',
            text: `La clave no es correcta`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }
    
    var credTCorrecta = /^\d$/.test(credTAgregar.value);
    if(!credTCorrecta){
        Swal.fire({
            title: 'Espera',
            text: `Los creditos teoricos no son correctos`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }

    var credPCorrecta = /^\d$/.test(credPAgregar.value);
    if(!credPCorrecta){
        Swal.fire({
            title: 'Espera',
            text: `Las creditos practicos no son correctos`,
            icon: 'warning',
            confirmButtonColor: "#ffcc00",
            confirmButtonText: 'Aceptar'
          });
        return;
    }

    enviarSolicitud({
    accion: 'insertMateria',
    valor1: cveAgregar.value,
    valor2: materiaAgregar.value,
    valor3: credTAgregar.valueAsNumber,
    valor4: credPAgregar.valueAsNumber
    });

    Swal.fire({
        title: 'Listo',
        text: `Materia ${materiaAgregar.value} agregada con exito`,
        icon: 'success',
        confirmButtonColor: "#198754",
        confirmButtonText: 'Aceptar'
      });

    actualizCombo();
    
    //Limpiar los inputs
    cveAgregar.value = "";
    materiaAgregar.value = "";
    credTAgregar.value = "";
    credPAgregar.value = "";
        
    
    
});



btnEliminar = document.getElementById('btnEliminar');
btnEliminar.addEventListener("click", function(){
    var valorCVESeleccionado = opcionesMaterias.cveMateria[comboMaterias.selectedIndex]; 

    Swal.fire({
        title: 'Cuidado',
        text: `¿ Seguro que quieres eliminar la materia ${comboMaterias.value} ?`,
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
            accion: 'deleteMateria',
            valor1: valorCVESeleccionado
        });
    
            Swal.fire({
            title: "Listo",
            text: `La materia ${opcionesMaterias.tabla1[comboMaterias.selectedIndex]} se a eliminado con exito`,
            icon: "success",
            confirmButtonColor: "#198754",
            confirmButtonText: 'Aceptar'
            });

        actualizCombo();
    
        //Limpiar los inputs
        var materiaActualizar = document.getElementById('actualizarNombreMateria')
        var credTActualizar = document.getElementById('actualizarCredT')
        var credPActualizar = document.getElementById('actualizarCredP')
    
        materiaActualizar.value = "";
        credTActualizar.valueAsNumber = "";
        credPActualizar.valueAsNumber = "";
        }
        
      });
});

document.addEventListener("DOMContentLoaded", function () {
    // Cargar opciones para el combo de materias desde el backend 
    // en cuanto detecte que la pagina cargue por medio del DOM con el evento DOMContentLoaded
    var xhr = new XMLHttpRequest(); // Solcitudes asincrones por medio del objeto XMLHTTPRequest
    xhr.open("GET", "/MateriasPlanesDeEstudiosDBA/phpDataBase/opciones.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            opcionesMaterias = JSON.parse(xhr.responseText);
            cargarOpciones("comboMaterias", opcionesMaterias.tabla1);
        }
    };
    xhr.send();

});