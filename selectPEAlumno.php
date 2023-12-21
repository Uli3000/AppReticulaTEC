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
    <title>Seleccion de PE</title>
</head>
<body class="bg-dark-subtle bg-gradient"> 
    <nav class="navbar navbar-expand-lg nav-underline bg-dark px-2 ">
        <div class="container-fluid">
        <i class="navbar-brand text-warning bi bi-clipboard-data-fill icono-nav" ></i>
          <a class="navbar-brand text-warning" href="inicioMatPE.php">Bienvenid@ <?php echo $_SESSION["nombresA"]. " ". $_SESSION["apellidoApaterno"]. " ". $_SESSION["apellidoAmaterno"];?>!</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse mx-auto" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link text-light" href="Login/destruirSesion.php">Cerrar sesion</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    

    <form id="formulario1" class="container bg-light pb-3 rounded mt-4 mb-4">
      <h1 class="pt-3">Elige en donde quieres crear una reticula:</h1>
        
        <div class="row d-flex align-items-center">
          <div class="col-md-3 ">
            <label for="comboPE">Selecciona el plan de estudios:</label>
          </div>
          <div class="col-md-9">
            <select name="comboPE" id="comboPE" class="form-select mb-2"></select>
          </div>
          </div>

          <div class="row d-flex align-items-center">
            <div class="col-md-3 ">
              <label for="comboEspecialidad" id="comboEspecialidad">Selecciona la especialidad:</label>
            </div>
            <div class="col-md-9">
              <select name="comboEspecialidad" class="form-select mb-2"></select>
            </div>
            </div>

        <div class="d-grid gap-2 col-4 mx-auto">
          <button id="botonDisabled" class="btn btn-warning mx-auto" disabled type="button" onclick="guardarSeleccion()">Guardar Selección</button>
        </div>

    </form>
    <!--
    <button onclick="window.location.href = 'inicioMatPE.html'">Regresar</button>
    -->
    <script src="/MateriasPlanesDeEstudiosDBA/Scripts/selectPEReticulaAlumno.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</body>
</html>