// Tailwind class sets shared by several pages.

/** Page frame: one pair of outer margins everywhere. */
export const shell = "mx-auto w-full max-w-[1440px] px-4 sm:px-6";

/** Underlined text link with a 44px touch target. */
export const textLink =
  "inline-flex min-h-11 items-center text-primary underline underline-offset-[5px] hover:text-ink";

/** Large page title (Gallery, Blog). */
export const pageTitle =
  "text-[clamp(56px,8vw,128px)] leading-none tracking-[-0.055em]";

/** Section heading on the home and project pages. */
export const sectionTitle = "text-[clamp(28px,3vw,40px)]";

/** Placeholder shown when a list or a picture is empty. */
export const mediaFallback = "mb-7 rounded-2xl bg-inset p-8 text-soft";

/** Spacing for CMS rich text (Payload Lexical output). */
// Payload wraps the blocks in div.payload-richtext, so space its children too.
export const richText = "[&>*+*]:mt-4 [&_.payload-richtext>*+*]:mt-4";

/** Long-form blog article body. */
export const articleBody = [
  richText,
  "text-lg leading-[1.8] wrap-anywhere",
  "[&_:is(h2,h3,h4)]:mt-10 [&_:is(h2,h3,h4)]:mb-4 [&_:is(h2,h3,h4)]:text-[28px]",
  "[&_ul]:list-disc [&_ol]:list-decimal [&_:is(ul,ol)]:pl-6 [&_li+li]:mt-2",
  "[&_blockquote]:bg-surface [&_blockquote]:p-6",
  "[&_img]:h-auto [&_img]:max-w-full",
  "[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:bg-surface [&_pre]:p-6",
  "[&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-[5px]",
].join(" ");
