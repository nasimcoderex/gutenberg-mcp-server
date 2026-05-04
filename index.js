import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const WP_BASE_URL = process.env.WP_BASE_URL || "http://wpfunnels.local";
const WP_USER = process.env.WP_USER || "";
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || "";
const API_BASE = `${WP_BASE_URL}/wp-json/gutenberg-mcp/v1`;

function authHeader() {
  const credentials = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");
  return { Authorization: `Basic ${credentials}`, "Content-Type": "application/json" };
}

async function wpRequest(method, path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: authHeader(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);
  return data;
}

// =============================================================================
// FIGMA → GUTENBERG CONVERSION ENGINE
// =============================================================================
// These helpers run entirely in Node — no WordPress API call required.
// They translate high-level design section descriptions into Gutenberg block
// arrays that can be passed directly to create_page / create_block_pattern.

const THEME_PALETTE = {
  "primary":        "#6E42D3",
  "primary-dark":   "#5533B0",
  "primary-light":  "#8B63E8",
  "primary-subtle": "#F0EBFD",
  "accent":         "#F97316",
  "heading":        "#111827",
  "body":           "#374151",
  "muted":          "#6B7280",
  "border":         "#E5E7EB",
  "surface":        "#F9FAFB",
  "white":          "#FFFFFF",
  "black":          "#000000",
};

/** Returns theme slug if hex exactly matches a palette entry, else null. */
function matchThemeColor(hex) {
  if (!hex || typeof hex !== "string") return null;
  const h = hex.toLowerCase().trim();
  for (const [slug, value] of Object.entries(THEME_PALETTE)) {
    if (value.toLowerCase() === h) return slug;
  }
  return null;
}

/** Wraps innerBlocks in a core/group section with configurable background + spacing. */
function buildSection(innerBlocks, opts = {}) {
  const {
    background_color,
    background_gradient,
    padding_top = "80px",
    padding_bottom = "80px",
    padding_horizontal = "40px",
    align = "full",
    className = "",
    tagName = "section",
  } = opts;

  const attrs = {
    tagName,
    align,
    style: {
      spacing: {
        padding: {
          top: padding_top,
          bottom: padding_bottom,
          left: padding_horizontal,
          right: padding_horizontal,
        },
      },
    },
  };

  if (className) attrs.className = className;

  const slug = background_color ? matchThemeColor(background_color) : null;
  if (slug) {
    attrs.backgroundColor = slug;
  } else if (background_color) {
    attrs.style.color = { background: background_color };
  }
  if (background_gradient) attrs.gradient = background_gradient;

  return { blockName: "core/group", attrs, innerBlocks };
}

function heading(text, level = 2, extraAttrs = {}) {
  const tag = `h${level}`;
  return {
    blockName: "core/heading",
    attrs: { level, ...extraAttrs },
    innerContent: `<${tag} class="wp-block-heading">${text}</${tag}>`,
  };
}

function paragraph(text, extraAttrs = {}) {
  return {
    blockName: "core/paragraph",
    attrs: extraAttrs,
    innerContent: `<p>${text}</p>`,
  };
}

function image(img = {}) {
  const { url = "", alt = "", width, height, sizeSlug = "full" } = img;
  const wAttr = width ? ` width="${width}"` : "";
  const hAttr = height ? ` height="${height}"` : "";
  return {
    blockName: "core/image",
    attrs: { url, alt, sizeSlug, ...(width ? { width } : {}), ...(height ? { height } : {}) },
    innerContent: `<figure class="wp-block-image size-${sizeSlug}"><img src="${url}" alt="${alt}"${wAttr}${hAttr}/></figure>`,
  };
}

function buttons(items = [], justify = "center") {
  const justifyContent = justify === "center" ? "center" : justify === "right" ? "right" : "left";
  const buttonBlocks = items.map((btn) => {
    const isOutline = btn.style === "outline" || btn.style === "secondary";
    const className = isOutline ? "is-style-outline" : "";
    const linkClass = [
      "wp-block-button__link",
      !isOutline ? "has-primary-background-color has-white-color has-background has-text-color" : "",
      "wp-element-button",
    ].filter(Boolean).join(" ");
    return {
      blockName: "core/button",
      attrs: {
        ...(className ? { className } : {}),
        ...(!isOutline ? { backgroundColor: "primary", textColor: "white" } : {}),
        url: btn.url || "#",
      },
      innerContent: `<a class="${linkClass}" href="${btn.url || "#"}">${btn.text}</a>`,
    };
  });
  return {
    blockName: "core/buttons",
    attrs: { layout: { type: "flex", justifyContent } },
    innerBlocks: buttonBlocks,
  };
}

function badge(text, opts = {}) {
  const align = opts.align || "left";
  return {
    blockName: "core/paragraph",
    attrs: {
      className: `gwf-badge has-text-align-${align}`,
      style: {
        color: {
          background: "var(--wp--preset--color--primary-subtle)",
          text: "var(--wp--preset--color--primary)",
        },
        border: { radius: "100px" },
        spacing: { padding: { top: "5px", bottom: "5px", left: "16px", right: "16px" } },
        typography: { fontWeight: "600", fontSize: "13px" },
      },
    },
    innerContent: `<p class="gwf-badge has-text-align-${align}">${text}</p>`,
  };
}

function sectionHeader(sec, align = "center") {
  const blocks = [];
  if (sec.badge) blocks.push(badge(sec.badge, { align }));
  if (sec.heading) blocks.push(heading(sec.heading, 2, { textAlign: align }));
  if (sec.subheading) {
    blocks.push(paragraph(sec.subheading, {
      textAlign: align,
      fontSize: "lg",
      style: { color: { text: "var(--wp--preset--color--body)" } },
    }));
  }
  return { blockName: "core/group", attrs: { style: { spacing: { margin: { bottom: "56px" } } } }, innerBlocks: blocks };
}

// ---------------------------------------------------------------------------
// Section builders — one per Figma section type
// ---------------------------------------------------------------------------

function buildHero(s) {
  const align = s.text_align || "center";
  const inner = [];
  if (s.badge) inner.push(badge(s.badge, { align }));
  if (s.heading) inner.push(heading(s.heading, 1, { textAlign: align, style: { typography: { lineHeight: "1.1" } } }));
  if (s.subheading) inner.push(paragraph(s.subheading, { textAlign: align, fontSize: "lg" }));
  if (s.image) inner.push(image({ ...s.image, ...(align === "center" ? {} : {}) }));

  const btns = [
    ...(s.primary_button   ? [{ ...s.primary_button,   style: "primary"  }] : []),
    ...(s.secondary_button ? [{ ...s.secondary_button, style: "outline"  }] : []),
  ];
  if (btns.length) inner.push(buttons(btns, align));

  return buildSection(inner, { ...s, padding_top: s.padding_top || "100px", padding_bottom: s.padding_bottom || "100px", className: "gwf-hero" });
}

function buildHeroSplit(s) {
  const imgPos = s.image_position || "right";
  const textInner = [];
  if (s.badge) textInner.push(badge(s.badge));
  if (s.heading) textInner.push(heading(s.heading, 1));
  if (s.subheading) textInner.push(paragraph(s.subheading, { fontSize: "lg" }));

  const btns = [
    ...(s.primary_button   ? [{ ...s.primary_button,   style: "primary" }] : []),
    ...(s.secondary_button ? [{ ...s.secondary_button, style: "outline" }] : []),
  ];
  if (btns.length) textInner.push(buttons(btns, "left"));

  const textCol = { blockName: "core/column", attrs: { verticalAlignment: "center" }, innerBlocks: textInner };
  const imgCol  = { blockName: "core/column", attrs: { verticalAlignment: "center" }, innerBlocks: s.image ? [image(s.image)] : [] };
  const cols    = {
    blockName: "core/columns",
    attrs: { isStackedOnMobile: true, verticalAlignment: "center" },
    innerBlocks: imgPos === "left" ? [imgCol, textCol] : [textCol, imgCol],
  };

  return buildSection([cols], { ...s, padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-hero-split" });
}

function buildFeaturesGrid(s) {
  const cols    = s.columns || 3;
  const items   = s.items  || [];
  const inner   = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  const cardCols = items.map((item) => {
    const card = [];
    if (item.icon) card.push(image({ url: item.icon, alt: item.title || "", width: 48, height: 48 }));
    if (item.title) card.push(heading(item.title, 4));
    if (item.description) card.push(paragraph(item.description));
    if (item.link) {
      card.push({
        blockName: "core/buttons",
        attrs: {},
        innerBlocks: [{
          blockName: "core/button",
          attrs: { className: "is-style-outline", url: item.link.url || "#" },
          innerContent: `<a class="wp-block-button__link wp-element-button" href="${item.link.url || "#"}">${item.link.text || "Learn more"}</a>`,
        }],
      });
    }
    return {
      blockName: "core/column",
      attrs: {
        style: {
          border: { radius: "12px", color: "var(--wp--preset--color--border)", width: "1px", style: "solid" },
          spacing: { padding: { top: "32px", bottom: "32px", left: "24px", right: "24px" } },
          color: { background: "#FFFFFF" },
        },
        className: "gwf-feature-card",
      },
      innerBlocks: card,
    };
  });

  inner.push({ blockName: "core/columns", attrs: { columns: Math.min(cols, cardCols.length || cols) }, innerBlocks: cardCols });

  return buildSection(inner, { ...s, background_color: s.background_color || "#F9FAFB", padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-features-grid" });
}

function buildFeaturesList(s) {
  const items = s.items || [];
  const inner = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  items.forEach((item, i) => {
    const textBlocks = [];
    if (item.badge) textBlocks.push(badge(item.badge));
    if (item.title) textBlocks.push(heading(item.title, 3));
    if (item.description) textBlocks.push(paragraph(item.description));
    if (item.button) textBlocks.push(buttons([{ ...item.button, style: "primary" }], "left"));

    const textCol = { blockName: "core/column", attrs: { verticalAlignment: "center" }, innerBlocks: textBlocks };
    const imgCol  = { blockName: "core/column", attrs: { verticalAlignment: "center" }, innerBlocks: item.image ? [image(item.image)] : [] };
    const isEven  = i % 2 === 0;

    inner.push({
      blockName: "core/columns",
      attrs: { isStackedOnMobile: true, verticalAlignment: "center", style: { spacing: { margin: { bottom: i < items.length - 1 ? "80px" : "0" } } } },
      innerBlocks: isEven ? [textCol, imgCol] : [imgCol, textCol],
    });
  });

  return buildSection(inner, { ...s, padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-features-list" });
}

function buildPricing(s) {
  const items = s.items || [];
  const cols  = s.columns || 3;
  const inner = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  const cardCols = items.map((plan) => {
    const isFeatured = !!plan.featured;
    const card = [];

    if (plan.badge) {
      card.push(paragraph(plan.badge, {
        className: "gwf-pricing-badge",
        style: {
          color: { background: "var(--wp--preset--color--primary)", text: "#FFFFFF" },
          border: { radius: "100px" },
          spacing: { padding: { top: "3px", bottom: "3px", left: "12px", right: "12px" } },
          typography: { fontSize: "12px", fontWeight: "600" },
        },
      }));
    }
    if (plan.name) card.push(heading(plan.name, 5));
    if (plan.price !== undefined) {
      card.push({
        blockName: "core/heading",
        attrs: {
          level: 3,
          style: { typography: { fontSize: "48px", fontWeight: "700" }, color: { text: isFeatured ? "#FFFFFF" : "var(--wp--preset--color--heading)" } },
        },
        innerContent: `<h3 class="wp-block-heading">${plan.price}${plan.period ? `<small style="font-size:16px;font-weight:400;opacity:0.7">/${plan.period}</small>` : ""}</h3>`,
      });
    }
    if (plan.description) card.push(paragraph(plan.description, { style: { color: { text: isFeatured ? "rgba(255,255,255,0.8)" : "var(--wp--preset--color--muted)" } } }));

    if (plan.features?.length) {
      card.push({
        blockName: "core/list",
        attrs: { className: "gwf-pricing-features" },
        innerContent: `<ul class="wp-block-list gwf-pricing-features">${plan.features.map((f) => `<li>${f}</li>`).join("")}</ul>`,
      });
    }

    if (plan.button) {
      card.push({
        blockName: "core/buttons",
        attrs: {},
        innerBlocks: [{
          blockName: "core/button",
          attrs: {
            width: 100,
            backgroundColor: isFeatured ? "white" : "primary",
            textColor: isFeatured ? "primary" : "white",
            url: plan.button.url || "#",
          },
          innerContent: `<a class="wp-block-button__link wp-element-button" href="${plan.button.url || "#"}">${plan.button.text || "Get Started"}</a>`,
        }],
      });
    }

    return {
      blockName: "core/column",
      attrs: {
        className: `gwf-pricing-card${isFeatured ? " gwf-pricing-card--featured" : ""}`,
        style: {
          border: { radius: "16px", color: isFeatured ? "var(--wp--preset--color--primary)" : "var(--wp--preset--color--border)", width: isFeatured ? "2px" : "1px", style: "solid" },
          spacing: { padding: { top: "40px", bottom: "40px", left: "32px", right: "32px" } },
          color: { background: isFeatured ? "var(--wp--preset--color--primary)" : "#FFFFFF" },
        },
      },
      innerBlocks: card,
    };
  });

  inner.push({ blockName: "core/columns", attrs: { columns: cols }, innerBlocks: cardCols });

  return buildSection(inner, { ...s, padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-pricing" });
}

function buildTestimonials(s) {
  const items = s.items || [];
  const cols  = s.columns || 3;
  const inner = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  const cardCols = items.map((t) => {
    const card = [];
    if (t.quote) {
      card.push({
        blockName: "core/quote",
        attrs: {},
        innerBlocks: [paragraph(t.quote)],
      });
    }
    if (t.name || t.role || t.avatar) {
      const authorBlocks = [];
      if (t.avatar) authorBlocks.push(image({ url: t.avatar, alt: t.name || "", width: 48, height: 48 }));
      if (t.name || t.role) {
        authorBlocks.push(paragraph(
          [t.name && `<strong>${t.name}</strong>`, t.role].filter(Boolean).join(" &middot; "),
          { className: "gwf-testimonial-author", style: { color: { text: "var(--wp--preset--color--muted)" }, typography: { fontSize: "14px" } } }
        ));
      }
      card.push({
        blockName: "core/group",
        attrs: { layout: { type: "flex", flexWrap: "nowrap", verticalAlignment: "center" }, style: { spacing: { blockGap: "12px", margin: { top: "20px" } } } },
        innerBlocks: authorBlocks,
      });
    }
    if (t.rating) {
      const stars = "★".repeat(Math.min(5, t.rating)) + "☆".repeat(Math.max(0, 5 - t.rating));
      card.push(paragraph(stars, { style: { color: { text: "#F59E0B" } } }));
    }
    return {
      blockName: "core/column",
      attrs: {
        style: {
          border: { radius: "12px", color: "var(--wp--preset--color--border)", width: "1px", style: "solid" },
          spacing: { padding: { top: "32px", bottom: "32px", left: "24px", right: "24px" } },
          color: { background: "#FFFFFF" },
        },
      },
      innerBlocks: card,
    };
  });

  inner.push({ blockName: "core/columns", attrs: { columns: cols }, innerBlocks: cardCols });

  return buildSection(inner, { ...s, background_color: s.background_color || "#F9FAFB", padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-testimonials" });
}

function buildCTA(s) {
  const align = s.text_align || "center";
  const inner = [];

  if (s.badge) inner.push(badge(s.badge, { align }));
  if (s.heading) inner.push(heading(s.heading, 2, { textAlign: align, style: { color: { text: "#FFFFFF" } } }));
  if (s.subheading) inner.push(paragraph(s.subheading, { textAlign: align, fontSize: "lg", style: { color: { text: "rgba(255,255,255,0.85)" } } }));

  const btns = [
    ...(s.primary_button   ? [{ ...s.primary_button,   style: "primary"  }] : []),
    ...(s.secondary_button ? [{ ...s.secondary_button, style: "outline"  }] : []),
  ];
  if (btns.length) inner.push(buttons(btns, align));

  // CTA sections default to primary purple background
  const bgColor = s.background_color || "#6E42D3";

  return buildSection(inner, { ...s, background_color: bgColor, padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-cta" });
}

function buildStats(s) {
  const items = s.items || [];
  const inner = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  const statCols = items.map((stat) => ({
    blockName: "core/column",
    attrs: { style: { spacing: { padding: { top: "20px", bottom: "20px" } } } },
    innerBlocks: [
      {
        blockName: "core/heading",
        attrs: { level: 3, textAlign: "center", style: { typography: { fontSize: "48px", fontWeight: "700" }, color: { text: "var(--wp--preset--color--primary)" } } },
        innerContent: `<h3 class="wp-block-heading has-text-align-center">${stat.value}</h3>`,
      },
      paragraph(stat.label, { textAlign: "center", style: { color: { text: "var(--wp--preset--color--muted)" } } }),
      ...(stat.description ? [paragraph(stat.description, { textAlign: "center", fontSize: "sm", style: { color: { text: "var(--wp--preset--color--muted)" } } })] : []),
    ],
  }));

  inner.push({ blockName: "core/columns", attrs: {}, innerBlocks: statCols });

  return buildSection(inner, { ...s, padding_top: s.padding_top || "60px", padding_bottom: s.padding_bottom || "60px", className: "gwf-stats" });
}

function buildFAQ(s) {
  const items = s.items || [];
  const inner = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  items.forEach((item) => {
    inner.push({
      blockName: "core/details",
      attrs: {
        className: "gwf-faq-item",
        style: {
          border: { bottom: { color: "var(--wp--preset--color--border)", width: "1px", style: "solid" } },
          spacing: { padding: { top: "20px", bottom: "20px" } },
        },
      },
      innerBlocks: [
        { blockName: "core/summary", attrs: {}, innerContent: `<summary>${item.question}</summary>` },
        paragraph(item.answer),
      ],
    });
  });

  return buildSection(inner, { ...s, padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-faq" });
}

function buildTeam(s) {
  const items = s.items || [];
  const cols  = s.columns || 4;
  const inner = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  const memberCols = items.map((m) => {
    const card = [];
    if (m.photo) card.push(image({ url: m.photo, alt: m.name || "", width: 120, height: 120 }));
    if (m.name) card.push(heading(m.name, 5, { textAlign: "center" }));
    if (m.role) card.push(paragraph(m.role, { textAlign: "center", style: { color: { text: "var(--wp--preset--color--muted)" } } }));
    if (m.bio) card.push(paragraph(m.bio, { textAlign: "center", fontSize: "sm" }));
    return {
      blockName: "core/column",
      attrs: { className: "gwf-team-member", style: { spacing: { padding: { top: "24px", bottom: "24px" } } } },
      innerBlocks: card,
    };
  });

  inner.push({ blockName: "core/columns", attrs: { columns: cols }, innerBlocks: memberCols });

  return buildSection(inner, { ...s, padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-team" });
}

function buildLogos(s) {
  const items = s.items || [];
  const inner = [];

  if (s.heading) inner.push(paragraph(s.heading, { textAlign: "center", style: { color: { text: "var(--wp--preset--color--muted)" }, typography: { fontWeight: "500", fontSize: "14px" } } }));

  const logoCols = items.map((logo) => ({
    blockName: "core/column",
    attrs: { verticalAlignment: "center", className: "has-text-align-center" },
    innerBlocks: [image({ url: logo.url, alt: logo.alt || logo.name || "", width: logo.width || 120, height: logo.height || 40 })],
  }));

  inner.push({ blockName: "core/columns", attrs: { verticalAlignment: "center" }, innerBlocks: logoCols });

  return buildSection(inner, { ...s, background_color: s.background_color || "#F9FAFB", padding_top: s.padding_top || "40px", padding_bottom: s.padding_bottom || "40px", padding_horizontal: "40px", className: "gwf-logos" });
}

function buildTextImage(s) {
  const imgPos = s.image_position || "right";
  const inner  = [];
  if (s.badge) inner.push(badge(s.badge));
  if (s.heading) inner.push(heading(s.heading, 3));
  const content = s.content || [];
  (Array.isArray(content) ? content : [content]).forEach((p) => inner.push(paragraph(p)));
  if (s.primary_button) inner.push(buttons([{ ...s.primary_button, style: "primary" }], "left"));

  return {
    blockName: "core/media-text",
    attrs: {
      mediaType: "image",
      mediaPosition: imgPos === "left" ? "left" : "right",
      mediaUrl: s.image?.url || "",
      mediaAlt: s.image?.alt || "",
      isStackedOnMobile: true,
      align: "full",
      style: { spacing: { padding: { top: s.padding_top || "80px", bottom: s.padding_bottom || "80px", left: "40px", right: "40px" } } },
    },
    innerBlocks: inner,
  };
}

function buildTabs(s) {
  const items = s.tabs || [];
  const inner = [];

  if (s.heading || s.subheading || s.badge) inner.push(sectionHeader(s));

  const tabBlocks = items.map((tab, i) => ({
    blockName: "gwf/tab",
    attrs: { title: tab.title, active: i === 0 },
    // tabs can contain arbitrary blocks or just text content
    innerBlocks: tab.blocks
      ? tab.blocks
      : tab.content
        ? [paragraph(tab.content)]
        : tab.image
          ? [image(tab.image)]
          : [],
  }));

  inner.push({ blockName: "gwf/tabs", attrs: { style: "" }, innerBlocks: tabBlocks });

  return buildSection(inner, { ...s, padding_top: s.padding_top || "80px", padding_bottom: s.padding_bottom || "80px", className: "gwf-tabs-section" });
}

function buildText(s) {
  const align = s.text_align || "left";
  const inner = [];
  if (s.badge) inner.push(badge(s.badge, { align }));
  if (s.heading) inner.push(heading(s.heading, 2, { textAlign: align }));
  const content = s.content || [];
  (Array.isArray(content) ? content : [content]).forEach((p) => inner.push(paragraph(p, { textAlign: align })));
  return buildSection(inner, { ...s, padding_top: s.padding_top || "60px", padding_bottom: s.padding_bottom || "60px" });
}

function buildBanner(s) {
  const inner = [];
  if (s.text) inner.push(paragraph(s.text, { textAlign: "center", style: { color: { text: s.text_color || "#FFFFFF" }, typography: { fontWeight: "500" } } }));
  if (s.link) {
    inner.push({
      blockName: "core/buttons",
      attrs: { layout: { type: "flex", justifyContent: "center" } },
      innerBlocks: [{
        blockName: "core/button",
        attrs: { className: "is-style-outline", url: s.link.url || "#" },
        innerContent: `<a class="wp-block-button__link wp-element-button" href="${s.link.url || "#"}">${s.link.text}</a>`,
      }],
    });
  }
  return buildSection(inner, { ...s, background_color: s.background_color || "#6E42D3", padding_top: s.padding_top || "14px", padding_bottom: s.padding_bottom || "14px", className: "gwf-banner" });
}

function buildSpacer(s) {
  return { blockName: "core/spacer", attrs: { height: s.height || "60px" } };
}

function buildDivider() {
  return {
    blockName: "core/separator",
    attrs: { className: "is-style-wide", style: { color: { text: "var(--wp--preset--color--border)" } } },
  };
}

/** Main dispatcher — maps section.type → builder function. */
function sectionToBlocks(section) {
  const builders = {
    "hero":          buildHero,
    "hero-split":    buildHeroSplit,
    "features-grid": buildFeaturesGrid,
    "features-list": buildFeaturesList,
    "pricing":       buildPricing,
    "testimonials":  buildTestimonials,
    "cta":           buildCTA,
    "stats":         buildStats,
    "faq":           buildFAQ,
    "team":          buildTeam,
    "logos":         buildLogos,
    "text-image":    buildTextImage,
    "tabs":          buildTabs,
    "text":          buildText,
    "banner":        buildBanner,
    "spacer":        buildSpacer,
    "divider":       buildDivider,
  };

  const fn = builders[section.type];
  if (fn) return fn(section);
  // "custom" type — pass raw blocks through unchanged
  if (section.type === "custom" && section.blocks) return section.blocks;
  // Unknown type — wrap content as generic text section
  return buildText(section);
}

// =============================================================================
// SHARED BLOCK DESCRIPTOR SCHEMA
// =============================================================================

const BLOCK_DESCRIPTOR = {
  type: "object",
  properties: {
    blockName:    { type: "string" },
    attrs:        { type: "object" },
    innerContent: { type: "string" },
    innerBlocks:  { type: "array", items: { "$ref": "#" } },
  },
  required: ["blockName"],
};

const BLOCKS_PARAM = {
  type: "array",
  description: `Gutenberg block descriptors with innerBlocks support.

LAYOUT BLOCKS (use innerBlocks):
  core/columns → core/column children
  core/group / core/cover → any child blocks
  gwf/tabs → gwf/tab children

THEME BLOCKS:
  getwpfunnels/pricing-block, getwpfunnels/pricing-hero-block
  gwf/tabs, gwf/tab

STYLING:
  attrs.style.color.background  — custom hex
  attrs.backgroundColor         — theme slug (primary, white, surface…)
  attrs.className               — Tailwind classes (gwpf- prefix)
  attrs.align: 'wide' | 'full'  — full-width sections`,
  items: BLOCK_DESCRIPTOR,
};

// section descriptor shared by figma_section_to_blocks + figma_design_to_page
const SECTION_SCHEMA = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["hero", "hero-split", "features-grid", "features-list", "pricing", "testimonials", "cta", "stats", "faq", "team", "logos", "text-image", "tabs", "text", "banner", "spacer", "divider", "custom"],
      description: `Section type determines the block layout generated:
  hero           — centered full-width hero with bg, heading, subheading, buttons, optional image
  hero-split     — two-column hero: text left + image right (or reversed)
  features-grid  — 3/4-column card grid with icon, title, description per card
  features-list  — alternating text+image rows (even = text-left, odd = text-right)
  pricing        — pricing plan cards, supports featured card highlight
  testimonials   — quote cards with author avatar + name + role
  cta            — centered call-to-action banner (defaults to primary purple bg)
  stats          — row of large number + label stat items
  faq            — accordion FAQ using core/details
  team           — team member grid with photo, name, role
  logos          — logo strip (partner/client logos)
  text-image     — core/media-text split (image + rich text side by side)
  tabs           — gwf/tabs with gwf/tab children
  text           — plain heading + paragraph(s)
  banner         — thin top/announcement banner
  spacer         — vertical whitespace
  divider        — horizontal separator line
  custom         — pass raw blocks[] array directly (escape hatch)`,
    },
    // Background
    background_color:    { type: "string", description: "Hex color or theme slug. CTA defaults to #6E42D3, features/testimonials default to #F9FAFB." },
    background_gradient: { type: "string", description: "CSS gradient string e.g. 'linear-gradient(135deg,#6E42D3,#8B63E8)'" },
    // Spacing
    padding_top:         { type: "string", description: "e.g. '80px', '120px'" },
    padding_bottom:      { type: "string", description: "e.g. '80px'" },
    padding_horizontal:  { type: "string", description: "e.g. '40px'" },
    // Common content
    badge:      { type: "string", description: "Small pill label above heading e.g. 'New Feature' or 'Trusted by 10,000+'" },
    heading:    { type: "string", description: "Main section heading text" },
    subheading: { type: "string", description: "Secondary text below heading" },
    text_align: { type: "string", enum: ["left", "center", "right"], description: "Text alignment (default: center for most sections, left for split)" },
    primary_button: {
      type: "object",
      properties: { text: { type: "string" }, url: { type: "string" } },
      description: "Primary CTA button (filled purple)",
    },
    secondary_button: {
      type: "object",
      properties: { text: { type: "string" }, url: { type: "string" } },
      description: "Secondary CTA button (outline style)",
    },
    image: {
      type: "object",
      properties: { url: { type: "string" }, alt: { type: "string" }, width: { type: "number" }, height: { type: "number" } },
      description: "Image for hero, hero-split, text-image sections",
    },
    image_position: { type: "string", enum: ["left", "right"], description: "Image side for hero-split and text-image sections" },
    columns: { type: "number", description: "Number of columns for features-grid, testimonials, team, pricing (default: 3)" },
    items: {
      type: "array",
      description: `Items array — structure varies by type:
  features-grid:  [{icon, title, description, link:{text,url}}]
  features-list:  [{badge, title, description, image, button:{text,url}}]
  pricing:        [{name, badge, price, period, description, features:[], button:{text,url}, featured:bool}]
  testimonials:   [{quote, name, role, avatar, rating}]
  stats:          [{value, label, description}]
  team:           [{name, role, photo, bio}]
  logos:          [{url, alt, name, width, height}]
  faq:            [{question, answer}]`,
      items: { type: "object" },
    },
    tabs: {
      type: "array",
      description: "Tabs array for 'tabs' section type: [{title, content, image, blocks:[]}]",
      items: { type: "object" },
    },
    content: {
      description: "Text content — string or array of strings — for 'text' and 'text-image' sections",
    },
    height: { type: "string", description: "Height for 'spacer' type e.g. '60px'" },
    // Escape hatch for custom type
    blocks: { type: "array", description: "Raw block array for 'custom' type", items: BLOCK_DESCRIPTOR },
  },
  required: ["type"],
};

// =============================================================================
// TOOL DEFINITIONS
// =============================================================================

const TOOLS = [
  // ── Figma conversion ────────────────────────────────────────────────────────
  {
    name: "figma_section_to_blocks",
    description: `Convert ONE Figma design section into a Gutenberg blocks array.

WORKFLOW:
1. Look at the Figma design (screenshot or export)
2. Identify each visual section and its type (hero, features-grid, pricing, etc.)
3. Call this tool once per section to get the block array
4. Combine all returned blocks and pass to create_page

Returns a blocks array ready for create_page or create_block_pattern.
Use figma_design_to_page to convert all sections + create the page in one call.`,
    inputSchema: { type: "object", properties: { section: SECTION_SCHEMA }, required: ["section"] },
  },
  {
    name: "figma_design_to_page",
    description: `Convert a FULL Figma page design into a WordPress page in one call.

WORKFLOW:
1. Analyze the Figma design — identify every section top-to-bottom
2. Describe each section using the sections array
3. Call this tool — it converts all sections to blocks AND creates the WordPress page
4. Returns the created page with ID, link, and block count

Always call get_theme_styles first to know the available colors, fonts, and page templates.

SECTION ORDER matters — sections are rendered top-to-bottom exactly as provided.`,
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "WordPress page title" },
        status: { type: "string", enum: ["draft", "publish", "pending", "private"], description: "Page status (default: draft)" },
        template: { type: "string", description: "Page template filename. Use get_theme_styles to see options." },
        parent: { type: "number", description: "Parent page ID if creating a subpage" },
        sections: {
          type: "array",
          description: "All sections of the Figma design, top to bottom",
          items: SECTION_SCHEMA,
        },
      },
      required: ["title", "sections"],
    },
  },

  // ── Page management ─────────────────────────────────────────────────────────
  {
    name: "analyze_reference_page",
    description: "Analyze a WordPress page URL to extract its complete block structure. Use this to understand an existing page's layout before replicating it.",
    inputSchema: {
      type: "object",
      properties: { url: { type: "string", description: "Full URL of the page to analyze" } },
      required: ["url"],
    },
  },
  {
    name: "list_pages",
    description: "List all WordPress pages with block count and metadata",
    inputSchema: {
      type: "object",
      properties: {
        per_page: { type: "number" },
        page:     { type: "number" },
        search:   { type: "string" },
        parent:   { type: "number", description: "Filter by parent page ID" },
      },
    },
  },
  {
    name: "get_page",
    description: "Get a WordPress page by ID including all parsed Gutenberg blocks",
    inputSchema: {
      type: "object",
      properties: { id: { type: "number" } },
      required: ["id"],
    },
  },
  {
    name: "create_page",
    description: "Create a new WordPress page with Gutenberg blocks. Supports full nested layouts via innerBlocks.",
    inputSchema: {
      type: "object",
      properties: {
        title:    { type: "string" },
        status:   { type: "string", enum: ["draft", "publish", "pending", "private"], description: "Default: draft" },
        template: { type: "string", description: "Page template filename" },
        parent:   { type: "number" },
        blocks:   BLOCKS_PARAM,
      },
      required: ["title"],
    },
  },
  {
    name: "update_page",
    description: "Update an existing WordPress page",
    inputSchema: {
      type: "object",
      properties: {
        id:       { type: "number" },
        title:    { type: "string" },
        status:   { type: "string", enum: ["draft", "publish", "pending", "private", "trash"] },
        template: { type: "string" },
        parent:   { type: "number" },
        blocks:   BLOCKS_PARAM,
      },
      required: ["id"],
    },
  },
  {
    name: "delete_page",
    description: "Delete or trash a WordPress page",
    inputSchema: {
      type: "object",
      properties: {
        id:    { type: "number" },
        force: { type: "boolean", description: "true = permanent delete, false = trash" },
      },
      required: ["id"],
    },
  },

  // ── Block utilities ─────────────────────────────────────────────────────────
  {
    name: "list_block_types",
    description: "List all registered Gutenberg block types including custom theme blocks (getwpfunnels/*, gwf/*)",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_block_schema",
    description: "Get the full attribute schema for a block type. Call this before manually building blocks to know what attrs are supported.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Block name e.g. core/columns, getwpfunnels/pricing-block" } },
      required: ["name"],
    },
  },
  {
    name: "render_blocks",
    description: "Render blocks to HTML for preview before saving. Supports innerBlocks.",
    inputSchema: {
      type: "object",
      properties: { blocks: BLOCKS_PARAM },
      required: ["blocks"],
    },
  },
  {
    name: "get_theme_styles",
    description: `Get the getwpfunnels design system — CALL THIS FIRST before any Figma conversion.

Returns:
  colors        — palette slugs + hex values (use slugs in attrs.backgroundColor)
  gradients     — available gradient presets
  typography    — font families and size scale
  spacing       — spacing scale
  layout        — content width (1200px) and wide width (1400px)
  available_templates — page templates for create_page template param`,
    inputSchema: { type: "object", properties: {} },
  },

  // ── Block patterns ───────────────────────────────────────────────────────────
  {
    name: "list_block_patterns",
    description: "List reusable block patterns (synced patterns). These are saved design components.",
    inputSchema: {
      type: "object",
      properties: {
        per_page: { type: "number" },
        page:     { type: "number" },
        search:   { type: "string" },
      },
    },
  },
  {
    name: "get_block_pattern",
    description: "Get a single reusable block pattern by ID",
    inputSchema: {
      type: "object",
      properties: { id: { type: "number" } },
      required: ["id"],
    },
  },
  {
    name: "create_block_pattern",
    description: "Save a reusable block pattern — great for Figma components that appear on multiple pages (hero variants, card templates, CTA sections).",
    inputSchema: {
      type: "object",
      properties: {
        title:  { type: "string", description: "Pattern name e.g. 'Hero - Homepage', 'Pricing Card Row'" },
        status: { type: "string", enum: ["publish", "draft"], description: "Default: publish" },
        blocks: BLOCKS_PARAM,
      },
      required: ["title"],
    },
  },
  {
    name: "update_block_pattern",
    description: "Update an existing reusable block pattern",
    inputSchema: {
      type: "object",
      properties: {
        id:     { type: "number" },
        title:  { type: "string" },
        status: { type: "string", enum: ["publish", "draft"] },
        blocks: BLOCKS_PARAM,
      },
      required: ["id"],
    },
  },
  {
    name: "delete_block_pattern",
    description: "Delete a reusable block pattern",
    inputSchema: {
      type: "object",
      properties: {
        id:    { type: "number" },
        force: { type: "boolean" },
      },
      required: ["id"],
    },
  },
];

// =============================================================================
// SERVER
// =============================================================================

const server = new Server(
  { name: "gutenberg-mcp-server", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      // ── Figma conversion (pure JS — no WP API round-trip for conversion) ──
      case "figma_section_to_blocks": {
        const blocks = sectionToBlocks(args.section);
        result = { blocks: Array.isArray(blocks) ? blocks : [blocks] };
        break;
      }

      case "figma_design_to_page": {
        const { sections = [], ...pageArgs } = args;
        const allBlocks = sections.flatMap((sec) => {
          const b = sectionToBlocks(sec);
          return Array.isArray(b) ? b : [b];
        });
        result = await wpRequest("POST", "/pages", { ...pageArgs, blocks: allBlocks });
        break;
      }

      // ── Pages ──
      case "analyze_reference_page":
        result = await wpRequest("POST", "/analyze-reference", { url: args.url });
        break;

      case "list_pages": {
        const p = new URLSearchParams();
        if (args.per_page) p.set("per_page", args.per_page);
        if (args.page)     p.set("page",     args.page);
        if (args.search)   p.set("search",   args.search);
        if (args.parent)   p.set("parent",   args.parent);
        result = await wpRequest("GET", `/pages${p.toString() ? `?${p}` : ""}`);
        break;
      }

      case "get_page":
        result = await wpRequest("GET", `/pages/${args.id}`);
        break;

      case "create_page":
        result = await wpRequest("POST", "/pages", args);
        break;

      case "update_page": {
        const { id, ...body } = args;
        result = await wpRequest("PUT", `/pages/${id}`, body);
        break;
      }

      case "delete_page":
        result = await wpRequest("DELETE", `/pages/${args.id}?force=${!!args.force}`);
        break;

      // ── Block utilities ──
      case "list_block_types":
        result = await wpRequest("GET", "/block-types");
        break;

      case "get_block_schema":
        result = await wpRequest("GET", `/block-schema/${encodeURIComponent(args.name)}`);
        break;

      case "render_blocks":
        result = await wpRequest("POST", "/render-blocks", args);
        break;

      case "get_theme_styles":
        result = await wpRequest("GET", "/theme-styles");
        break;

      // ── Patterns ──
      case "list_block_patterns": {
        const p = new URLSearchParams();
        if (args.per_page) p.set("per_page", args.per_page);
        if (args.page)     p.set("page",     args.page);
        if (args.search)   p.set("search",   args.search);
        result = await wpRequest("GET", `/patterns${p.toString() ? `?${p}` : ""}`);
        break;
      }

      case "get_block_pattern":
        result = await wpRequest("GET", `/patterns/${args.id}`);
        break;

      case "create_block_pattern":
        result = await wpRequest("POST", "/patterns", args);
        break;

      case "update_block_pattern": {
        const { id, ...body } = args;
        result = await wpRequest("PUT", `/patterns/${id}`, body);
        break;
      }

      case "delete_block_pattern":
        result = await wpRequest("DELETE", `/patterns/${args.id}?force=${!!args.force}`);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
