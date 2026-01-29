import axios from "axios";
import { toast } from "@/hooks/use-toast";

let interceptorInstalled = false;
let sessionMessageShown = false;

export function installSessionExpiryInterceptor(apiBaseUrl?: string) {
  if (interceptorInstalled) return;
  interceptorInstalled = true;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const url = error?.config?.url as string | undefined;

      const isApiCall = apiBaseUrl
        ? typeof url === "string" && url.startsWith(apiBaseUrl)
        : true;

      if (
        !sessionMessageShown &&
        isApiCall &&
        (status === 401 || status === 403)
      ) {
        sessionMessageShown = true;

        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });

        // Allow toast to render, then perform logout-like redirect.
        setTimeout(() => {
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
          } catch {
            // ignore
          }
          window.location.href = "/login";
        }, 150);
      }

      return Promise.reject(error);
    }
  );
}

