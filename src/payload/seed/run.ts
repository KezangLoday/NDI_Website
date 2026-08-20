/**
 * `pnpm seed` — the CLI wrapper around `seed()`.
 *
 * Run through `payload run`, which loads the config, the environment and the
 * TypeScript for us. The separation between this file and `seed()` is what lets
 * the integration tests call the same seed against a test database without
 * spawning a process.
 */
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

/*
 * The Postgres pool keeps the process alive, and `payload run` does not close it
 * for us. Exiting explicitly is what makes `pnpm seed` terminate rather than
 * hang after printing its summary.
 */
process.exit(0);
