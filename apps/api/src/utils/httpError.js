export function httpError(status, message, details = []) {
  return { status, message, details };
}
