import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => <h2 className="display t-h3 mt-16 mb-5 scroll-mt-[calc(var(--header-h)+24px)] border-t border-line pt-8 first:border-0 first:pt-0" {...props} />,
  h3: (props) => <h3 className="mt-10 mb-3 text-[1.15rem] font-semibold tracking-[-0.01em]" {...props} />,
  p: (props) => <p className="mb-4 max-w-[62ch] leading-relaxed text-ink-soft" {...props} />,
  ul: (props) => <ul className="mb-6 max-w-[62ch] list-disc space-y-2 pl-5 text-ink-soft marker:text-copper" {...props} />,
  ol: (props) => <ol className="mb-6 max-w-[62ch] list-decimal space-y-2 pl-5 text-ink-soft marker:font-semibold marker:text-copper" {...props} />,
  a: (props) => <a className="text-copper-ink underline decoration-copper/40 decoration-[1.5px] underline-offset-4 transition-colors hover:decoration-copper" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  hr: () => <hr className="my-12 border-line" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
