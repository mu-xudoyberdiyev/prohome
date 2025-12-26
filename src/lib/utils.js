import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getFormData(form) {
  const formData = new FormData(form);
  const result = {};
  formData.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
