# Campuslands · Calendario editorial

[Abrir calendario](https://anndreloopez012.github.io/campuslands-calendario-editorial/) · [Repositorio](https://github.com/anndreloopez012/campuslands-calendario-editorial)

Calendario interactivo del **29 de octubre al 27 de noviembre de 2026**. Contiene 150 fichas: 30 para LinkedIn, 90 para Instagram y 30 para TikTok. Cada ficha incluye gancho, secuencia, CTA, audiencia, objetivo y dirección de producción.

## Estructura

```text
src/
  template.html       Estructura y textos de la interfaz
  styles.css          Diseño adaptable a escritorio y móvil
  app.js              Filtros, fichas y seguimiento
data/
  campaign.json       Fuente de las 150 publicaciones y sus IDs
scripts/
  build.cjs           Generación y validación sin dependencias
docs/
  index.html          Web autónoma publicada por GitHub Pages
  .nojekyll           Publicación directa de HTML
.github/workflows/
  validate.yml        Comprobación de fuentes y calendario en ambas ramas
```

## Desarrollo

Requiere Node.js 22 o superior. No necesita instalar paquetes.

```sh
git switch dev
git pull --ff-only origin dev
# Edita src/ o data/campaign.json
npm run build
npm test
```

Abre `docs/index.html` en el navegador para revisar la web. El archivo incluye datos, CSS y JavaScript y funciona sin servidor.

Guarda los cambios y sube `dev`. Cuando la revisión esté completa, incorpora `dev` a `main`:

```sh
git add src data scripts docs .github package.json README.md .gitignore .gitattributes
git commit -m "Actualiza calendario editorial"
git push origin dev
git switch main
git pull --ff-only origin main
git merge --ff-only dev
git push origin main
git switch dev
git merge --ff-only main
git push origin dev
```

Si una integración `--ff-only` se detiene por cambios paralelos, revisa la divergencia antes de integrar; no fuerces ni sobrescribas ramas. También puedes utilizar un pull request de `dev` a `main` y sincronizar `dev` después de fusionarlo.

## Publicación

GitHub Pages publica desde **`main` → `/docs`**. Cada push a `main` que cambie la web actualiza el sitio. `dev` conserva el trabajo en desarrollo y no cambia la página publicada. La validación automática comprueba ambas ramas.

Los archivos de `docs/` se generan con `npm run build`; edita las fuentes, no el HTML compilado. `npm test` detecta fechas fuera del plan, IDs/títulos/ganchos duplicados, una distribución diaria incorrecta, errores de sintaxis y diferencias entre fuentes y web generada.

## Seguimiento del contenido

Filtra por red, columna, formato o estado; busca un tema y abre una tarjeta. Los estados son Planificado, En producción, Para revisar, Listo y Publicado. Puedes guardar notas y exportar/importar un respaldo del avance.

**Los estados y notas son locales a cada navegador.** GitHub sincroniza el código y las ideas del calendario; no sincroniza los cambios de seguimiento entre personas o dispositivos. Para trasladar el avance desde el HTML local al sitio web, expórtalo en el primero e impórtalo en el segundo. No subas respaldos de notas internas al repositorio público.

El plan está disponible públicamente mediante GitHub Pages. No incluye credenciales, información personal de estudiantes ni los respaldos de avance del navegador. Las fichas planifican contenido: la producción y publicación de imágenes y videos se registra por separado.

La serie de LinkedIn utiliza la [historia oficial de Campuslands](https://www.campuslands.pro/historia/); las fichas distinguen hechos históricos de reflexiones y ejercicios editoriales.
