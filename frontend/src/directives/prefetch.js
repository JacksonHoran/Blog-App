// v-prefetch — warms a route's lazy-loaded components when the user shows
// intent to navigate (hover, keyboard focus, or first touch), so the actual
// navigation renders instantly.
//
// Usage:
//   <router-link to="/articles" v-prefetch>              reads the rendered href at hover time
//   <router-link ... v-prefetch="'add-article'">         route name or path string
//   <a v-prefetch="{ name: 'edit-article', params }">    any location router.resolve() accepts
//   <button v-prefetch="() => import('@/views/X.vue')">  custom loader
//
// Besides the code chunk, the directive also warms the route's DATA when the
// route declares it, e.g. in router/index.js:
//   meta: { prefetch: (to) => [`/articles/view/${to.params.id}.json`] }
// The returned URLs are fetched into prefetchCache; the view picks them up by
// calling cachedGet(url) instead of api.get(url).
//
// Production notes:
// - SSR: directives don't run on the server; add `getSSRProps: () => ({})` there.
// - Non-root router base: strip router.options.history.base from the href before
//   resolving, or pass explicit values instead of the bare form (base is "/" here).

import router from "@/router";
import { prefetchGet } from "@/services/prefetchCache";

const HOVER_INTENT_MS = 5;
const START_EVENTS = ["mouseenter", "focus"];
const CANCEL_EVENTS = ["mouseleave", "blur"];

const STATE = Symbol("prefetch");

// Keyed by loader function, not path: /articles/1 and /articles/2 share one
// chunk, and this stays correct after the router swaps a resolved loader out.
const prefetched = new WeakSet();

const connectionIsConstrained = () => {
  const conn = navigator.connection;
  return Boolean(conn && (conn.saveData || /2g/.test(conn.effectiveType ?? "")));
};

// router.resolve() treats a bare string as a path, so a route NAME like
// "add-article" must be wrapped in { name } to resolve.
const asLocation = (target) =>
  typeof target === "string" && router.hasRoute(target) ? { name: target } : target;

const fireLoader = (loader, label) => {
  if (prefetched.has(loader)) return;
  prefetched.add(loader);
  // Demo breadcrumb — remove for production.
  console.info("[v-prefetch] prefetching", label);
  Promise.resolve(loader()).catch(() => {
    // Allow a retry later; the router also re-attempts on real navigation.
    prefetched.delete(loader);
  });
};

const trigger = (el) => {
  if (connectionIsConstrained()) return;

  const value = el[STATE]?.binding.value;
  const target = value ?? el.getAttribute("href");
  if (target == null) return;

  if (typeof target === "function") {
    fireLoader(target, "(custom loader)");
    return;
  }

  let resolved;
  try {
    resolved = router.resolve(asLocation(target));
  } catch (error) {
    console.warn("[v-prefetch] could not resolve target:", target, error);
    return;
  }
  if (!resolved.matched.length) {
    console.warn("[v-prefetch] no route matched target:", target);
    return;
  }

  // Warm the code chunks. Lazy route components are still plain functions
  // until the router first resolves them, after which the record holds the
  // component object instead — nothing left to fetch then.
  resolved.matched
    .flatMap((record) => Object.values(record.components ?? {}))
    .filter((component) => typeof component === "function")
    .forEach((loader) => fireLoader(loader, target));

  // Warm the data the route declares. Runs on every distinct target even
  // when the chunk is already cached — /articles/3 and /articles/5 share a
  // component but not a response.
  for (const record of resolved.matched) {
    for (const url of record.meta.prefetch?.(resolved) ?? []) {
      prefetchGet(url);
    }
  }
};

export default {
  mounted(el, binding) {
    const state = { binding, timer: null };
    state.start = () => {
      state.timer = setTimeout(() => trigger(el), HOVER_INTENT_MS);
    };
    state.cancel = () => clearTimeout(state.timer);
    // No hover-intent delay on touch: there is no "leave" before the tap lands.
    state.touch = () => trigger(el);

    for (const event of START_EVENTS) el.addEventListener(event, state.start, { passive: true });
    for (const event of CANCEL_EVENTS) el.addEventListener(event, state.cancel, { passive: true });
    el.addEventListener("touchstart", state.touch, { passive: true });

    el[STATE] = state;
  },
  updated(el, binding) {
    if (el[STATE]) el[STATE].binding = binding;
  },
  unmounted(el) {
    const state = el[STATE];
    if (!state) return;
    clearTimeout(state.timer);
    for (const event of START_EVENTS) el.removeEventListener(event, state.start);
    for (const event of CANCEL_EVENTS) el.removeEventListener(event, state.cancel);
    el.removeEventListener("touchstart", state.touch);
    delete el[STATE];
  },
};
