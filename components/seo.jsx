import { Helmet } from "react-helmet";

export default function SEO({
  title = "Jex",
  description = "Jex - Powerful Roblox Group Management",
  keywords = "Management, Moderation, Analytics, Roblox, Group, Bot, Easy, Free, Open, Source, Open-Source, Open Source, Simple, User-Friendly, Dashboard, Web Interface, Customizable, Features, Tools",
  image = "https://raw.githubusercontent.com/Nexora-Innovations/Jexo/refs/heads/main/.github/logo.png",
  url = "https://jexo.vercel.app",
}) {
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}