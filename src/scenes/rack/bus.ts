// Shared, mutable state between the DOM gesture layer and the rack scene.
// The DOM writes intent through methods (select, drag, lift, spin); the scene
// reads the fields every frame and reports back what the DOM needs to
// hit-test (projected slot width). Lives outside React state on purpose:
// it changes every pointer move and every frame.

export class RackBus {
  index: number;
  drag = 0;
  lifted = false;
  spin = 0;
  spinVel = 0;
  reduced = false;
  /** One slot's width in CSS px at the rail, written by the scene. */
  slotPx = 160;
  /** Frames rendered, for tests. */
  frame = 0;

  constructor(
    readonly count: number,
    index = 0,
  ) {
    this.index = index;
  }

  clamp(i: number) {
    return Math.max(0, Math.min(this.count - 1, i));
  }
  select(i: number) {
    this.index = this.clamp(i);
    this.drag = 0;
    return this.index;
  }
  setDrag(slots: number) {
    this.drag = slots;
  }
  setLifted(v: boolean) {
    this.lifted = v;
    if (!v) {
      this.spin = 0;
      this.spinVel = 0;
    }
  }
  addSpin(rad: number) {
    this.spin += rad;
  }
  fling(vel: number) {
    this.spinVel = vel;
  }
  setReduced(v: boolean) {
    this.reduced = v;
  }
  /** Called by the scene each frame. */
  report(slotPx: number, dt: number) {
    this.slotPx = slotPx;
    this.frame++;
    if (this.lifted) {
      this.spin += this.spinVel * dt;
      this.spinVel *= Math.pow(0.04, dt);
    }
  }
}
