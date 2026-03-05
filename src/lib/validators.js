/**
 * BUSINESS layer: validation helpers.
 * Used by UI layer; no fetch, no DOM.
 */

import { toast } from "sonner";

const TOAST_OPTS = { position: "top-center" };

/**
 * Validates admin/rop/sales-manager add form. Focuses field and shows toast on error.
 * @param {HTMLFormElement} form
 * @param {{ fullName?: string, email?: string, password?: string, permissions?: unknown[] }} result
 * @returns {boolean} true if valid
 */
export function validateUserForm(form, result) {
  const fullName = (result.fullName ?? "").trim();
  const email = (result.email ?? "").trim();
  const password = (result.password ?? "").trim();
  if (!fullName) {
    form.fullName?.focus();
    toast.info("FISHni kiriting!", TOAST_OPTS);
    return false;
  }
  if (!email) {
    form.email?.focus();
    toast.info("Email kiriting!", TOAST_OPTS);
    return false;
  }
  if (!password) {
    form.password?.focus();
    toast.info("Parol kiriting!", TOAST_OPTS);
    return false;
  }
  if (password.length <= 6) {
    form.password?.focus();
    toast.info("Parol eng kamida 6 ta belgi bo'lishi kerak!", TOAST_OPTS);
    return false;
  }
  if (!result.permissions?.length) {
    toast.info("Ruxsatlarni belgilang!", TOAST_OPTS);
    return false;
  }
  return true;
}
