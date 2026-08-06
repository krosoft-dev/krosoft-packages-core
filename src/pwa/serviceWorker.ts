/**
 * Recharge la page dès qu'un nouveau service worker prend le contrôle, pour
 * qu'un déploiement soit visible sans action de l'utilisateur.
 *
 * À appeler une fois au démarrage de l'application :
 *
 * ```ts
 * import { reloadOnServiceWorkerUpdate } from "@krosoft/core/pwa";
 *
 * reloadOnServiceWorkerUpdate();
 * ```
 *
 * Le tout premier chargement est ignoré volontairement : sans service worker
 * contrôleur, l'activation initiale déclenche elle aussi `controllerchange`
 * (`skipWaiting` + `clientsClaim`, le comportement de vite-plugin-pwa en
 * `registerType: "autoUpdate"`) et rechargerait la page sans nouvelle version.
 *
 * No-op si les service workers ne sont pas disponibles — rendu serveur inclus.
 *
 * @returns une fonction pour cesser d'écouter.
 */
export function reloadOnServiceWorkerUpdate(): () => void {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return () => undefined;
  }

  const hadController = navigator.serviceWorker.controller !== null;
  let refreshing = false;

  const onControllerChange = (): void => {
    if (!hadController || refreshing) {
      return;
    }

    refreshing = true;
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

  return () => {
    navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  };
}
