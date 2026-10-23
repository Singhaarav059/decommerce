// Registry of solution pages: meta + MDX body (the problem narrative), by slug.
import type { MDXContent } from "mdx/types";
import type { SolutionSlug } from "../site";
import type { SolutionMeta } from "../types";
import Storefront, { meta as StorefrontMeta } from "./storefront.mdx";
import BrandShowcase, { meta as BrandShowcaseMeta } from "./brand-showcase.mdx";
import B2b, { meta as B2bMeta } from "./b2b.mdx";
import QuickCommerce, { meta as QuickCommerceMeta } from "./quick-commerce.mdx";
import Marketplace, { meta as MarketplaceMeta } from "./marketplace.mdx";
import Oms, { meta as OmsMeta } from "./oms.mdx";
import Wms, { meta as WmsMeta } from "./wms.mdx";
import Tms, { meta as TmsMeta } from "./tms.mdx";
import Pos, { meta as PosMeta } from "./pos.mdx";
import Clienteling, { meta as ClientelingMeta } from "./clienteling.mdx";
import EndlessAisle, { meta as EndlessAisleMeta } from "./endless-aisle.mdx";
import SelfCheckout, { meta as SelfCheckoutMeta } from "./self-checkout.mdx";

export const solutions: Record<SolutionSlug, { meta: SolutionMeta; Content: MDXContent }> = {
  "storefront": { meta: StorefrontMeta, Content: Storefront },
  "brand-showcase": { meta: BrandShowcaseMeta, Content: BrandShowcase },
  "b2b": { meta: B2bMeta, Content: B2b },
  "quick-commerce": { meta: QuickCommerceMeta, Content: QuickCommerce },
  "marketplace": { meta: MarketplaceMeta, Content: Marketplace },
  "oms": { meta: OmsMeta, Content: Oms },
  "wms": { meta: WmsMeta, Content: Wms },
  "tms": { meta: TmsMeta, Content: Tms },
  "pos": { meta: PosMeta, Content: Pos },
  "clienteling": { meta: ClientelingMeta, Content: Clienteling },
  "endless-aisle": { meta: EndlessAisleMeta, Content: EndlessAisle },
  "self-checkout": { meta: SelfCheckoutMeta, Content: SelfCheckout },
};
