/** Smooth-scrolls to the contact section, clearing the fixed nav pill. */
export function scrollToContact() {
  const element = document.getElementById("contact");
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top, behavior: "smooth" });
}
