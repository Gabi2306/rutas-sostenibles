// Punto de entrada: inicia cada vista y luego el enrutador.
Object.values(App.vistas).forEach((v) => v.iniciar());
App.router.iniciar();
