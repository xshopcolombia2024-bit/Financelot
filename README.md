# Instalar Financelot en tu celular (APK)

IMPORTANTE: esta versión trae `devUnlock:true` en `www/config.js`, así que TODAS las funciones (Personal y Empresa) están activas sin pagar. Antes de publicar en Play Store o App Store, cámbialo a `false`.

## Opción 1: instalarla ya, sin APK (3 minutos)
1. Entra a https://app.netlify.com/drop y arrastra la carpeta `www` (o el archivo `financelot-web.zip` descomprimido).
2. Abre el enlace que te da en Chrome del celular Android (o Safari en iPhone).
3. Android: menú de los tres puntos > "Instalar app". iPhone: botón Compartir > "Agregar a pantalla de inicio".
Queda con el ícono de Financelot y funciona sin internet.

## Opción 2: archivo APK real (Android), gratis con GitHub
1. Crea una cuenta en github.com y un repositorio nuevo (privado está bien).
2. Instala GitHub Desktop, agrega esta carpeta completa como repositorio y pulsa "Publish repository". (La web de GitHub solo deja subir 100 archivos por vez.)
3. En GitHub entra a la pestaña Actions > "Crear APK de Financelot" > Run workflow. Tarda unos minutos.
4. Cuando termine, abre la ejecución y descarga el artefacto `financelot-apk` (un zip con `app-debug.apk`).
5. Pasa el APK al celular, ábrelo y permite "instalar apps de fuentes desconocidas" si te lo pide.

## Opción 3: Android Studio en tu computador
`npm install`, `npx cap sync android`, `npx cap open android` y Build > Build APK(s).

Un APK solo funciona en Android. En iPhone se usa la Opción 1 o la App Store.

# Financelot: paquete para Play Store y App Store

Ya incluye los proyectos nativos generados (`android/` e `ios/`) con tu ícono, pantalla de inicio, nombre, plugins de compras (RevenueCat), exportar/compartir y la app en `www/`. NO incluye los archivos finales firmados (AAB / IPA): esos solo se pueden crear en tu computador con tus llaves y cuentas.

## Antes de compilar (una sola vez)
1. Edita `www/config.js` (Firebase, RevenueCat, URL de tu sitio) siguiendo `GUIA-SUSCRIPCION.md`.
2. Edita [FECHA] y [TU CORREO] en `www/privacy.html` y `www/terms.html` y publica `www` en Netlify.
3. Elige tu identificador definitivo (ej. com.tunombre.financeapp) y cámbialo en: `capacitor.config.json`, `android/app/build.gradle` (namespace y applicationId) y en Xcode (Bundle Identifier). Debe ser el mismo en ambos y en las tiendas. No cambia después de publicar.
4. `npm install` y luego `npx cap sync`.

## Android (Play Store)
1. Instala Android Studio. `npx cap open android` y espera a que sincronice.
2. Build > Generate Signed App Bundle / APK > Android App Bundle. Crea tu llave (keystore) y guárdala con copia de seguridad. Recomendado: activa Play App Signing en Play Console.
3. Resultado: `android/app/release/app-release.aab`. Súbelo en Play Console > Pruebas > Prueba interna (o Cerrada) y completa la ficha con `textos-tiendas.md`.
4. En cada versión nueva sube `versionCode` en `android/app/build.gradle`.

## iPhone (App Store) — requiere Mac
1. Mac con Xcode y Apple Developer Program. `npx cap sync ios` y `npx cap open ios`.
2. En el proyecto App: Signing & Capabilities > elige tu Team y el Bundle Identifier; agrega la capacidad **In-App Purchase**.
3. Arrastra `ios/App/App/PrivacyInfo.xcprivacy` al target App si no aparece en el proyecto (manifiesto de privacidad que Apple exige). Revisa con Product > Archive > Generate Privacy Report.
4. Product > Archive > Distribute App > App Store Connect. Prueba con TestFlight y luego envía a revisión con las notas de `textos-tiendas.md`.

## Pruebas obligatorias antes de enviar
Instalar en un celular real: crear cuenta, comprar (testers de licencia en Google / Sandbox en Apple), cerrar sesión y entrar en otro dispositivo, restaurar compras, eliminar cuenta, exportar a Excel, modo sin internet, modo oscuro.

## Informe Excel
`www/xl.js` y `www/jszip.min.js` generan el libro .xlsx con gráficos dentro de la app (sin internet). No los borres.

## Pendiente conocido
- No se compiló aquí (sin Android SDK ni Mac): pueden salir errores de compilación o de versiones que se corrigen en Android Studio / Xcode.
- Apple puede pedir más funciones nativas (por ejemplo recordatorios) por la guía 4.2.
- El bloqueo Premium es solo del lado de la app; la nube sí está protegida por reglas.
