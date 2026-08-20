import { media } from "../media";

import type { SeedTeamMember } from "./types";

/**
 * Prospective Payload collection: `team`.
 *
 * `tier` separates the three leadership cards from the wider team grid, which
 * the design renders at different sizes.
 *
 * Only nine photographs exist — they were recovered from the design tool's
 * sidecar, where they lived as base64 rather than as files. The remaining
 * thirteen members render a monogram until the client supplies portraits.
 */
export const team: SeedTeamMember[] = [
  {
    id: "jacques-von-benecke",
    name: "Jacques von Benecke",
    role: "Chief Executive Officer",
    tier: "leadership",
    photo: media("/media/team/jacques-von-benecke.webp", "Jacques von Benecke", 732, 412),
  },
  {
    id: "anand-acharya",
    name: "Anand Acharya",
    role: "Chief Product Officer",
    tier: "leadership",
    photo: media("/media/team/anand-acharya.webp", "Anand Acharya", 669, 732),
    photoPosition: "50% 62.6%",
  },
  {
    id: "pallavi-sharma",
    name: "Pallavi Sharma",
    role: "Chief Operations Officer",
    tier: "leadership",
    photo: media("/media/team/pallavi-sharma.webp", "Pallavi Sharma", 732, 732),
  },
  {
    id: "kinzang-dorji",
    name: "Kinzang Dorji",
    role: "Backend Developer",
    tier: "team",
    photo: media("/media/team/kinzang-dorji.webp", "Kinzang Dorji", 540, 540),
  },
  {
    id: "tshendu-gyeltshen",
    name: "Tshendu Gyeltshen",
    role: "Backend Developer",
    tier: "team",
    photo: media("/media/team/tshendu-gyeltshen.webp", "Tshendu Gyeltshen", 540, 540),
  },
  {
    id: "namgay-wangmo",
    name: "Namgay Wangmo",
    role: "Business Analyst",
    tier: "team",
    photo: media("/media/team/namgay-wangmo.webp", "Namgay Wangmo", 540, 405),
  },
  {
    id: "dev-raj-dungana",
    name: "Dev Raj Dungana",
    role: "DevOps Engineer",
    tier: "team",
    photo: media("/media/team/dev-raj-dungana.webp", "Dev Raj Dungana", 432, 540),
  },
  {
    id: "tshering-gyeltshen",
    name: "Tshering Gyeltshen",
    role: "Mobile App Developer",
    tier: "team",
    photo: media("/media/team/tshering-gyeltshen.webp", "Tshering Gyeltshen", 359, 540),
  },
  { id: "tshering-dawa", name: "Tshering Dawa", role: "Mobile App Developer", tier: "team" },
  { id: "tashi-namgay", name: "Tashi Namgay", role: "Backend Developer", tier: "team" },
  { id: "damcho-lhendup", name: "Damcho Lhendup", role: "Backend Developer", tier: "team" },
  { id: "hemanth-lepcha", name: "Hemanth Lepcha", role: "Backend Developer", tier: "team" },
  { id: "kinley-penjor", name: "Kinley Penjor", role: "Fullstack Developer", tier: "team" },
  { id: "kezang-loday", name: "Kezang Loday", role: "UI/UX Designer", tier: "team" },
  { id: "sanjeep-biswa", name: "Sanjeep Biswa", role: "Backend Developer", tier: "team" },
  { id: "biren-dahal", name: "Biren Dahal", role: "Business Analyst", tier: "team" },
  { id: "wangchuk", name: "Wangchuk", role: "Backend Developer", tier: "team" },
  { id: "sonam-tshomo", name: "Sonam Tshomo", role: "Media and PR Associate", tier: "team" },
  { id: "badal-khatiwara", name: "Badal Khatiwara", role: "Backend Developer", tier: "team" },
  {
    id: "kuenzang-pema-namgyel",
    name: "Kuenzang Pema Namgyel",
    role: "Business Analyst",
    tier: "team",
  },
  {
    id: "jigme-wangyel-wangchuk",
    name: "Jigme Wangyel Wangchuk",
    role: "Quality Assurance Engineer",
    tier: "team",
  },
];
