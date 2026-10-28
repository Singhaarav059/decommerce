import Link from "next/link";

const worlds = [
  { number: "01", title: "Sell everywhere", copy: "Bring your storefront, marketplaces and stores together.", href: "/storefront" },
  { number: "02", title: "Move smarter", copy: "Connect orders, inventory, warehouses and delivery.", href: "/oms" },
  { number: "03", title: "Know your customer", copy: "Give your teams the context to make every visit feel personal.", href: "/clienteling" },
];

export function CommerceIntro() {
  return <section id="what-we-do" className="commerce-intro">
    <div className="commerce-intro-heading"><p className="section-kicker"><span /> THE BIG PICTURE</p><div><h2>Many moving parts.<br /><em>One beautiful flow.</em></h2><p>Decommerce connects the tools, teams and places behind every sale. So you can spend less time bringing things together and more time growing your business.</p></div></div>
    <div className="commerce-worlds commerce-pathways">{worlds.map(world => <Link href={world.href} className="commerce-pathway" key={world.number}><span className="commerce-pathway-number">{world.number} / 03</span><div><h3>{world.title}</h3><p>{world.copy}</p></div><span className="commerce-pathway-arrow" aria-hidden="true">↗</span></Link>)}</div>
    <div className="commerce-intro-end"><span>THE PLATFORM, AT A GLANCE</span><p>One catalog. One stock count. One customer record.</p><a href="#modules">Discover all solutions <span aria-hidden="true">↗</span></a></div>
  </section>;
}
