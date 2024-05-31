import { storageGetList, storageGetMain } from "@/apis/openAPI";
import {
  storageDeleteFile,
  storageDeleteFolder,
  storagePostFile,
  storagePostFolder,
  storageReviseFolder,
} from "@/apis/storageAPI";
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
      if (parentsFolderId == 0) {
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
  deleteFolder: async (storageFolderId, currentFolderId, session) => {
    try {
      await storageDeleteFolder(storageFolderId, session);
      if (currentFolderId === 0) get().getMainFolders();
      else get().getSubLists(currentFolderId, "");
    } catch (error) {
      console.error(error);
    }
  },
  deleteFile: async (storageFileId, currentFolderId, session) => {
    try {
      await storageDeleteFile(storageFileId, session);
      get().getSubLists(currentFolderId, "");
    } catch (error) {
      console.error(error);
    }
  },

  reviseFolder: async (
    currentFolderId,
    storageFolderId,
    folderName,
    status,
    session
  ) => {
    try {
      await storageReviseFolder(storageFolderId, folderName, status, session);
      if (currentFolderId === 0) get().getMainFolders();
      else get().getSubLists(currentFolderId, "");
    } catch (error) {
      console.error(error);
    }
  },
}));
