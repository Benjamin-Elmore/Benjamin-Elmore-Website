// True from the first client render until the prerendered page has hydrated. Pages use it to start from
// the prerendered layout (no URL-derived state) while hydrating, and to tell a deep link from a Back or Forward.
export const hydration = { active: false };
