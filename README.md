# SyncHilas Ambilight

Efecto Ambilight (brillo alrededor del video) para los videos que se reproducen en
[sync.hilas.cl](https://sync.hilas.cl): YouTube, Twitch o cualquier reproductor en iframe.
No necesita compartir pestaña ni dar permisos de pantalla.

## Instalación (Chrome, Edge, Brave)

1. Descarga el zip de la [última release](../../releases/latest) y descomprímelo.
2. Abre `chrome://extensions` y activa **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y elige la carpeta descomprimida.
4. En sync.hilas.cl, recarga con Ctrl+F5. En Ajustes (engranaje) activa **Ambilight: ON**;
   debe decir "extensión: detectada".

Chrome mostrará un aviso por extensión en modo desarrollador al abrir el navegador. Es normal
porque no está publicada en la Chrome Web Store.

## Cómo funciona

El script se ejecuta dentro del iframe del video, solo cuando la página padre es
`https://sync.hilas.cl`. Lee el `<video>` más grande, lo reduce a 96×54 píxeles y manda esos
píxeles a la página con `postMessage`, que pinta el brillo. Solo envía fotogramas mientras el
Ambilight está activado en la página.

## Publicar una nueva versión

```bash
git tag v1.1 && git push origin v1.1
```

El workflow crea el release con el zip adjunto.
