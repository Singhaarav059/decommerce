"use client";

import Image from "next/image";
import { useState } from "react";

const channels = ["Online store", "Shop floor", "Warehouse", "Marketplace"];

/** An illustrative interaction: one sale updates the same count in every channel. */
export function StockStory() {
  const [count, setCount] = useState(3);
  return <section className="stock-story" aria-labelledby="stock-story-title">
    <div className="stock-story-heading"><div><p className="section-kicker"><span /> ONE SYSTEM, IN ACTION</p><h2 id="stock-story-title">One sale.<br /><em>Everyone in sync.</em></h2></div><p>See how one shared stock count keeps every part of your business on the same page.</p></div>
    <div className="stock-story-stage"><div className="stock-story-image"><Image src="/assets/editorial/store-studio-v1.png" alt="" fill sizes="(max-width: 767px) 100vw, 60vw" className="object-cover" /><span>AN ILLUSTRATIVE EXAMPLE</span></div>
      <div className="stock-story-panel"><div className="stock-story-panel-top"><span>THE SHARED CATALOG</span><span>EXAMPLE / 01</span></div><p className="stock-product">Linen overshirt <span>· Size M</span></p><div className="stock-count" aria-live="polite" aria-atomic="true"><strong>{count}</strong><span> {count === 1 ? "item" : "items"} available<br />across your channels</span></div><ul>{channels.map(channel => <li key={channel}><span>{channel}</span><strong>{count}</strong></li>)}</ul><button type="button" onClick={() => setCount(value => value > 0 ? value - 1 : 3)}>{count > 0 ? "Make a sale" : "Reset example"}<span aria-hidden="true">↗</span></button><p className="stock-story-note">{count > 0 ? "Try a sale and watch every channel update." : "All channels now show the item is out of stock."}</p></div>
    </div>
  </section>;
}
