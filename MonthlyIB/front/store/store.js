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
  fileUploading: false,
  fileUploadPct: 0,
  fileUploadName: null,
  fileUploadError: null,
  fileUploadCancel: null,
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
    const { fileUploading, fileUploadCancel } = get();
    if (fileUploading) return; // already uploading

    // block accidental refresh/navigation while uploading
    const beforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    set({
      fileUploading: true,
      fileUploadPct: 0,
      fileUploadName: file?.name ?? null,
      fileUploadError: null,
    });
    // 초기 피드백: 첫 이벤트 전까지 0%로 보이지 않도록 1%로 시작
    set({ fileUploadPct: 1 });
    window.addEventListener("beforeunload", beforeUnload);

    try {
      const onProgress = (pct) => {
        // 최소/최대 clamp 및 100% 전환 시점 보장
        const clamped = Math.max(1, Math.min(99, Math.floor(pct)));
        set({ fileUploadPct: clamped });
      };

      const { res, cancel } = await storagePostFile(
        parentsFolderId,
        file,
        session,
        onProgress
      );
      // keep cancel handle in store in case we want to cancel from UI
      set({ fileUploadCancel: cancel });

      // 업로드 완료 표시 후 리스트 갱신
      set({ fileUploadPct: 100 });
      // refresh list
      await get().getSubLists(parentsFolderId, "");
      // 100% 상태가 눈에 보이도록 잠깐 대기 (모달 깜빡임 방지)
      await new Promise((r) => setTimeout(r, 300));
    } catch (error) {
      console.error(error);
      set({ fileUploadError: error });
    } finally {
      set({ fileUploading: false, fileUploadPct: 0, fileUploadName: null, fileUploadCancel: null });
      window.removeEventListener("beforeunload", beforeUnload);
    }
  },
  cancelUpload: () => {
    const cancel = get().fileUploadCancel;
    if (cancel) {
      cancel("User canceled upload");
      set({ fileUploading: false, fileUploadPct: 0, fileUploadName: null, fileUploadCancel: null });
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
