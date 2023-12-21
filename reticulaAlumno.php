<?php
session_start();
if (empty($_SESSION["clavea"])){
  header("location: Login/destruirSesion.php");
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="imgs/itlaguna.png" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="styles.css">
    <title>Reticula MPE</title>
</head>
<body class="bg-dark-subtle ">
    <div class="container-fluid my-3">
    <h1 class="text-center ">Reticula</h1>
    
    <form id="formulario2" class="container-fluid bg-light pb-3 rounded mt-4 mb-4">
        <div class="pt-3" id="info-carrera"></div> <!-- Mostrar la carrera y el plan de estudios seleccionados -->
    </form>

    <div id="informacion-seleccionada"></div>

    <table border="1" id="tabla" class="table table table-bordered">
        <thead class="table-light">
            <tr>
                <th>Semestre 1</th>
                <th>Semestre 2</th>
                <th>Semestre 3</th>
                <th>Semestre 4</th>
                <th>Semestre 5</th>
                <th>Semestre 6</th>
                <th>Semestre 7</th>
                <th>Semestre 8</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <button type="button" class="btn btn-secondary" onclick="regresar()">Regresar</button>
</div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/MateriasPlanesDeEstudiosDBA/Scripts/reticulaAlumno.js"></script>

</body>
</html>