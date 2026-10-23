declare module "@/content/company/*.mdx" {
  import type { MDXContent } from "mdx/types";
  import type { DocMeta } from "@/content/types";
  export const meta: DocMeta;
  const MDXComponent: MDXContent;
  export default MDXComponent;
}

declare module "*.mdx" {
  import type { MDXContent } from "mdx/types";
  import type { SolutionMeta } from "@/content/types";
  export const meta: SolutionMeta;
  const MDXComponent: MDXContent;
  export default MDXComponent;
}
