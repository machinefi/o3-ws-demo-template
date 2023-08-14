import { create } from "zustand";

interface Token {
  token: string;
  setToken: (token: string) => void;
  resetToken: () => void;
}

interface ErrorMsg {
  errorMsg: string;
  setErrorMsg: (errorMsg: string) => void;
  resetErrorMsg: () => void;
}

const useStore = create<Token & ErrorMsg>((set) => ({
  token: "",
  setToken: (token: string) => set({ token }),
  resetToken: () => set({ token: "" }),
  errorMsg: "",
  setErrorMsg: (errorMsg: string) => set({ errorMsg }),
  resetErrorMsg: () => set({ errorMsg: "" }),
}));

export default useStore;
