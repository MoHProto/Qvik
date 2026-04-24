export function formatErrorMessage(
  error: unknown,
  fallback: string = "An unknown error occurred",
): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim();
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message).trim();
  }
  if (typeof error === "string") {
    return error;
  }
  return fallback.trim();
}
