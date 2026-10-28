import Link from "next/link";
import { brand, companyGroup, legalLinks, solutionGroups } from "@/content/site";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-invite"><div><p>YOUR NEXT CHAPTER STARTS HERE</p><h2>Let’s make<br /><em>commerce flow.</em></h2></div><Link href="/contact-us" aria-label="Book a demo">↗</Link></div>
    <div className="footer-grid"><div className="footer-about"><Link href="/" className="footer-logo">decommerce<span>.</span></Link><p>One connected world for everywhere you sell.</p><p>Built by <a href={brand.parent.href}>Demaze Technologies ↗</a></p></div>{[...solutionGroups, companyGroup].map(group => <div key={group.label}><h3>{group.label}</h3><ul>{group.items.map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></div>)}</div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Decommerce</span><span>MADE FOR COMMERCE IN MOTION</span><div>{legalLinks.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div></div>
  </footer>;
}
