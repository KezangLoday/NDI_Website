import { Emphasis } from "./PageHero";

/** A headline with one phrase in the gradient. */
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
