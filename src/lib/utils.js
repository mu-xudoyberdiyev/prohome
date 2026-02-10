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

export function formatNumber(num) {
  const cleaned = num?.toString().replace(/^0+(?=\d)/, "");

  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatNumberWithPercent(num) {
  const hasPercent = num?.includes("%");

  let numeric = num?.replace(/[^\d]/g, "");

  if (!numeric) return "";

  let number = parseInt(numeric, 10);

  if (hasPercent) {
    if (number > 100) number = 100;
    return number + "%";
  }

  return number?.toLocaleString("ru-RU").replace(/,/g, " ");
}
