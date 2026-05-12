import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Promptia - AIを遊びながら学ぼう",
    short_name: "Promptia",
    description: "プロンプトを遊びながら身につけるAI学習アプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#10b981",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
