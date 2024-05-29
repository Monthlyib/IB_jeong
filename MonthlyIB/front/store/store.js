import { storageGetList, storageGetMain } from "@/apis/openAPI";
import { storagePostFile, storagePostFolder } from "@/apis/storageAPI";
import { create } from "zustand";

export const useStoreStore = create((set, get) => ({
  mainLoading: false,
  mainSuccess: false,
  mainError: null,
  subListLoading: false,
  subListSuccess: false,
  subListError: null,
  mainFolders: {},
  subLists: [],
  getMainFolders: async () => {
    set({ mainLoading: true });
    try {
      const res = await storageGetMain();
      set({ mainFolders: res.data, mainLoading: false, mainSuccess: true });
    } catch (error) {
      console.error(error);
      set({ mainError: error });
    }
  },

  getSubLists: async (parentsFolderId, keyWord) => {
    set({ subListLoading: true });
    try {
      const res = await storageGetList(parentsFolderId, keyWord);
      console.log(res.data);
      set({
        subLists: res.data,
        subListLoading: false,
        subListSuccess: true,
      });
    } catch (error) {
      console.error(error);
      set({ subListError: error });
    }
  },

  postFolder: async (parentsFolderId, folderName, status, session) => {
    try {
      const res = await storagePostFolder(
        parentsFolderId,
        folderName,
        status,
        session
      );
      if (status == "MAIN") {
        get().getMainFolders();
      } else get().getSubLists(parentsFolderId, "");
    } catch (error) {
      console.error(error);
    }
  },
  postFile: async (parentsFolderId, file, session) => {
    try {
      const res = await storagePostFile(parentsFolderId, file, session);
      get().getSubLists(parentsFolderId, "");
    } catch (error) {
      console.error(error);
    }
  },
}));
