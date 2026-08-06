import { getNews } from "@/content";

import { NewsFeed } from "./NewsFeed";

export async function NewsSection() {
  const items = await getNews();
  return <NewsFeed items={items} />;
}
