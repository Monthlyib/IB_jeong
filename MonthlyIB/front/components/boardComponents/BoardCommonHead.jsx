import BoardCommon from "./BoardCommon";
import styles from "./BoardCommon.module.css";

const BoardCommonHead = ({
  modal,
  eyebrow,
  title,
  description,
  search,
  stats = [],
  action = null,
}) => {
  return (
    <>
      <section className={styles.boardHero}>
        <div className={styles.boardHeroCopy}>
          {eyebrow && <span className={styles.boardEyebrow}>{eyebrow}</span>}
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>

        <div className={styles.boardHeroAside}>
          {search && (
            <label className={styles.boardSearch}>
              <span className={styles.boardSearchLabel}>{search.label}</span>
              <div className={styles.boardSearchField}>
                <input
                  type="text"
                  placeholder={search.placeholder}
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      search.onSubmit();
                    }
                  }}
                />
                <button type="button" onClick={search.onSubmit}>
                  검색
                </button>
              </div>
            </label>
          )}

          {stats.length > 0 && !action && (
            <div className={styles.boardHeroStatsGrid}>
              {stats.map((stat) => (
                <div className={styles.boardStatCard} key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          )}

          {(stats.length > 0 || action) && action && (
            <div className={styles.boardHeroActions}>
              {stats.map((stat) => (
                <div className={styles.boardStatCard} key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
              {action}
            </div>
          )}
        </div>
      </section>

      <BoardCommon modal={modal} />
    </>
  );
};

export default BoardCommonHead;
