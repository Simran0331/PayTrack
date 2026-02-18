import { v4 as uuidv4 } from 'uuid';

export function makeIdempotencyKey() {
  return uuidv4();
}

export function loadPending(pendingKey) {
  const raw = localStorage.getItem(pendingKey);
  return raw ? JSON.parse(raw) : null;
}

export function savePending(pendingKey, obj) {
  localStorage.setItem(pendingKey, JSON.stringify(obj));
}

export function clearPending(pendingKey) {
  localStorage.removeItem(pendingKey);
}
