# Guía: cuentas, suscripción mensual y publicación en las dos tiendas

## Qué es gratis y qué es Premium (editable en `www/premium.js`, función `gate`)
- Gratis: modo Personal, resumen mensual, presupuesto, carteras, datos solo en el dispositivo.
- Premium (suscripción mensual): modo Empresa, metas de ahorro, resumen anual, exportar a Excel y sincronización en la nube entre dispositivos.

## 1. Firebase (cuentas y nube)
1. console.firebase.google.com > crear proyecto > agregar app Web.
2. Authentication > Método de acceso > activa **Correo y contraseña** (no actives Google ni Facebook: Apple te exigiría además "Iniciar sesión con Apple").
3. Firestore Database > crear base de datos > pestaña Reglas > pega el contenido de `firestore.rules` > Publicar.
4. Copia apiKey, authDomain, projectId y appId en `www/config.js`. En Authentication > Configuración > Dominios autorizados agrega tu dominio de Netlify.

## 2. Productos de suscripción en las tiendas
- **Google Play Console:** Monetizar > Productos > Suscripciones > crear (ID: `premium_mensual`) > plan base mensual con renovación automática > precio > activar. Puedes añadir prueba gratis (ej. 7 días). Para pagos necesitas el perfil de pagos configurado.
- **App Store Connect:** tu app > Suscripciones > crea un grupo > crea la suscripción mensual (mismo ID) con precio y localización en español > agrega una captura de la pantalla de suscripción para revisión. Completa acuerdos, datos bancarios e impuestos en "Acuerdos, impuestos y banca".

## 3. RevenueCat (une las dos tiendas)
1. Crea cuenta en revenuecat.com y un proyecto. Revisa sus costos actuales.
2. Agrega la app Android y la app iOS (con el `appId` de `capacitor.config.json`) y conecta las credenciales de cada tienda como te indica su asistente.
3. Importa los productos. Crea el entitlement **premium**, asócialo a ambos productos.
4. Crea un Offering "default" (actual) con un paquete mensual.
5. Copia las claves públicas (`goog_...` y `appl_...`) en `www/config.js`.

## 4. Construir y probar
1. Sube `www` a Netlify y escribe esa URL en `site` de `config.js`. Completa [FECHA] y [TU CORREO] en `privacy.html` y `terms.html`.
2. `npm install`, `npx cap add android`, `npx cap add ios`, `npx cap sync`.
3. Prueba en el navegador con `devUnlock:true` (solo para ver las pantallas). Las compras solo se prueban en celular real: en Android con "testers de licencia" (Play Console > Configuración > Pruebas de licencia) y en iPhone con una cuenta Sandbox (App Store Connect > Usuarios y acceso).
4. Prueba: crear cuenta, comprar, cerrar sesión y entrar en otro dispositivo, restaurar compras, eliminar cuenta.

## 5. Publicar
- Sigue los pasos de `README.md` (Play: prueba cerrada de 12 testers por 14 días si tu cuenta es personal nueva).
- Apple: en las notas de revisión incluye un usuario de prueba y explica cómo llegar a la pantalla de suscripción. La app ya incluye lo que Apple pide para suscripciones: precio y condiciones visibles, "Restaurar compras", enlaces a términos y privacidad, y eliminar cuenta dentro de la app.
- En ambas fichas pega los enlaces de `privacy.html` y `terms.html`. En el formulario de seguridad de datos declara correo, identificador de usuario y datos financieros (en la nube, solo con cuenta Premium).
- Comisión: Google indica 15% en suscripciones de renovación automática, y Apple suele aplicar 15% si te inscribes en su Small Business Program. Verifica ambas cifras en tus consolas.

## Límites de esta versión (importante)
- No se probó con tus credenciales ni en tiendas. Es un punto de partida; espera ajustes al conectar RevenueCat y Firebase.
- Las funciones Premium se bloquean desde la app y se cachean en el dispositivo: sirve para un lanzamiento inicial, pero un usuario avanzado podría saltarse el bloqueo. La nube sí queda protegida por reglas.
- Los datos se guardan como un solo documento por usuario (máximo 1 MB en Firestore). Para usuarios con miles de movimientos habría que guardar cada movimiento por separado.
- Si alguien usó la app en dos dispositivos antes de suscribirse, al sincronizar gana el cambio más reciente.
- Firebase y RevenueCat se cargan/usan en línea; sin internet la app funciona con los datos locales.
- Si `Capacitor.Plugins.Purchases` no responde en tu build, hay que empaquetar el plugin con un bundler (Vite): un desarrollador lo resuelve en pocas horas.
