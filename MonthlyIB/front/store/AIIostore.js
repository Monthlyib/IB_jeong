// /store/ioStore.js
import { create } from "zustand";

export const useIOStore = create((set) => ({
  iocTopic: "",
  workTitle: "",
  author: "",
  scriptFile: null,

  setIocTopic: (iocTopic) => set({ iocTopic }),
  setWorkTitle: (workTitle) => set({ workTitle }),
  setAuthor: (author) => set({ author }),
  setScriptFile: (scriptFile) => set({ scriptFile }),
}));