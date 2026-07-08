// Warm cache for GET requests initiated by v-prefetch.
//
// A hovered link warms the response here; the destination view consumes it
// once via cachedGet() and the entry is dropped, so after first render the
// view owns freshness again. Entries expire after TTL_MS, and any successful
// non-GET request (create/edit/delete/login/logout) clears the whole cache so
// a warmed response can never resurrect pre-mutation data.

import api from "./api";

const TTL_MS = 30_000;
const warm = new Map(); // url -> { promise, expires }

api.interceptors.response.use((response) => {
  const method = response.config.method?.toLowerCase();
  if (method && method !== "get") warm.clear();
  return response;
});

// Called by the directive: start the request now so it's in flight (or done)
// before the user clicks. Repeat hovers within the TTL reuse the same promise.
export const prefetchGet = (url) => {
  const hit = warm.get(url);
  if (hit && hit.expires > Date.now()) return hit.promise;
  const promise = api.get(url);
  warm.set(url, { promise, expires: Date.now() + TTL_MS });
  // A failed warm-up must not poison the view's real request later.
  promise.catch(() => warm.delete(url));
  return promise;
};

// Called by views in place of api.get(): consumes a warmed response if one
// is fresh, otherwise falls through to a normal request.
export const cachedGet = (url) => {
  const hit = warm.get(url);
  if (hit && hit.expires > Date.now()) {
    warm.delete(url);
    return hit.promise;
  }
  return api.get(url);
};
