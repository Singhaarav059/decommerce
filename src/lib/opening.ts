// Shared between the Opening loader (client) and the root layout (server).
export const OPENED_KEY = "dc-opened";

/** Runs before first paint: skip the opening on repeat visits and for reduced motion. */
export const openingHeadScript = `try{if(sessionStorage.getItem("${OPENED_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("opened")}catch(e){}`;
