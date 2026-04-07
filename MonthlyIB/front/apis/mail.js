import { tokenRequireApi } from "./refreshToken";

const MAIL_API_URL = "api/mail";
export const ADMIN_MAIL_JOBS_REFRESH_EVENT = "admin:mail-jobs-refresh";
export const MAIL_ATTACHMENT_MAX_COUNT = 5;
export const MAIL_ATTACHMENT_MAX_TOTAL_SIZE = 10 * 1024 * 1024;
export const MAIL_ATTACHMENT_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.gif,.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip";
export const MAIL_INLINE_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif";

const ALLOWED_MAIL_ATTACHMENT_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "pdf",
  "txt",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
]);

const FALLBACK_INLINE_IMAGE_STYLE =
  "display:block;max-width:100%;height:auto;margin:16px 0;border-radius:14px;";

const getFileExtension = (filename = "") => {
  const extensionIndex = filename.lastIndexOf(".");
  if (extensionIndex < 0 || extensionIndex === filename.length - 1) {
    return "";
  }
  return filename.slice(extensionIndex + 1).toLowerCase();
};

const createInlineImageId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `mail-inline-${crypto.randomUUID()}`;
  }
  return `mail-inline-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createHtmlDocument = (html = "") => {
  if (typeof window !== "undefined" && typeof window.DOMParser !== "undefined") {
    return new window.DOMParser().parseFromString(html, "text/html");
  }

  return {
    body: {
      innerHTML: html,
      textContent: html.replace(/<[^>]+>/g, " "),
      querySelectorAll: () => [],
    },
  };
};

export const formatMailAttachmentSize = (bytes = 0) => {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const isMailContentEmpty = (content = "") => {
  if (!content || !content.trim()) {
    return true;
  }

  const document = createHtmlDocument(content);
  const hasImage =
    typeof document.body.querySelectorAll === "function" &&
    document.body.querySelectorAll("img").length > 0;
  const textContent = document.body.textContent?.replace(/\u00a0/g, " ").trim() ?? "";

  return !hasImage && textContent.length === 0;
};

export const createMailInlineImageEntries = (files = []) =>
  Array.from(files)
    .filter(Boolean)
    .map((file) => ({
      id: createInlineImageId(),
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));

export const revokeMailInlineImagePreviews = (inlineImages = []) => {
  inlineImages.forEach((inlineImage) => {
    if (inlineImage?.previewUrl) {
      URL.revokeObjectURL(inlineImage.previewUrl);
    }
  });
};

export const validateMailAttachments = (attachments = [], inlineImages = []) => {
  const normalizedAttachments = Array.from(attachments).filter(Boolean);
  const normalizedInlineImages = Array.from(inlineImages).filter(Boolean);
  const allFiles = [
    ...normalizedAttachments,
    ...normalizedInlineImages.map((inlineImage) => inlineImage.file ?? inlineImage),
  ].filter(Boolean);

  if (allFiles.length > MAIL_ATTACHMENT_MAX_COUNT) {
    return {
      valid: false,
      message: `본문 이미지와 첨부파일은 합쳐서 최대 ${MAIL_ATTACHMENT_MAX_COUNT}개까지 보낼 수 있습니다.`,
    };
  }

  const totalSize = allFiles.reduce((sum, file) => sum + (file?.size ?? 0), 0);
  if (totalSize > MAIL_ATTACHMENT_MAX_TOTAL_SIZE) {
    return {
      valid: false,
      message: `본문 이미지와 첨부파일 총 용량은 ${formatMailAttachmentSize(
        MAIL_ATTACHMENT_MAX_TOTAL_SIZE
      )}를 초과할 수 없습니다.`,
    };
  }

  const invalidAttachment = normalizedAttachments.find((attachment) => {
    if (!attachment || attachment.size <= 0) {
      return true;
    }
    return !ALLOWED_MAIL_ATTACHMENT_EXTENSIONS.has(
      getFileExtension(attachment.name)
    );
  });

  if (invalidAttachment) {
    return {
      valid: false,
      message: `허용되지 않은 첨부파일 형식입니다: ${invalidAttachment.name}`,
    };
  }

  const invalidInlineImage = normalizedInlineImages.find((inlineImage) => {
    const file = inlineImage?.file ?? inlineImage;
    if (!file || file.size <= 0) {
      return true;
    }
    const extension = getFileExtension(file.name);
    return !["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
  });

  if (invalidInlineImage) {
    const file = invalidInlineImage?.file ?? invalidInlineImage;
    return {
      valid: false,
      message: `본문에는 이미지 파일만 삽입할 수 있습니다: ${file?.name ?? "이미지"}`,
    };
  }

  return {
    valid: true,
    totalSize,
  };
};

export const prepareMailHtmlContent = (content = "", inlineImages = []) => {
  const document = createHtmlDocument(content);
  const activeInlineImageIds = new Set();

  if (typeof document.body.querySelectorAll === "function") {
    document.body.querySelectorAll("img[data-inline-image-id]").forEach((image) => {
      const inlineImageId = image.getAttribute("data-inline-image-id")?.trim();
      if (!inlineImageId) {
        image.remove();
        return;
      }
      activeInlineImageIds.add(inlineImageId);
      image.setAttribute("src", `cid:${inlineImageId}`);
      if (!image.getAttribute("style")) {
        image.setAttribute("style", FALLBACK_INLINE_IMAGE_STYLE);
      }
    });
  }

  return {
    contentHtml: document.body.innerHTML,
    activeInlineImages: inlineImages.filter((inlineImage) =>
      activeInlineImageIds.has(inlineImage.id)
    ),
  };
};

export const mailPost = async (
  userId,
  subject,
  content,
  attachments = [],
  inlineImages = [],
  session
) => {
  const { contentHtml, activeInlineImages } = prepareMailHtmlContent(
    content,
    inlineImages
  );

  const formData = new FormData();
  const data = {
    targetUserId: [userId],
    subject,
    content: contentHtml,
    inlineImageIds: activeInlineImages.map((inlineImage) => inlineImage.id),
  };

  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  attachments.forEach((attachment) => {
    formData.append("attachments", attachment);
  });
  activeInlineImages.forEach((inlineImage) => {
    formData.append("inlineImages", inlineImage.file);
  });

  const config = {
    headers: {
      Authorization: session?.accessToken,
    },
  };
  const response = await tokenRequireApi.post(`${MAIL_API_URL}`, formData, config);
  return response.data;
};

export const mailGetJobs = async (session) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: session?.accessToken,
    },
  };

  const response = await tokenRequireApi.get(`${MAIL_API_URL}/jobs`, config);
  return response.data;
};

export const dispatchAdminMailJobsRefresh = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(ADMIN_MAIL_JOBS_REFRESH_EVENT));
};
