export function getSafeErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    return error.message;
  }
  return fallback;
}
