import { z } from "zod";

export const NoticeSourceValidation = {
  createNoticeSource: z.object({
    body: z.object({
      categoryId: z.string().uuid("Invalid Category ID format"),
      name: z.string().min(2, "Source name must be at least 2 characters"),
      listUrl: z.string().url("Valid URL is required"),
      scraperType: z.enum(["html", "rss"]).default("html"),
      config: z
        .object({
          itemSelector: z.string().optional(),
          titleSelector: z.string().optional(),
          linkSelector: z.string().optional(),
          linkAttr: z.string().optional(),
          dateSelector: z.string().optional(),
          dateFormat: z.string().optional(),
          maxItems: z.number().int().positive().optional(),
          headers: z.record(z.string()).optional(),
        })
        .passthrough()
        .default({}),
      isActive: z.boolean().default(true),
      fetchIntervalMinutes: z.number().int().min(10).default(180),
    }),
  }),

  updateNoticeSource: z.object({
    body: z.object({
      categoryId: z.string().uuid().optional(),
      name: z.string().min(2).optional(),
      listUrl: z.string().url().optional(),
      scraperType: z.enum(["html", "rss"]).optional(),
      config: z.record(z.any()).optional(),
      isActive: z.boolean().optional(),
      fetchIntervalMinutes: z.number().int().min(10).optional(),
    }),
  }),
};

export const NoticeValidation = {
  createManualNotice: z.object({
    body: z.object({
      categoryId: z.string().uuid("Invalid Category ID format"),
      title: z.string().min(3, "Title must be at least 3 characters"),
      url: z.string().url("Valid URL is required"),
      publishedAt: z.string().datetime().optional().nullable(),
    }),
  }),

  updateNotice: z.object({
    body: z.object({
      categoryId: z.string().uuid().optional(),
      title: z.string().min(3).optional(),
      url: z.string().url().optional(),
      isHidden: z.boolean().optional(),
    }),
  }),
};
