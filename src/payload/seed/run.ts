/** `pnpm seed` — the CLI wrapper around `seed()`. */
import configPromise from "@payload-config";
import { getPayload } from "payload";

import { seed } from "./index";

const payload = await getPayload({ config: configPromise });

const report = await seed(payload);

const summarise = (counts: Record<string, number>): string => {
  const entries = Object.entries(counts);
  if (entries.length === 0) return "  (none)";
  return entries.map(([kind, count]) => `  ${kind}: ${count}`).join("\n");
};

payload.logger.info(`Seed complete.\n\nCreated:\n${summarise(report.created)}\n\nAlready present:\n${summarise(report.skipped)}`);

if (report.warnings.length > 0) {
  payload.logger.warn(`${report.warnings.length} warning(s):\n${report.warnings.map((line) => `  - ${line}`).join("\n")}`);
}

/* The Postgres pool keeps the process alive, and `payload run` does not close it for us. */
process.exit(0);
