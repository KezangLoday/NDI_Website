/**
 * The upcoming-event card.
 *
 * A global rather than a flag on the webinar, because "which event are we
 * promoting" is a decision about the site, not a property of the session — and
 * a flag would let two people set it on two records and leave the page showing
 * whichever sorted first.
 *
 * `featured` is `hasMany` from the outset even though the design shows one
 * banner. That is the extensibility the requirement asks for: supporting two
 * upcoming events later becomes a change to a component, not a schema
 * migration and a data backfill.
 *
 * Staleness is handled in two layers. `fallback` covers the common failure —
 * nobody remembered to update the card — by promoting the next scheduled
 * session automatically. And whatever ends up selected, the frontend drops
 * anything whose start time has passed, so a forgotten card degrades to the
 * empty state rather than advertising last month's webinar.
 */
import type { GlobalConfig } from "payload";

import { anyone, prEditable } from "../access";
import { revalidateGlobalAfterChange, UPCOMING_EVENT_ROUTES } from "../hooks/revalidate";

export const UpcomingEvents: GlobalConfig = {
  slug: "upcoming-events",
  label: "Upcoming events",
  admin: {
    group: "Resources",
    description:
      "What the “Upcoming session” card promotes. Leave it empty and the card disappears rather than showing something stale.",
  },
  access: {
    read: anyone,
    update: prEditable,
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange(UPCOMING_EVENT_ROUTES)],
  },
  fields: [
    {
      name: "featured",
      type: "relationship",
      relationTo: "webinars",
      hasMany: true,
      label: "Featured sessions",
      /**
       * Only sessions that are still upcoming can be featured. A recording has
       * nothing to register for, and offering one here is how a "Register to
       * attend" button ends up pointing at a video.
       */
      filterOptions: () => ({ sessionStatus: { equals: "upcoming" } }),
      admin: {
        description:
          "In order. The card shows the first one whose start time has not passed; the design has room for one.",
      },
    },
    {
      name: "fallback",
      type: "checkbox",
      defaultValue: true,
      label: "Fall back to the next scheduled session",
      admin: {
        description:
          "On, an empty or lapsed selection is filled by the soonest published upcoming webinar — so the card keeps working when nobody remembers to change it. Off, an empty selection means no card.",
      },
    },
    {
      name: "emptyStateNote",
      type: "textarea",
      label: "When there is nothing scheduled",
      defaultValue:
        "There is no session scheduled at the moment. Recordings of past sessions are below, and the next one will be announced here.",
      admin: {
        description:
          "Shown in place of the card. Say when to look again, not merely that there is nothing.",
      },
    },
  ],
};
