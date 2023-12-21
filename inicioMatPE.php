<?php
session_start();
if (empty($_SESSION["clavep"])){
  header("location: Login/destruirSesion.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="imgs/itlaguna.png" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="styles.css">
    <title>Seleccion De Inicio</title>
</head>
<body>
  <nav class="navbar navbar-expand-lg nav-underline bg-dark px-2 ">
    <div class="container-fluid">
    <i class="navbar-brand text-warning bi bi-clipboard-data-fill icono-nav"></i>
      <a class="navbar-brand text-warning" href="inicioMatPE.php">Bienvenid@ <?php echo $_SESSION["nombres"]. " ". $_SESSION["apellidoPpaterno"]. " ". $_SESSION["apellidoPmaterno"];?>!</a>
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

    <div class="container my-3">
    <h1>Selecciona el modulo a donde quieres entrar</h1>

        <div class="card-group">
            <div class="card">
              <img src="imgs/mat.jpg" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Materias</h5>
                <p class="card-text">Agrega, modifica y elimina las materias que necesites, en conjunto de su nombre y creditos.</p>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary"><a href="Materias.html" class="btn btn-success"><i class="bi bi-arrow-up-circle-fill"> Entra</i></a></small>
              </div>
            </div>
            <div class="card">
              <img src="imgs/pe.jpg" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Planes de estudios</h5>
                <p class="card-text">Agrega, modifica y elimina los plan de estudios y especialidad que necesites, incluso creando una nueva especialidad en un plan de estudios ya existente.</p>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary"><a href="PlanesDeEstudios.html" class="btn btn-success"><i class="bi bi-arrow-up-circle-fill"> Entra</i></a></small>
              </div>
            </div>
            <div class="card">
              <img src="imgs/reticula.png" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Reticulas</h5>
                <p class="card-text">Ve armando reticulas del respectivo plan de estudios que requieres con las materias que necesites ubicadas en el semestre que le indiques, asi como poder agregar o eliminar prerequisitos de cada una de ellas en caos de ser necesario.</p>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary"><a href="selectPE.html" class="btn btn-success"><i class="bi bi-arrow-up-circle-fill"> Entra</i></a></small>
              </div>
            </div>
          </div>
        </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</body>
</html>