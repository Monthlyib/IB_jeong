const createMenuClone = (menu) => ({
  key: menu.key,
  label: menu.label,
  href: menu.href,
  visible: menu.visible,
  external: menu.external,
  order: menu.order,
  children: Array.isArray(menu.children)
    ? menu.children.map((child) => createMenuClone(child))
    : [],
});

export const DEFAULT_HEADER_NAVIGATION_MENUS = [
  {
    key: "ai-tools",
    label: "AI Tools",
    href: "/aitools",
    visible: true,
    external: false,
    order: 0,
    children: [],
  },
  {
    key: "monthly-ib",
    label: "월간 IB",
    href: "/ib",
    visible: true,
    external: false,
    order: 1,
    children: [],
  },
  {
    key: "course",
    label: "영상강의",
    href: "/course",
    visible: true,
    external: false,
    order: 2,
    children: [],
  },
  {
    key: "resources",
    label: "자료실",
    href: "/board",
    visible: true,
    external: false,
    order: 3,
    children: [
      {
        key: "board-news",
        label: "IB 입시뉴스",
        href: "/board",
        visible: true,
        external: false,
        order: 0,
        children: [],
      },
      {
        key: "board-calculator",
        label: "합격예측 계산기",
        href: "/board/calculator",
        visible: true,
        external: false,
        order: 1,
        children: [],
      },
      {
        key: "board-download",
        label: "자료실",
        href: "/board/download",
        visible: true,
        external: false,
        order: 2,
        children: [],
      },
      {
        key: "board-free",
        label: "자유게시판",
        href: "/board/free",
        visible: true,
        external: false,
        order: 3,
        children: [],
      },
    ],
  },
  {
    key: "tutoring",
    label: "튜터링 예약",
    href: "/tutoring",
    visible: true,
    external: false,
    order: 4,
    children: [
      {
        key: "tutoring-booking",
        label: "튜터링 예약",
        href: "/tutoring",
        visible: true,
        external: false,
        order: 0,
        children: [],
      },
      {
        key: "question",
        label: "질문하기",
        href: "/question",
        visible: true,
        external: false,
        order: 1,
        children: [],
      },
    ],
  },
  {
    key: "learningtest",
    label: "학습유형 테스트",
    href: "/learningtest",
    visible: true,
    external: false,
    order: 5,
    children: [],
  },
  {
    key: "offline-class",
    label: "학원 현장강의",
    href: "http://monthlyib.co.kr/contact",
    visible: true,
    external: true,
    order: 6,
    children: [],
  },
];

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value ?? "";

const normalizeKey = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

const ensureUniqueKey = (baseKey, usedKeys, fallbackIndex) => {
  const resolvedBase = baseKey || `menu-${fallbackIndex + 1}`;
  let candidate = resolvedBase;
  let suffix = 2;
  while (usedKeys.has(candidate)) {
    candidate = `${resolvedBase}-${suffix}`;
    suffix += 1;
  }
  usedKeys.add(candidate);
  return candidate;
};

const normalizeMenuList = (menus, depth = 0) => {
  const usedKeys = new Set();
  const nextMenus = (Array.isArray(menus) ? menus : [])
    .filter(Boolean)
    .sort((left, right) => (left?.order ?? Number.MAX_SAFE_INTEGER) - (right?.order ?? Number.MAX_SAFE_INTEGER))
    .map((menu, index) => {
      const label = normalizeText(menu?.label);
      const href = normalizeText(menu?.href);
      const canHaveChildren = depth === 0;
      const children = canHaveChildren
        ? normalizeMenuList(menu?.children, depth + 1)
        : [];
      const hasChildren = children.length > 0;

      if (!label && !hasChildren) {
        return null;
      }

      if (!hasChildren && !href) {
        return null;
      }

      const keySeed = normalizeKey(menu?.key || label || href);
      return {
        key: ensureUniqueKey(keySeed, usedKeys, index),
        label: label || href || "새 메뉴",
        href,
        visible: typeof menu?.visible === "boolean" ? menu.visible : true,
        external: typeof menu?.external === "boolean" ? menu.external : false,
        order: index,
        children,
      };
    })
    .filter(Boolean);

  return nextMenus;
};

export const buildDefaultHeaderNavigationConfig = () => ({
  menus: DEFAULT_HEADER_NAVIGATION_MENUS.map((menu) => createMenuClone(menu)),
});

export const normalizeHeaderNavigationConfig = (config) => {
  const normalizedMenus = normalizeMenuList(config?.menus);
  if (normalizedMenus.length === 0) {
    return buildDefaultHeaderNavigationConfig();
  }

  return {
    menus: normalizedMenus,
  };
};

export const getVisibleHeaderMenus = (config) =>
  normalizeHeaderNavigationConfig(config).menus
    .filter((menu) => menu.visible)
    .map((menu) => ({
      ...menu,
      children: (menu.children || []).filter((child) => child.visible),
    }));

export const createHeaderNavigationDraftMenu = (depth = 0) => ({
  key: `menu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: depth === 0 ? "새 메뉴" : "새 하위 메뉴",
  href: "/",
  visible: true,
  external: false,
  order: 0,
  children: [],
});
