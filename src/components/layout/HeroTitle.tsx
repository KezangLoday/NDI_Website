import { Emphasis } from "./PageHero";

/**
 * A headline with one phrase in the gradient.
 *
 * The resource pages hold their headline as a plain string in content, so the
 * emphasised phrase is named separately and matched here rather than the copy
 * carrying markup. If the phrase is not found the headline still renders, just
 * without the accent, which is the right failure: a missing gradient is a
 * smaller problem than a blank hero.
 */
export function HeroTitle({ title, emphasis }: { title: string; emphasis: string }) {
  const at = title.indexOf(emphasis);
  if (at === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <Emphasis>{emphasis}</Emphasis>
      {title.slice(at + emphasis.length)}
    </>
  );
}
