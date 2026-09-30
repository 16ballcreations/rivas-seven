# Rivas Seven — propuesta de web

Maqueta navegable de la web propuesta para **Rivas Seven** (Daniel Mauricio Rivas Ramírez),
cantautor de Medellín con raíces chocoanas. Hecha por **16 Ball Creations** como carta de
presentación para impulsar su carrera.

Se publicaría en `https://16ballcreations.github.io/rivas-seven/`.

## Concepto: «Del duelo a la luz»

Su música habla de despecho con esperanza de superar el duelo, sobre ritmo tropical urbano.
La página hace el mismo recorrido: **arranca de noche en violeta y amanece en amarillo** a medida
que se baja. El cielo es una capa fija (`.sky`) que `main.js` mueve con el scroll:

| Tramo | Secciones | Cielo | Texto |
|---|---|---|---|
| Noche | Portada, Lanzamiento, Letras | Violeta noche → uva | Crema |
| Amanecer | Dos caras → Historia | Sube el horizonte rosa, ámbar y mango; sale el sol | Pasa a violeta oscuro |
| Día | Discografía, Galería, Contrataciones | Crema | Violeta oscuro |
| Cierre | Pie | Noche sólida | Crema |

Referentes: **Lewis Hamilton** (portada de revista, tipografía enorme, disciplina) y
**Lenny Kravitz** (calor setentero, oro, grano de película). El grano es un SVG de ruido animado.

## Sistema visual

| Rol | Valor |
|---|---|
| Violeta noche | `#12081F` / `#1E1030` |
| Uva | `#5B2F8C` |
| Lila niebla | `#B9A3D9` |
| Mango (acento) | `#FFC83D` |
| Oro ámbar | `#D99A1E` |
| Crema | `#F4ECDD` |
| Verde azulado (guiño a su paleta actual) | `#2E9C92` |
| Display | Anton (mayúsculas condensadas) |
| Letras de canciones | Instrument Serif itálica |
| Texto | Manrope |

Las fotos se pasan a blanco y negro y se tiñen con un degradado violeta → mango
(`mix-blend-mode: color`), así cualquier foto casa con la paleta.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | La página completa (una sola, con anclas) |
| `assets/css/styles.css` | Estilos y tokens de color |
| `assets/js/main.js` | Amanecer con el scroll, letras palabra a palabra, video bajo demanda, menú móvil |
| `assets/img/logo-s7-original.png` | Logo sacado de un video (blanco sobre negro) |
| `docs/` | Notas de la propuesta |

Sin frameworks ni build. Lleva `noindex`. El formulario no usa servidor: abre el correo del
visitante con la solicitud armada para rivasse7en@gmail.com.

## Contenido: de dónde sale y qué falta confirmar

- **Bio y datos**: perfil de ADS Virales y su página de Beacons.
- **Canciones y videos**: feed público de su canal de YouTube (Último Estado, Iracema, Sándalo).
  «Con Too» y «No Más Dolor» vienen del perfil de ADS Virales.
- **Voz**: toda la página habla en primera persona, es él contando su historia. Los textos son
  propuesta nuestra salvo la cita de la Historia, que es suya (post de Instagram del 4 de marzo de 2024).
- **Letras** (sección Letras): transcritas del video lyric de «Último Estado». **Confirmar con él** la redacción exacta.
  Es un solo tramo fijo de 2,4 pantallas donde las tres líneas y «Desprendiéndome» se encienden palabra a palabra.
- **Fotos**: `assets/img/sesion-2024/` es su sesión nocturna en la calle, descargada del post de
  Instagram del 4 de marzo de 2024 (8 fotos, 1440 px). Va en portada (05), «Pa' llorarla» (03),
  Historia (07) y galería (01, 06, 08). El resto de la galería son fotogramas de sus videos enlazados
  desde `i.ytimg.com`. Todo se actualiza cuando llegue la sesión nueva (la guía está aparte).
- **Botón inferior** (`.next`): baja sección por sección; en el final gira y vuelve arriba.

Por confirmar antes de publicar:

- [ ] Año y enlace de «Con Too» (ft. Soniko)
- [x] Enlaces oficiales: Spotify, YouTube Music, Apple Music y Facebook (los dio él)
- [x] WhatsApp y correo de contrataciones (rivasse7en@gmail.com)
- [ ] Kit de prensa (PDF)
- [ ] Si «Iracema» y «Sándalo» van en la cara «de día» (hoy están ahí por ser afrobeat)
- [ ] Unificar su nombre en plataformas: Instagram dice «Rivas Seven», Spotify/TikTok/SoundCloud «Seven Rivas»
- [ ] Logo en vector (el PNG actual es de baja resolución y viene de un fotograma)

## Idiomas

Solo español por ahora. En cola: **portugués (Brasil)** y **inglés (EE. UU.)**. El selector
ya está en la barra (PT y EN aparecen como «próximamente»). La idea es duplicar `index.html`
en `/pt/` y `/en/` cuando el texto esté aprobado.

## Desarrollo

```bash
npx http-server . -p 8090 -c-1
```
