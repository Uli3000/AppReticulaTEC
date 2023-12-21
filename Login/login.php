<?php
// Parámetros de conexión
$dsn = 'DRIVER={IBM DB2 ODBC DRIVER};DATABASE=PROBANDO;HOSTNAME=localhost;PORT=25000;PROTOCOL=TCPIP;CCSID=1208;';
$user = 'db2admin';
$password = 'ball2209';

// Intentar establecer la conexión
$conexion = odbc_connect($dsn, $user, $password);
session_start();

if(!empty($_POST["iniciaDocente"])){
    if(!empty($_POST["cveDocente"]) and !empty($_POST["contraDocente"])){
        $usuario=$_POST["cveDocente"];
        $password=$_POST["contraDocente"];
        $sql = odbc_exec($conexion, "SELECT * FROM ULISE.personal WHERE cvepersonal = '$usuario' AND contrasena = '$password'");
        if (odbc_fetch_array($sql)){
            $_SESSION["clavep"] = odbc_result($sql, 'cvepersonal');
            $_SESSION["nombres"] = odbc_result($sql, 'nombre');
            $_SESSION["apellidoPpaterno"] = odbc_result($sql, 'ApellidoPPaterno');
            $_SESSION["apellidoPmaterno"] = odbc_result($sql, 'ApellidoPMaterno');
            header("location: ../inicioMatPE.php");
        }else{
            echo '<div style="background-color: rgba(55, 55, 55, 0.1); color:#f33; padding: 10px; text-align: center; font-weight: bold; border-radius:3%;">
                    Su usuario y/o contraseña no son correctas.
                  </div>';
        }

    }else{
        echo '<div style="background-color: rgba(55, 55, 55, 0.1); color:#f33; padding: 10px; text-align: center; font-weight: bold; border-radius:3%;">
                Los campos estan vacios.
              </div>';
    }
}else if(!empty($_POST["iniciaAlumno"])){
    if(!empty($_POST["cveAlumno"]) and !empty($_POST["contraAlumno"])){
        $usuario=$_POST["cveAlumno"];
        $password=$_POST["contraAlumno"];
        $sql = odbc_exec($conexion, "SELECT * FROM ULISE.alumnos WHERE nocontrol = '$usuario' AND contrasena = '$password'");
        if (odbc_fetch_array($sql)){
            $_SESSION["clavea"] = odbc_result($sql, 'nocontrol');
            $_SESSION["nombresA"] = odbc_result($sql, 'nombres');
            $_SESSION["apellidoApaterno"] = odbc_result($sql, 'ApellidoAPaterno');
            $_SESSION["apellidoAmaterno"] = odbc_result($sql, 'ApellidoAMaterno');
            header("location: ../selectPEAlumno.php");
        }else{
            echo '<div style="background-color: rgba(55, 55, 55, 0.1); color:#f33; padding: 10px; text-align: center; font-weight: bold; border-radius:3%;">
                    Su usuario y/o contraseña no son correctas.
                  </div>';
        }

    }else{
        echo '<div style="background-color: rgba(55, 55, 55, 0.1); color:#f33; padding: 10px; text-align: center; font-weight: bold; border-radius:3%;">
                Los campos estan vacios.
              </div>';
    }
}

odbc_close($conexion);

?>