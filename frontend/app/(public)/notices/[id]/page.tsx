import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOTICES, getNoticeById } from "@/lib/data/notices";
import { NoticeHeader } from "./NoticeHeader";
import { NoticeBody } from "./NoticeBody";

export function generateStaticParams() {
  return NOTICES.map((n) => ({ id: n.id }));
}

export async function generateMetadata(
  props: PageProps<"/notices/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const notice = getNoticeById(id);
  if (!notice) return { title: "Notice not found" };
  return { title: notice.title, description: notice.summary };
}

export default async function NoticeDetailPage(props: PageProps<"/notices/[id]">) {
  const { id } = await props.params;
  const notice = getNoticeById(id);
  if (!notice) notFound();
  return (
    <>
      <NoticeHeader id={id} />
      <NoticeBody id={id} />
    </>
  );
}
