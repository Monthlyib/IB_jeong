import { tokenRequireApi } from "./refreshToken";

const MAIL_API_URL = "api/mail";
export const MAIL_ATTACHMENT_MAX_COUNT = 5;
export const MAIL_ATTACHMENT_MAX_TOTAL_SIZE = 10 * 1024 * 1024;
export const MAIL_ATTACHMENT_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.gif,.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip";

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

const getFileExtension = (filename = "") => {
  const extensionIndex = filename.lastIndexOf(".");
  if (extensionIndex < 0 || extensionIndex === filename.length - 1) {
    return "";
  }
  return filename.slice(extensionIndex + 1).toLowerCase();
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

export const validateMailAttachments = (attachments = []) => {
  const normalizedAttachments = Array.from(attachments).filter(Boolean);

  if (normalizedAttachments.length > MAIL_ATTACHMENT_MAX_COUNT) {
    return {
      valid: false,
      message: `첨부파일은 최대 ${MAIL_ATTACHMENT_MAX_COUNT}개까지 보낼 수 있습니다.`,
    };
  }

  const totalSize = normalizedAttachments.reduce(
    (sum, attachment) => sum + (attachment?.size ?? 0),
    0
  );

  if (totalSize > MAIL_ATTACHMENT_MAX_TOTAL_SIZE) {
    return {
      valid: false,
      message: `첨부파일 총 용량은 ${formatMailAttachmentSize(
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

  return {
    valid: true,
    totalSize,
  };
};

export const mailPost = async (
  userId,
  subject,
  content,
  attachments = [],
  session
) => {
  const formData = new FormData();
  const data = { targetUserId: [userId], subject, content };
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  attachments.forEach((attachment) => {
    formData.append("attachments", attachment);
  });

  const config = {
    headers: {
      Authorization: session?.accessToken,
    },
  };
  const response = await tokenRequireApi.post(`${MAIL_API_URL}`, formData, config);
  return response.data;
};
