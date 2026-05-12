// src/train/api.js
// MBTA V3 API helpers for train station facilities (elevator/escalator).
const API_KEY  = '409410997f034955a35c39ab526beaec';
const BASE_URL = 'https://api-v3.mbta.com';

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'x-api-key': API_KEY } });
  if (!res.ok) throw new Error(`MBTA API ${res.status}`);
  return res.json();
}

/**
 * Fetch elevator and escalator facilities for a station's place-ID.
 * Each returned item: { id, type ('ELEVATOR'|'ESCALATOR'), name, status }
 * status values include 'OPERATIONAL', 'CURRENT_ALERTS', 'NOT_IN_SERVICE', or '' if unknown.
 */
export async function fetchStationFacilities(placeId) {
  const data = await apiFetch(
    `/facilities?filter[stop]=${encodeURIComponent(placeId)}` +
    `&filter[type]=ELEVATOR,ESCALATOR` +
    `&fields[facility]=type,short_name,long_name,properties`
  );
  return data.data.map(f => {
    const props      = f.attributes.properties || [];
    const statusProp = props.find(p => p.name === 'operating_status');
    return {
      id:     f.id,
      type:   f.attributes.type,
      name:   f.attributes.short_name || f.attributes.long_name || f.id,
      status: statusProp ? statusProp.value : '',
    };
  });
}
