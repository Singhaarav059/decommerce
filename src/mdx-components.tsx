import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => <h2 className="display mt-14 mb-4 text-4xl md:text-5xl" {...props} />,
  h3: (props) => <h3 className="mt-10 mb-3 text-lg font-semibold tracking-tight" {...props} />,
  p: (props) => <p className="mb-4 max-w-[62ch] leading-relaxed text-ink-soft" {...props} />,
  ul: (props) => <ul className="mb-6 max-w-[62ch] list-disc space-y-2 pl-5 text-ink-soft" {...props} />,
  ol: (props) => <ol className="mb-6 max-w-[62ch] list-decimal space-y-2 pl-5 text-ink-soft" {...props} />,
  a: (props) => <a className="text-copper-ink underline underline-offset-4 hover:text-ink" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  hr: () => <hr className="my-12 border-line" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
