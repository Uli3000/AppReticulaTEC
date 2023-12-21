<?php
// Parámetros de conexión
$dsn = 'DRIVER={IBM DB2 ODBC DRIVER};DATABASE=PROBANDO;HOSTNAME=localhost;PORT=25000;PROTOCOL=TCPIP;CCSID=1208;';
$user = 'db2admin';
$password = 'ball2209';

// Intentar establecer la conexión
$conn = odbc_connect($dsn, $user, $password);

//Con isset y operadores ternarios se determina que si viene una valor del lado cliente se pone y si no pone null debido a que 
//las solicitudes del cliente algunas pueden ser de 1 y otras de 3 valores y asi
$valor1 = isset($_POST["valor1"]) ? $_POST["valor1"] : null;
$valor2 = isset($_POST["valor2"]) ? $_POST["valor2"] : null;
$valor3 = isset($_POST["valor3"]) ? $_POST["valor3"] : null;
$valor4 = isset($_POST["valor4"]) ? $_POST["valor4"] : null;
$accion = $_POST["accion"];

// Verificar si la conexión fue exitosa
if ($conn) {
    // Determinar la acción a realizar con un switch por medio de la variable accion enviada
    switch ($accion) {
        case 'insertMPE':
            // Realizar la operación de INSERTMPE
            $query = "INSERT INTO ULISE.materiasplanesdeestudios (NUMSEMESTRE, CVEMATERIA, CVEPLANESTUDIOS, CVEESPECIALIDAD) VALUES ($valor1, '$valor2', '$valor3', '$valor4')";
            $result = odbc_exec($conn, $query);
            break;
        case 'insertPRE':
            // Realizar la operación de INSERTPRE
            $query = "INSERT INTO ULISE.prerequisitos (CVEMATERIAPRE, CVEPLANESTUDIOS, CVEMATERIA, CVEESPECIALIDAD) VALUES ('$valor1', '$valor2', '$valor3', '$valor4')";
            $result = odbc_exec($conn, $query);
            break;
        case 'deleteMPE':
            // Realizar la operación de DELETEMPE
            $query = "DELETE FROM ULISE.materiasplanesdeestudios WHERE NUMSEMESTRE = $valor1 AND CVEMATERIA = '$valor2' AND CVEPLANESTUDIOS = '$valor3' AND CVEESPECIALIDAD = '$valor4'";
            $result = odbc_exec($conn, $query);
            break;  
        case 'deletePRE':
            // Realizar la operación de deletePRE
            $query = "DELETE FROM ULISE.prerequisitos WHERE CVEMATERIAPRE = '$valor1' AND CVEPLANESTUDIOS = '$valor2' AND CVEMATERIA = '$valor3' AND CVEESPECIALIDAD = '$valor4'";
            $result = odbc_exec($conn, $query);
            break;  
        case 'updateMateria':
            // Realizar la operación de  updateMateria
            $query = "UPDATE ULISE.materias SET NOMBREMATERIA = '$valor1', CREDT = $valor2, CREDP = $valor3, totalCreditos = $valor2 + $valor3 WHERE CVEMATERIA = '$valor4'";
            $result = odbc_exec($conn, $query);
            break;  
        case 'insertMateria':
            // Realizar la operación de INSERTMateria
            $query = "INSERT INTO ULISE.materias (CVEMATERIA, NOMBREMATERIA, CREDT, CREDP) VALUES ('$valor1', '$valor2', $valor3, $valor4)";
            $result = odbc_exec($conn, $query);
            break;
        case 'deleteMateria':
            // Realizar la operación de deleteMateria
            $query = "DELETE FROM ULISE.materias WHERE CVEMATERIA = '$valor1'";
            $result = odbc_exec($conn, $query);
            break;  
        case 'insertPE':
            // Realizar la operación de INSERTPE
            $query = "INSERT INTO ULISE.planesdeestudio (CVEPLANESTUDIOS, NOMBREPLANESTUDIOS, CVEESPECIALIDAD, NOMBREESPECIALIDAD) VALUES ('$valor1', '$valor2', '$valor3', '$valor4')";
            $result = odbc_exec($conn, $query);
            break;
        case 'deletePE':
            // Realizar la operación de deletePE
            $query = "DELETE FROM ULISE.planesdeestudio WHERE CVEPLANESTUDIOS = '$valor1' AND CVEESPECIALIDAD = '$valor2'";
            $result = odbc_exec($conn, $query);
            break;  
        case 'updatePE':
            // Realizar la operación de updatePE
            $query = "UPDATE ULISE.planesdeestudio SET NOMBREPLANESTUDIOS = '$valor1', NOMBREESPECIALIDAD = '$valor2' WHERE CVEPLANESTUDIOS = '$valor3' AND CVEESPECIALIDAD = '$valor4'";
            $result = odbc_exec($conn, $query);
            break;
        case 'updateTotalCreditos':
            // Realizar la operación de updateTotalCreditos para el valor calculado de totalCreditos
            $query = "UPDATE ULISE.Materias SET totalCreditos = $valor1 + $valor2";
            $result = odbc_exec($conn, $query);
            break;
        default:
            break;
    }

    // Verificar si la operación fue exitosa
    if ($result) {
        echo "Operación realizada con éxito";
    } else {
        echo "Error en la operación: " . odbc_errormsg($conn);
    }

    // Cerrar la conexión
    odbc_close($conn);
} else {
    // Manejar cualquier error de conexión aquí
    echo "Error de conexión con ODBC: " . odbc_errormsg();
}
?>