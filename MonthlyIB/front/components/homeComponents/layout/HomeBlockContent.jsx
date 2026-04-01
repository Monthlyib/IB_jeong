import Link from "next/link";
import styles from "./HomeLayoutRenderer.module.css";
import MainHeroSection from "../sections/MainHeroSection";
import MainSearchSection from "../sections/MainSearchSection";
import MainGuideSection from "../sections/MainGuideSection";
import MainMemberActivitySection from "../sections/MainMemberActivitySection";
import MainReviewSection from "../sections/MainReviewSection";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov"];

const isDirectVideoUrl = (url = "") =>
  VIDEO_EXTENSIONS.some((extension) => url.toLowerCase().includes(extension));

const getEmbedVideoUrl = (url = "") => {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host.includes("youtube.com")) {
      if (parsed.pathname.includes("/embed/")) {
        return parsed.toString();
      }
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : parsed.toString();
    }

    if (host.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      if (host.includes("player.vimeo.com")) {
        return parsed.toString();
      }
      return videoId ? `https://player.vimeo.com/video/${videoId}` : parsed.toString();
    }
  } catch (error) {
    return url;
  }

  return url;
};

const HomeBlockContent = ({ block, previewMode = false }) => {
  const props = block?.props || {};

  switch (block?.type) {
    case "existingHero":
      return <MainHeroSection />;
    case "existingSearch":
      return (
        <MainSearchSection
          title={props?.title || "궁금한 키워드를 검색해보세요!"}
          previewMode={previewMode}
        />
      );
    case "existingGuideLinks":
      return <MainGuideSection title={props?.title || "IB 입시가이드"} />;
    case "existingMemberActivity":
      return (
        <MainMemberActivitySection
          title={props?.title || "나의 프로필 관리"}
          previewMode={previewMode}
        />
      );
    case "existingReviewCarousel":
      return <MainReviewSection title={props?.title || "수강생 리뷰"} />;
    case "richText":
      return (
        <article className={styles.contentCard}>
          {props?.title ? <h3>{props.title}</h3> : null}
          <div
            className={styles.richTextContent}
            dangerouslySetInnerHTML={{ __html: props?.html || "<p></p>" }}
          />
        </article>
      );
    case "image":
      return (
        <figure className={styles.mediaCard}>
          {props?.fileUrl ? (
            <img src={props.fileUrl} alt={props.alt || "홈 이미지"} />
          ) : (
            <div className={styles.mediaPlaceholder}>이미지를 업로드하세요</div>
          )}
          {(props?.caption || props?.linkUrl) && (
            <figcaption>
              {props?.caption ? <span>{props.caption}</span> : null}
              {props?.linkUrl ? (
                <Link href={props.linkUrl}>이미지 링크 열기</Link>
              ) : null}
            </figcaption>
          )}
        </figure>
      );
    case "video": {
      const isUploadedVideo = props?.sourceType === "uploadedFile" || isDirectVideoUrl(props?.embedUrl);
      const videoUrl = props?.sourceType === "uploadedFile" ? props?.fileUrl : props?.embedUrl;
      const embedUrl = getEmbedVideoUrl(props?.embedUrl);

      return (
        <div className={styles.mediaCard}>
          {isUploadedVideo ? (
            videoUrl ? (
              <video controls playsInline preload="metadata" src={videoUrl} />
            ) : (
              <div className={styles.mediaPlaceholder}>영상을 업로드하거나 URL을 입력하세요</div>
            )
          ) : embedUrl ? (
            <div className={styles.videoFrame}>
              <iframe
                src={embedUrl}
                title={props?.caption || "홈 비디오"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className={styles.mediaPlaceholder}>임베드 URL을 입력하세요</div>
          )}
          {props?.caption ? <p className={styles.mediaCaption}>{props.caption}</p> : null}
        </div>
      );
    }
    case "button":
      return (
        <div className={styles.buttonBlock}>
          <Link
            href={props?.href || "#"}
            className={
              props?.variant === "secondary"
                ? styles.secondaryButton
                : props?.variant === "ghost"
                  ? styles.ghostButton
                  : styles.primaryButton
            }
          >
            {props?.label || "버튼"}
          </Link>
        </div>
      );
    case "spacer":
      return <div style={{ height: `${props?.height || 48}px` }} aria-hidden="true" />;
    default:
      return null;
  }
};

export default HomeBlockContent;
