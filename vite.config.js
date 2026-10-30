import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// En GitHub Pages los repositorios normales se publican bajo /nombre-repositorio/.
// Las webs <usuario>.github.io se sirven directamente desde /.
// Si la build se hace localmente o desde un despliegue manual, usamos rutas relativas
// para evitar que los assets falleen cuando la web no vive en la raíz del dominio.
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").pop() ?? "";
const isUserPage = repositoryName.endsWith(".github.io");
const base =
  process.env.GITHUB_PAGES === "true" && repositoryName && !isUserPage
    ? `/${repositoryName}/`
    : "./";

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        preparacion: resolve(__dirname, "docs/preparacion.html"),
      },
    },
  },
});

