const UNIQUE_BLOCK_TYPES = [
  "existingHero",
  "existingSearch",
  "existingGuideLinks",
  "existingMemberActivity",
  "existingReviewCarousel",
];

export const HOME_LAYOUT_OPTIONS = [
  { value: "one", label: "1열", columns: 1 },
  { value: "two", label: "2열", columns: 2 },
  { value: "three", label: "3열", columns: 3 },
];

export const BLOCK_LIBRARY = [
  {
    type: "existingHero",
    label: "기존 히어로",
    description: "현재 홈 상단 메인 히어로 섹션",
    unique: true,
  },
  {
    type: "existingSearch",
    label: "기존 검색",
    description: "홈 검색 영역",
    unique: true,
  },
  {
    type: "existingGuideLinks",
    label: "기존 가이드 링크",
    description: "월간 IB / 뉴스 / 계산기 / 자료실 링크",
    unique: true,
  },
  {
    type: "existingMemberActivity",
    label: "기존 회원 활동",
    description: "내 강의 / 스케줄 / 질문 섹션",
    unique: true,
  },
  {
    type: "existingReviewCarousel",
    label: "기존 리뷰",
    description: "수강생 리뷰 섹션",
    unique: true,
  },
  {
    type: "richText",
    label: "텍스트",
    description: "Quill 기반 리치 텍스트 블록",
  },
  {
    type: "image",
    label: "이미지",
    description: "업로드한 이미지를 카드처럼 배치",
  },
  {
    type: "video",
    label: "영상",
    description: "URL 임베드 또는 업로드 영상",
  },
  {
    type: "button",
    label: "버튼",
    description: "내부 링크 / 외부 링크 CTA",
  },
  {
    type: "spacer",
    label: "공백",
    description: "섹션 사이 여백 조절",
  },
];

export const createId = (prefix = "item") => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const getColumnCountForLayout = (layout = "one") => {
  return HOME_LAYOUT_OPTIONS.find((option) => option.value === layout)?.columns ?? 1;
};

export const createEmptyColumn = () => ({
  id: createId("column"),
  blocks: [],
});

export const createRow = (layout = "one") => ({
  id: createId("row"),
  layout,
  columns: Array.from({ length: getColumnCountForLayout(layout) }, () =>
    createEmptyColumn()
  ),
});

export const createDefaultBlock = (type) => {
  const base = {
    id: createId("block"),
    type,
    props: {},
  };

  switch (type) {
    case "existingHero":
      return base;
    case "existingSearch":
      return {
        ...base,
        props: {
          title: "궁금한 키워드를 검색해보세요!",
          description: "검색 안내",
        },
      };
    case "existingGuideLinks":
      return {
        ...base,
        props: {
          title: "IB 입시가이드",
        },
      };
    case "existingMemberActivity":
      return {
        ...base,
        props: {
          title: "나의 프로필 관리",
        },
      };
    case "existingReviewCarousel":
      return {
        ...base,
        props: {
          title: "수강생 리뷰",
        },
      };
    case "richText":
      return {
        ...base,
        props: {
          title: "새 텍스트 블록",
          html: "<p>내용을 입력하세요.</p>",
        },
      };
    case "image":
      return {
        ...base,
        props: {
          fileUrl: "",
          alt: "",
          caption: "",
          linkUrl: "",
        },
      };
    case "video":
      return {
        ...base,
        props: {
          sourceType: "embedUrl",
          embedUrl: "",
          fileUrl: "",
          caption: "",
        },
      };
    case "button":
      return {
        ...base,
        props: {
          label: "버튼 라벨",
          href: "/",
          variant: "primary",
        },
      };
    case "spacer":
      return {
        ...base,
        props: {
          height: 48,
        },
      };
    default:
      return base;
  }
};

export const createDefaultHomeLayout = () => ({
  rows: [
    {
      id: "row-existing-hero",
      layout: "one",
      columns: [
        {
          id: "column-existing-hero",
          blocks: [
            {
              id: "block-existing-hero",
              type: "existingHero",
              props: {},
            },
          ],
        },
      ],
    },
    {
      id: "row-existing-search",
      layout: "one",
      columns: [
        {
          id: "column-existing-search",
          blocks: [
            {
              id: "block-existing-search",
              type: "existingSearch",
              props: {
                title: "궁금한 키워드를 검색해보세요!",
                description: "검색 안내",
              },
            },
          ],
        },
      ],
    },
    {
      id: "row-existing-guide",
      layout: "one",
      columns: [
        {
          id: "column-existing-guide",
          blocks: [
            {
              id: "block-existing-guide",
              type: "existingGuideLinks",
              props: {
                title: "IB 입시가이드",
              },
            },
          ],
        },
      ],
    },
    {
      id: "row-existing-member",
      layout: "one",
      columns: [
        {
          id: "column-existing-member",
          blocks: [
            {
              id: "block-existing-member",
              type: "existingMemberActivity",
              props: {
                title: "나의 프로필 관리",
              },
            },
          ],
        },
      ],
    },
    {
      id: "row-existing-review",
      layout: "one",
      columns: [
        {
          id: "column-existing-review",
          blocks: [
            {
              id: "block-existing-review",
              type: "existingReviewCarousel",
              props: {
                title: "수강생 리뷰",
              },
            },
          ],
        },
      ],
    },
  ],
});

export const normalizeHomeLayout = (layout) => {
  const rows = Array.isArray(layout?.rows) ? layout.rows : [];
  return {
    rows: rows.map((row) => {
      const nextLayout = HOME_LAYOUT_OPTIONS.some((option) => option.value === row?.layout)
        ? row.layout
        : "one";
      const expectedColumns = getColumnCountForLayout(nextLayout);
      const requestColumns = Array.isArray(row?.columns) ? row.columns : [];
      const columns = Array.from({ length: expectedColumns }, (_, index) => {
        const column = requestColumns[index];
        return {
          id: column?.id || createId("column"),
          blocks: Array.isArray(column?.blocks)
            ? column.blocks.map((block) => ({
                id: block?.id || createId("block"),
                type: block?.type,
                props: block?.props || {},
              }))
            : [],
        };
      });

      if (requestColumns.length > expectedColumns) {
        const tailBlocks = requestColumns
          .slice(expectedColumns)
          .flatMap((column) => (Array.isArray(column?.blocks) ? column.blocks : []))
          .map((block) => ({
            id: block?.id || createId("block"),
            type: block?.type,
            props: block?.props || {},
          }));
        columns[columns.length - 1].blocks.push(...tailBlocks);
      }

      return {
        id: row?.id || createId("row"),
        layout: nextLayout,
        columns,
      };
    }),
  };
};

export const isUniqueBlockType = (type) => UNIQUE_BLOCK_TYPES.includes(type);

export const countBlockType = (layout, type) =>
  normalizeHomeLayout(layout).rows.reduce(
    (count, row) =>
      count +
      row.columns.reduce(
        (columnCount, column) =>
          columnCount +
          column.blocks.filter((block) => block.type === type).length,
        0
      ),
    0
  );

export const getPaletteAvailability = (layout) =>
  BLOCK_LIBRARY.map((item) => ({
    ...item,
    disabled: item.unique ? countBlockType(layout, item.type) > 0 : false,
  }));
