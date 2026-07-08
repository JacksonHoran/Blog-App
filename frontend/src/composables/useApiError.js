export function useApiError() {
  const getErrorMessage = (error, context = "request") => {
    if (!error.response) {
      return "Network error — please check your connection and try again.";
    }
    const status = error.response.status;
    if (status === 422) {
      // Surface the backend's field-level messages (e.g. "An article with
      // this title already exists.") instead of a generic line.
      const fieldErrors = error.response.data?.errors;
      if (fieldErrors && typeof fieldErrors === "object") {
        const details = Object.values(fieldErrors)
          .flatMap((rules) => Object.values(rules))
          .join(" ");
        if (details) return details;
      }
    }
    const messages = {
      400: "Bad request — the server could not understand the request.",
      401: "You are not authenticated. Please log in and try again.",
      403: "You do not have permission to perform this action.",
      404: `The requested ${context} could not be found.`,
      408: "The request timed out. Please try again.",
      409: "There was a conflict with the current state of the resource.",
      422: "The server could not process the request due to invalid data.",
      429: "Too many requests — please wait a moment and try again.",
      500: "An internal server error occurred. Please try again later.",
      502: "Bad gateway — the server received an invalid response.",
      503: "The service is temporarily unavailable. Please try again later.",
      504: "The server timed out. Please try again later.",
    };
    return messages[status] ?? `Unexpected error (${status}). Please try again.`;
  };

  return { getErrorMessage };
}