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

// Inicializar un array para almacenar las opciones de los resultados de las consultas
$opciones = array(
    'corregir' => array(),
    'tabla1' => array(),
    'tabla2' => array(),
    'tabla3' => array(),
    'credt' => array(),
    'credp' => array(),
    'totalcred' => array(),
    'cveMateria' => array(),
    'cvePE' => array(),
    'cveEspecialidad' => array(),
    'prerequisitos' => array(),
    'matDisponiblesPre' => array(),
    'nombreMatPreDisponibles' => array(),
    'cargaMatPE' => array(),
    'allMatPre' => array(),
    'selectMateria' => array(),
    'selectPE' => array(),
    'selectEspecialidad' => array(),
    'semestrePre' => array(),
    'existePre' => array()
);

// Verificar si la conexión fue exitosa
if ($conn) {
    // Realizar consultas para obtener algun valor de alguna materia y ejecutarla con el odbc_exec
    $querycorregir = "SELECT * FROM ULISE.materias";
    $resultcorregir = odbc_exec($conn, $querycorregir);

    $queryTabla1 = "SELECT NOMBREMATERIA FROM ULISE.materias";
    $resultTabla1 = odbc_exec($conn, $queryTabla1);

    $queryTabla2 = "SELECT NOMBREPLANESTUDIOS FROM ULISE.planesdeestudio";
    $resultTabla2 = odbc_exec($conn, $queryTabla2);

    $queryTabla3 = "SELECT NOMBREESPECIALIDAD FROM ULISE.planesdeestudio";
    $resultTabla3 = odbc_exec($conn, $queryTabla3);

    $querycredt = "SELECT CREDT FROM ULISE.materias";
    $resultcredt = odbc_exec($conn, $querycredt);

    $querycredp = "SELECT CREDP FROM ULISE.materias";
    $resultcredp = odbc_exec($conn, $querycredp);

    $querytotalcred = "SELECT TOTALCREDITOS FROM ULISE.materias";
    $resulttotalcred = odbc_exec($conn, $querytotalcred);

    $querycveMaterias = "SELECT CVEMATERIA FROM ULISE.materias";
    $resultcveMaterias = odbc_exec($conn, $querycveMaterias);

    $querycvePE = "SELECT CVEPLANESTUDIOS FROM ULISE.planesdeestudio";
    $resultcvePE = odbc_exec($conn, $querycvePE);

    $querycveEsepecialidad = "SELECT CVEESPECIALIDAD FROM ULISE.planesdeestudio";
    $resultcveEspecialidad = odbc_exec($conn, $querycveEsepecialidad);
    //Consulta de los datos de las materias que tienen como prerequisitos x materia indicada
    $queryAllData = "SELECT m.CVEMATERIA AS CVEMATERIA, m.NOMBREMATERIA AS NombreMateria, m.CREDT AS CredT, m.CREDP AS CredP, m.totalcreditos AS TotalCreditos FROM ULISE.Materias m JOIN ULISE.PREREQUISITOS p ON m.CVEMATERIA = p.cveMateriaPRE WHERE p.cveMateria= '$valor3' AND p.cvePlanEstudios = '$valor1' AND p.cveEspecialidad = '$valor2'";
    $resultAllData = odbc_exec($conn, $queryAllData);
    //Consulta para sacar el numero de semestre de las materias prerequisitos
    $querySemestrePre = "SELECT mpPre.numSemestre AS NUMSEMESTRE FROM ULISE.MateriasPlanesDeEstudios mpPre JOIN ULISE.PREREQUISITOS p ON p.cveMateriaPRE = mpPre.cveMateria WHERE mpPre.cveMateria = '$valor3' AND mpPRE.cvePlanEstudios = '$valor1' AND mpPre.cveEspecialidad = '$valor2'";
    $resultSemestrePre = odbc_exec($conn, $querySemestrePre);
    //Consultas para cargar los datos para formar la reticula
    $queryMatPreDisponible = "SELECT cvemateria FROM ULISE.MATERIASPLANESDEESTUDIOS WHERE cveplanestudios = '$valor1'  AND cveespecialidad = '$valor2'";
    $resultMatPreDisponible = odbc_exec($conn, $queryMatPreDisponible);

    $queryNomMatPreDisponible = "SELECT m.nombremateria FROM ULISE.materias m INNER JOIN ULISE.materiasplanesdeestudios mp ON m.cvemateria = mp.cvemateria AND mp.cveplanestudios = '$valor1'  AND mp.cveespecialidad = '$valor2'";
    $resultNomMatPreDisponible = odbc_exec($conn, $queryNomMatPreDisponible);

    $queryCargaMatPE = "SELECT NUMSEMESTRE, CVEMATERIA FROM ULISE.MATERIASPLANESDEESTUDIOS WHERE CVEPLANESTUDIOS = '$valor1' AND CVEESPECIALIDAD = '$valor2'";
    $resultCargaMatPE = odbc_exec($conn, $queryCargaMatPE);

    $queryAllMatPre = "SELECT cvemateriapre, cvemateria FROM ULISE.prerequisitos";
    $resultAllMatPre = odbc_exec($conn, $queryAllMatPre);

    $querySelectMateria = "SELECT NOMBREMATERIA, CREDT, CREDP FROM ULISE.materias WHERE CVEMATERIA = '$valor1'";
    $resultSelectMateria = odbc_exec($conn, $querySelectMateria);
    //Consultas para obtener el PE y especialidad seleccionados
    $querySelectPE = "SELECT NOMBREPLANESTUDIOS, NOMBREESPECIALIDAD FROM ULISE.planesdeestudio WHERE CVEPLANESTUDIOS = '$valor1' AND CVEESPECIALIDAD = '$valor2'";
    $resultSelectPE = odbc_exec($conn, $querySelectPE);
    
    $querySelectEspecialidad = "SELECT cveespecialidad, nombreespecialidad FROM ULISE.planesdeestudio WHERE cveplanestudios = '$valor1'";
    $resultSelectEspecialidad = odbc_exec($conn, $querySelectEspecialidad);
    
    $queryExistePre = "SELECT cvemateriapre from ULISE.prerequisitos WHERE cvemateria = '$valor1' AND cveplanestudios = '$valor2' AND cveespecialidad = '$valor3'";
    $resultExistePre = odbc_exec($conn, $queryExistePre);

    // Verificar si las consultas fueron exitosas
    if ($resultTabla1 && $resultTabla2 && $resultTabla3 && $resultcredt && $resultcredp && $resulttotalcred
     && $resultcveMaterias && $resultcveEspecialidad && $resultcvePE && $resultAllData && $resultMatPreDisponible
      && $resultNomMatPreDisponible && $resultCargaMatPE && $resultAllMatPre && $resultSelectMateria && $resultSelectPE 
      && $resultSelectEspecialidad && $resultcorregir && $resultSemestrePre && $resultExistePre) 
    {
        // Obtener los datos de las consultas y irlo guardando en un array que esta en las opciones
        while ($rowTabla1 = odbc_fetch_array($resultTabla1)) {
            $opciones['tabla1'][] = $rowTabla1["NOMBREMATERIA"];
        }

        while ($rowTabla2 = odbc_fetch_array($resultTabla2)) {
            $opciones['tabla2'][] = $rowTabla2["NOMBREPLANESTUDIOS"];
        }

        while ($rowTabla3 = odbc_fetch_array($resultTabla3)) {
            $opciones['tabla3'][] = $rowTabla3["NOMBREESPECIALIDAD"];
        }

        while ($rowCredt = odbc_fetch_array($resultcredt)) {
            $opciones['credt'][] = $rowCredt["CREDT"];
        }

        while ($rowCredp = odbc_fetch_array($resultcredp)) {
            $opciones['credp'][] = $rowCredp["CREDP"];
        }

        while ($rowTotalcred = odbc_fetch_array($resulttotalcred)) {
            $opciones['totalcred'][] = $rowTotalcred["TOTALCREDITOS"];
        }

        while ($rowcveMaterias = odbc_fetch_array($resultcveMaterias)) {
            $opciones['cveMateria'][] = $rowcveMaterias["CVEMATERIA"];
        }

        while ($rowcvePE = odbc_fetch_array($resultcvePE)) {
            $opciones['cvePE'][] = $rowcvePE["CVEPLANESTUDIOS"];
        }

        while ($rowcveEspecialidad = odbc_fetch_array($resultcveEspecialidad)) {
            $opciones['cveEspecialidad'][] = $rowcveEspecialidad["CVEESPECIALIDAD"];
        }

        while ($rowAllData = odbc_fetch_array($resultAllData)) {
            $opciones['prerequisitos'][] = $rowAllData;
        }

        while ($rowMatPreDisponibles = odbc_fetch_array($resultMatPreDisponible)) {
            $opciones['matDisponiblesPre'][] = $rowMatPreDisponibles;
        }

        while ($rowNomMatPreDisponibles = odbc_fetch_array($resultNomMatPreDisponible)) {
            $opciones['nombreMatPreDisponibles'][] = $rowNomMatPreDisponibles;
        }

        while ($rowCargaMatPE = odbc_fetch_array($resultCargaMatPE)) {
            $opciones['cargaMatPE'][] = $rowCargaMatPE;
        }

        while ($rowAllMatPre = odbc_fetch_array($resultAllMatPre)) {
            $opciones['allMatPre'][] = $rowAllMatPre;
        }

        while ($rowSelectMateria = odbc_fetch_array($resultSelectMateria)) {
            $opciones['selectMateria'][] = $rowSelectMateria;
        }

        while ($rowSelectPE = odbc_fetch_array($resultSelectPE)) {
            $opciones['selectPE'][] = $rowSelectPE;
        }

        while ($rowSelectEspecialidad = odbc_fetch_array($resultSelectEspecialidad)) {
            $opciones['selectEspecialidad'][] = $rowSelectEspecialidad;
        }

        while ($rowcorregir = odbc_fetch_array($resultcorregir)) {
            $opciones['corregir'][] = $rowcorregir;
        }

        while ($rowSemestrePre = odbc_fetch_array($resultSemestrePre)) {
            $opciones['semestrePre'][] = $rowSemestrePre;
        }

        while ($rowExistePre = odbc_fetch_array($resultExistePre)) {
            $opciones['existePre'][] = $rowExistePre;
        }
    } else {
        // Manejar errores de consulta
        echo "Error en la consulta: " . odbc_errormsg($conn);
    }

    // Cerrar la conexión
    odbc_close($conn);
} else {
    // Manejar cualquier error de conexión aquí
    echo "Error de conexión con ODBC: " . odbc_errormsg();
}

// Devolver las opciones como JSON
echo json_encode($opciones);
?>