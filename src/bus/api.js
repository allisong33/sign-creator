// src/bus/api.js
// MBTA V3 API helpers for bus routes and stops.
// TODO (Phase 10): Move API_KEY to a Vercel serverless proxy so the key is not exposed in client code.
const API_KEY = '409410997f034955a35c39ab526beaec';
const BASE_URL = 'https://api-v3.mbta.com';

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'x-api-key': API_KEY },
  });
  if (!res.ok) throw new Error(`MBTA API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchBusRoutes() {
  const data = await apiFetch('/routes?filter[type]=3&fields[route]=short_name,long_name,description');
  return data.data.map(r => ({
    id: r.id,
    shortName: r.attributes.short_name,
    longName: r.attributes.long_name,
    isFrequent: r.attributes.description === 'Frequent Bus',
  }));
}

export async function fetchStopsForRoute(routeId) {
  const data = await apiFetch(`/stops?filter[route]=${encodeURIComponent(routeId)}&fields[stop]=name`);
  return data.data.map(s => ({
    id: s.id,
    name: s.attributes.name,
  }));
}
