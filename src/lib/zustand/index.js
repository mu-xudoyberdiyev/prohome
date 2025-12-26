import { create } from "zustand";

export const useAppStore = create((set) => {
  return {
    user: JSON.parse(localStorage.getItem("user")),
    setUser(user) {
      return set(() => {
        localStorage.setItem("user", JSON.stringify(user));
        return { user };
      });
    },
  };
});
