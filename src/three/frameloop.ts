// Tiny store shared by DOM-side <Scene> wrappers and the single canvas.
// The canvas renders only while at least one scene is on screen and the tab
// is visible; otherwise its frameloop is "never" and the GPU idles.

type Listener = () => void;

const visible = new Set<string>();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const frameloop = {
  setVisible(id: string, isVisible: boolean) {
    const had = visible.has(id);
    if (isVisible && !had) visible.add(id);
    else if (!isVisible && had) visible.delete(id);
    else return;
    emit();
  },
  anyVisible() {
    return visible.size > 0;
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
