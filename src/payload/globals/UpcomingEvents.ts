/** The upcoming-event card. */
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
      /** Only sessions that are still upcoming can be featured. */
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
