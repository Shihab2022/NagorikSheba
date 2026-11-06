import { getMe } from "@/service/auth";

let pendingRequest: ReturnType<typeof getMe> | null = null;

export function getMeDeduplicated() {
  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = getMe();

  const request = pendingRequest;

  void request.finally(() => {
    if (pendingRequest === request) {
      pendingRequest = null;
    }
  }).catch(() => {
    // The original request handles its own error.
  });

  return request;
}