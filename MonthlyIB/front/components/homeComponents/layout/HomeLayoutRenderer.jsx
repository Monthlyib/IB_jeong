import styles from "./HomeLayoutRenderer.module.css";
import HomeBlockContent from "./HomeBlockContent";
import { normalizeHomeLayout } from "./homeLayoutDefaults";

const HomeLayoutRenderer = ({ layout, previewMode = false }) => {
  const normalized = normalizeHomeLayout(layout);

  return (
    <div className={styles.homeLayout}>
      {normalized.rows.map((row) => (
        <section
          key={row.id}
          className={`${styles.layoutRow} ${styles[`layout_${row.layout}`]}`}
        >
          {row.columns.map((column) => (
            <div key={column.id} className={styles.layoutColumn}>
              {column.blocks.map((block) => (
                <div key={block.id} className={styles.blockShell}>
                  <HomeBlockContent block={block} previewMode={previewMode} />
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};

export default HomeLayoutRenderer;
