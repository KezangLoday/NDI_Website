import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import { getServices, getSiteSettings } from "@/content";
import type { IconName } from "@/components/ui/icons";

import { ContactForm } from "./ContactForm";

function ContactRow({
  href,
  icon,
  label,
  value,
  external = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  value: string;
  /** wa.me opens a site, so it gets a tab; mailto: and tel: hand off. */
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="ndi-contact-row flex items-center gap-3.5 rounded-xl border border-grid px-3.5 py-3 text-[15px] text-body"
    >
      <span className="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] border border-grid bg-[color:var(--ndi-mint-08)] text-accent">
        <Icon name={icon} size={18} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {label}
        </span>
        <span className="[overflow-wrap:anywhere]">{value}</span>
      </span>
    </a>
  );
}

export async function ContactSection() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);
  const { contact } = settings;

  return (
    <section id="contact" className="mx-auto max-w-[1200px] px-[18px] py-14 min-[561px]:px-8 min-[561px]:py-[84px]">
      <Reveal className="relative grid grid-cols-1 items-start gap-9 min-[901px]:grid-cols-2 min-[901px]:gap-14">
        <div className="relative flex flex-col items-start">
          <Eyebrow>— Get in touch</Eyebrow>
          <h2 className="mt-4 font-display text-[27px] font-bold leading-[1.08] tracking-[-0.01em] text-strong min-[561px]:text-[32px] min-[901px]:text-[40px]">
            Step into Bhutan&apos;s secure digital future
          </h2>
          <p className="mt-4 max-w-[440px] text-[17px] leading-[1.6] text-muted">
            Download the wallet, or reach out to integrate Bhutan NDI into your organization.
          </p>

          <div className="mt-8 flex w-full flex-col gap-2.5 self-stretch">
            <ContactRow
              href={`mailto:${contact.email}`}
              icon="mail"
              label="Email"
              value={contact.email}
            />
            {/* One number, two ways to use it. */}
            <ContactRow
              href={contact.phoneHref}
              icon="phone"
              label="Phone"
              value={contact.phoneDisplay}
            />
            <ContactRow
              href={contact.whatsappHref}
              icon="whatsapp"
              label="WhatsApp"
              value={contact.phoneDisplay}
              external
            />
          </div>

          <div className="mt-5 flex items-center gap-[9px] font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-accent"
              style={{ boxShadow: "var(--glow-sm)" }}
            />
            {contact.responseTime}
          </div>
        </div>

        <ContactForm services={services} />
      </Reveal>
    </section>
  );
}
