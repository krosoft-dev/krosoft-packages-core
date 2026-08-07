import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // jsdom est opt-in par fichier via `@vitest-environment` : un seul test en a besoin,
    // et son initialisation domine largement le temps d'exécution de la suite.
    environment: "node",
  },
});
