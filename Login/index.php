<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ITL - Session de Inicio</title>
    <link rel="icon" href="../imgs/itlaguna.png" type="image/x-icon">
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    
</head>
<body>
    <div class="container register">
        <div class="information">
            <div class="info_child">
                <h2>Bienvenidos</h2>
                <?php
               include 'login.php';
               ?>
                <p>
                    ¡Bienvenidos, maestros! En esta sección, podrán cambiar su login de alumno a maestro. Facilitamos su
                    transición para potenciar su experiencia educativa.
                </p>
               
                        <button id="btnSignIn" type="button">Iniciar como docente</button> 

                        <i class="fa-solid fa-person-chalkboard icon"></i>
            </div>
        </div>
        <div class="form_information">
            <div class="form_information_child">
                <img id="logo" src="asset/logo.png" alt="logo">
                <h2>Login alumnos ITL</h2>
                <p>¡Listos para aprender, crecer y alcanzar el éxito! Bienvenidos, queridos alumnos. Ingresa y descubre
                    un mundo de conocimiento y oportunidades.</p>
                <form method="post">
                    <fieldset class="campo_login">
                        <label class="label_titulo" for="user">User</label>
                        <div class="icono_input">
                            <i class="fa-solid fa-user icono"></i>
                            <input class="input" type="text" placeholder="Escribe tu usuario" name="cveAlumno">
                        </div>
                    </fieldset>
                    <fieldset class="campo_login">
                        <label class="label_titulo" for="password">Password</label>
                        <div class="icono_input">
                            <i class="fa-solid fa-lock icono"></i>
                            <input class="input" type="password" placeholder="Contraseña" name="contraAlumno">
                        </div>
                    </fieldset>
                    <input id="inicio" type="submit" value="Iniciar Sesión" name="iniciaAlumno">
                </form>
            </div>
        </div>
    </div>
    <div class="container hide login">
        <div class="information">
            <div class="info_child">
                <h2>Cambiaste</h2>
                <p>
                    ¡¡Hola, estudiantes! Aquí pueden transformar su acceso, pasando de estudiante a usuario. Simplificamos el proceso para enriquecer su experiencia de aprendizaje.
                </p>
                
                        <button id="btnSignUp" type="button">Iniciar como alumno</button>
                 <i class="fa-solid fa-chalkboard-user icon"></i>
            </div>
        </div>
        <div class="form_information">
            <div class="form_information_child">
                <img id="logo" src="asset/logo.png" alt="logo">
                <h2>Login docentes ITL</h2>
                <p>¡Saludos a nuestros dedicados docentes! Su labor es fundamental. Bienvenidos a la plataforma que facilita su enseñanza y fomenta el aprendizaje.</p>
                <form method="post">
                    <fieldset class="campo_login">
                        <label class="label_titulo" for="user">User</label>
                        <div class="icono_input">
                            <i class="fa-solid fa-user icono"></i>
                            <input class="input" type="text" placeholder="Escribe tu usuario" name="cveDocente">
                        </div>
                    </fieldset>
                    <fieldset class="campo_login">
                        <label class="label_titulo" for="password">Password</label>
                        <div class="icono_input">
                            <i class="fa-solid fa-lock icono"></i>
                            <input class="input" type="password" placeholder="Contraseña" name="contraDocente">
                        </div>
                    </fieldset>
                    <input id="inicio" type="submit" value="Iniciar Sesión" name="iniciaDocente">
                </form>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
