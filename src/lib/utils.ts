import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // Browser uses relative
  return "http://localhost:3000"; // Production should use an Env Var
};

function axiosErrorHandler(error: unknown) {
  if (isAxiosError(error)) {
    return (
      error.response?.data ||
      error.response?.data.message ||
      error.message ||
      error
    );
  }
  return "An unexpected error!";
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

export default axiosErrorHandler;
