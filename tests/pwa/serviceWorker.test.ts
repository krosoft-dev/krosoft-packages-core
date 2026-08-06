import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reloadOnServiceWorkerUpdate } from "../../src/pwa/serviceWorker";

type Listener = () => void;

interface ServiceWorkerStub {
  /** Simule la prise de contrôle par un nouveau service worker. */
  triggerControllerChange: () => void;
  listenerCount: () => number;
}

/** Service worker minimal : jsdom n'implémente pas navigator.serviceWorker. */
const stubServiceWorker = (controller: object | null): ServiceWorkerStub => {
  const listeners = new Set<Listener>();

  const container = {
    controller,
    addEventListener: (_type: string, listener: Listener): void => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: Listener): void => {
      listeners.delete(listener);
    },
  };

  Object.defineProperty(navigator, "serviceWorker", { value: container, configurable: true, writable: true });

  return {
    triggerControllerChange: () => {
      listeners.forEach(listener => {
        listener();
      });
    },
    listenerCount: () => listeners.size,
  };
};

const reload = vi.fn();

beforeEach(() => {
  reload.mockClear();
  Object.defineProperty(window, "location", { value: { reload }, configurable: true, writable: true });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, "serviceWorker");
});

describe("reloadOnServiceWorkerUpdate", () => {
  it("recharge quand un nouveau service worker prend le contrôle", () => {
    const sw = stubServiceWorker({});

    reloadOnServiceWorkerUpdate();
    sw.triggerControllerChange();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  // Sans contrôleur au chargement, l'activation initiale ne doit rien déclencher.
  it("ignore la première activation du service worker", () => {
    const sw = stubServiceWorker(null);

    reloadOnServiceWorkerUpdate();
    sw.triggerControllerChange();

    expect(reload).not.toHaveBeenCalled();
  });

  it("ne recharge qu'une fois même sur plusieurs changements", () => {
    const sw = stubServiceWorker({});

    reloadOnServiceWorkerUpdate();
    sw.triggerControllerChange();
    sw.triggerControllerChange();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("cesse d'écouter après appel de la fonction retournée", () => {
    const sw = stubServiceWorker({});

    const stop = reloadOnServiceWorkerUpdate();
    stop();
    sw.triggerControllerChange();

    expect(sw.listenerCount()).toBe(0);
    expect(reload).not.toHaveBeenCalled();
  });

  it("ne fait rien quand les service workers sont indisponibles", () => {
    expect(() => {
      reloadOnServiceWorkerUpdate()();
    }).not.toThrow();
    expect(reload).not.toHaveBeenCalled();
  });
});
