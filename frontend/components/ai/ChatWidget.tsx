"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  Bot,
  MessageSquare,
  Pencil,
  Plus,
  SendHorizontal,
  Trash2,
  User,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslation, type Dict } from "@/lib/i18n";

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ApiError = Error & { status?: number };

type DialogState =
  | {
      type: "rename";
      conversation: Conversation;
      title: string;
    }
  | {
      type: "delete";
      conversation: Conversation;
    }
  | null;

const STARTERS: Dict<string>[] = [
<<<<<<< HEAD
  {
    bn: "পাসপোর্ট কীভাবে নবায়ন করব?",
    en: "How can I renew my passport?",
  },
=======
  { bn: "পাসপোর্ট কীভাবে নবায়ন করব?", en: "How can I renew my passport?" },
>>>>>>> DEV
  {
    bn: "NID সংশোধনে কী কী ডকুমেন্ট লাগবে?",
    en: "What documents do I need for NID correction?",
  },
  {
    bn: "ড্রাইভিং লাইসেন্সের ফি কত?",
    en: "How much is the driving licence fee?",
  },
];

const STRINGS = {
  bn: {
    subtitle: "এআই সহকারী · উত্তর সরকারি উৎসে যাচাই করুন",
    newChat: "নতুন চ্যাট",
    history: "কথোপকথন",
    emptyHistory: "এখনো কোনো কথোপকথন নেই",
    greeting:
      "আসসালামু আলাইকুম! সরকারি সেবা, ডকুমেন্ট, ফি অথবা আবেদন প্রক্রিয়া সম্পর্কে প্রশ্ন করুন।",
    inputLabel: "সরকারি সেবা সম্পর্কে জিজ্ঞাসা করুন",
    placeholder: "ডকুমেন্ট, ফি, ধাপ সম্পর্কে জিজ্ঞাসা করুন…",
    send: "বার্তা পাঠান",
    thinking: "উত্তর তৈরি হচ্ছে...",
    loading: "কথোপকথন লোড হচ্ছে...",
    authRequired: "চ্যাট ব্যবহার করতে প্রথমে লগইন করুন।",
    missingApiUrl: "Frontend-এর API URL configure করা হয়নি।",
    connectionError: "Backend-এর সঙ্গে সংযোগ করা যাচ্ছে না।",
    genericError: "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
    renameTitle: "কথোপকথনের নাম পরিবর্তন",
    deleteTitle: "কথোপকথন মুছে ফেলবেন?",
    renameDescription: "এই চ্যাটের জন্য একটি নতুন নাম দিন।",
    deleteDescription:
      "এই কথোপকথন ও এর সব বার্তা মুছে যাবে। এই কাজটি ফিরিয়ে নেওয়া যাবে না।",
    titleLabel: "কথোপকথনের নাম",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    confirmDelete: "মুছে ফেলুন",
    titleRequired: "কথোপকথনের নাম লিখুন।",
    saving: "সংরক্ষণ হচ্ছে...",
    deleting: "মুছে ফেলা হচ্ছে...",
    noAnswer: "AI থেকে কোনো উত্তর পাওয়া যায়নি।",
    rename: "নাম পরিবর্তন",
    delete: "মুছে ফেলুন",
  },
  en: {
    subtitle: "AI assistant · verify answers with official sources",
    newChat: "New chat",
    history: "Conversations",
    emptyHistory: "No conversations yet",
    greeting:
      "Hello! Ask me about government services, documents, fees, or application procedures.",
    inputLabel: "Ask about a government service",
    placeholder: "Ask about documents, fees, steps...",
    send: "Send message",
    thinking: "Generating an answer...",
    loading: "Loading conversations...",
    authRequired: "Please log in to use the chat.",
    missingApiUrl: "The frontend API URL is not configured.",
    connectionError: "Unable to connect to the backend.",
    genericError: "The request failed. Please try again.",
    renameTitle: "Rename conversation",
    deleteTitle: "Delete conversation?",
    renameDescription: "Give this conversation a new name.",
    deleteDescription:
      "This conversation and all its messages will be deleted. This action cannot be undone.",
    titleLabel: "Conversation title",
    cancel: "Cancel",
    save: "Save changes",
    confirmDelete: "Delete conversation",
    titleRequired: "Please enter a conversation title.",
    saving: "Saving...",
    deleting: "Deleting...",
    noAnswer: "The AI did not return an answer.",
    rename: "Rename",
    delete: "Delete",
  },
};

<<<<<<< HEAD
async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_SERVER_API?.replace(/\/+$/, "");

  if (!baseUrl) {
    const error = new Error("Missing API URL") as ApiError;
    error.status = 0;
    throw error;
=======
function demoAnswer(q: string, s: (typeof STRINGS)["en"]): string {
  const lower = q.toLowerCase();
  const hit = SERVICES.find(
    (sv) =>
      lower.includes(sv.name.toLowerCase().split(" ")[0]) ||
      sv.name
        .toLowerCase()
        .split(" ")
        .some((w) => w.length > 3 && lower.includes(w)),
  );
  if (hit) {
    const docs = (hit.requiredDocuments ?? []).slice(0, 3).join("; ");
    return s.hitAnswer
      .replace("{name}", hit.name)
      .replace("{authority}", hit.authority ?? hit.department)
      .replace("{docs}", docs ? s.keyDocs.replace("{docs}", docs) : "")
      .replace("{fee}", hit.fee ?? s.defaultFee)
      .replace("{time}", hit.processingTime ?? s.varies);
>>>>>>> DEV
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    const error = new Error("Network error") as ApiError;
    error.status = -1;
    throw error;
  }

  const payload = (await response
    .json()
    .catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || payload?.success !== true) {
    const error = new Error(payload?.message ?? "Request failed") as ApiError;
    error.status = response.status;
    throw error;
  }

  return payload.data;
}

export function ChatWidget() {
  const { t } = useTranslation();
  const s = t(STRINGS);

<<<<<<< HEAD
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogBusy, setDialogBusy] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const bottom = useRef<HTMLDivElement>(null);
  const messageLoadRequest = useRef(0);

  const errorMessage = useCallback(
    (value: unknown) => {
      const err = value as ApiError;

      if (err?.status === 401 || err?.status === 403) {
        return s.authRequired;
      }
      if (err?.status === 0) {
        return s.missingApiUrl;
      }
      if (err?.status === -1) {
        return s.connectionError;
      }
      return s.genericError;
    },
    [s.authRequired, s.connectionError, s.genericError, s.missingApiUrl],
  );

  const loadMessages = useCallback(
    async (conversationId: string) => {
      const requestId = ++messageLoadRequest.current;
      setActiveId(conversationId);
      setMessages([]);
      setError(null);

      try {
        const result = await apiRequest<{
          conversationId: string;
          messages: Message[];
        }>(`/ai/conversations/${conversationId}/messages`);

        // Ignore stale responses if the user switched conversations meanwhile.
        if (requestId === messageLoadRequest.current) {
          setMessages(result.messages);
        }
      } catch (err) {
        if (requestId === messageLoadRequest.current) {
          setError(errorMessage(err));
        }
      }
    },
    [errorMessage],
  );

  const loadConversations = useCallback(async () => {
    try {
      const result = await apiRequest<Conversation[]>("/ai/conversations");
      setConversations(result);

      // Restore the most recently updated conversation on initial load.
      if (result.length > 0) {
        await loadMessages(result[0].id);
      } else {
        messageLoadRequest.current += 1;
        setActiveId(null);
        setMessages([]);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setHistoryLoading(false);
    }
  }, [errorMessage, loadMessages]);

  useEffect(() => {
    async function initialize() {
      await loadConversations();
    }

    void initialize();
  }, [loadConversations]);

  useEffect(() => {
    bottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  async function createConversation(): Promise<Conversation | null> {
    setError(null);

    try {
      const conversation = await apiRequest<Conversation>("/ai/conversations", {
        method: "POST",
      });

      messageLoadRequest.current += 1;
      setConversations((current) => [
        conversation,
        ...current.filter((item) => item.id !== conversation.id),
      ]);
      setActiveId(conversation.id);
      setMessages([]);

      return conversation;
    } catch (err) {
      setError(errorMessage(err));
      return null;
    }
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || pending) return;

    setError(null);
    setInput("");
    setPending(true);

    try {
      let conversationId = activeId;

      if (!conversationId) {
        const conversation = await createConversation();
        if (!conversation) return;
        conversationId = conversation.id;
      }

      setMessages((current) => [
        ...current,
        { role: "user", content: question },
      ]);

      const result = await apiRequest<{
        answer: string;
        conversationId: string;
      }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          conversationId,
          message: question,
        }),
      });

      if (!result.answer?.trim()) {
        throw new Error(s.noAnswer);
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.answer },
      ]);

      // Refresh the list so the generated title and updated time are current.
      const updated = await apiRequest<Conversation[]>("/ai/conversations");
      setConversations(updated);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  function openRenameDialog(conversation: Conversation) {
    setDialogError(null);
    setDialog({
      type: "rename",
      conversation,
      title: conversation.title,
    });
  }

  function openDeleteDialog(conversation: Conversation) {
    setDialogError(null);
    setDialog({
      type: "delete",
      conversation,
    });
  }

  function closeDialog() {
    if (dialogBusy) return;
    setDialog(null);
    setDialogError(null);
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && !dialogBusy) {
      closeDialog();
    }
  }

  async function submitRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (dialog?.type !== "rename") return;

    const { conversation } = dialog;
    const title = dialog.title.trim();

    if (!title) {
      setDialogError(s.titleRequired);
      return;
    }

    if (title === conversation.title) {
      closeDialog();
      return;
    }

    setDialogBusy(true);
    setDialogError(null);

    try {
      const updated = await apiRequest<Conversation>(
        `/ai/conversations/${conversation.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ title }),
        },
      );

      setConversations((current) =>
        current
          .map((item) => (item.id === updated.id ? updated : item))
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
      );
      setDialog(null);
      setDialogError(null);
    } catch (err) {
      setDialogError(errorMessage(err));
    } finally {
      setDialogBusy(false);
    }
  }

  async function confirmDeleteConversation() {
    if (dialog?.type !== "delete") return;

    const conversation = dialog.conversation;
    setDialogBusy(true);
    setDialogError(null);

    try {
      await apiRequest<{ id: string }>(`/ai/conversations/${conversation.id}`, {
        method: "DELETE",
      });

      const remaining = conversations.filter(
        (item) => item.id !== conversation.id,
      );
      setConversations(remaining);

      if (activeId === conversation.id) {
        messageLoadRequest.current += 1;
        setActiveId(null);
        setMessages([]);
      }

      setDialog(null);
      setDialogError(null);
    } catch (err) {
      setDialogError(errorMessage(err));
    } finally {
      setDialogBusy(false);
    }
  }

  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="flex min-w-0 flex-col rounded-2xl border border-line bg-white p-3 shadow-card">
          <Button
            type="button"
            onClick={() => void createConversation()}
            disabled={pending}
            className="mb-4 w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {s.newChat}
          </Button>

          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            {s.history}
          </p>

          <div className="max-h-72 space-y-1 overflow-y-auto lg:max-h-120">
            {historyLoading && (
              <p className="px-2 py-3 text-xs text-slate-500">{s.loading}</p>
            )}

            {!historyLoading && conversations.length === 0 && (
              <p className="px-2 py-3 text-xs leading-5 text-slate-500">
                {s.emptyHistory}
              </p>
            )}

            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group flex min-w-0 items-center gap-1 rounded-lg p-1",
                  activeId === conversation.id
                    ? "bg-brand-50"
                    : "hover:bg-canvas",
                )}
              >
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void loadMessages(conversation.id)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60",
                    activeId === conversation.id
                      ? "font-semibold text-brand-800"
                      : "text-slate-700",
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </button>

                <button
                  type="button"
                  disabled={pending}
                  onClick={() => openRenameDialog(conversation)}
                  aria-label={s.rename}
                  title={s.rename}
                  className="rounded p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-brand-700 disabled:opacity-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  disabled={pending}
                  onClick={() => openDeleteDialog(conversation)}
                  aria-label={s.delete}
                  title={s.delete}
                  className="rounded p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
=======
  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [
      ...m,
      { role: "user", text: q },
      { role: "ai", text: demoAnswer(q, s) },
    ]);
    setInput("");
    window.setTimeout(
      () =>
        bottom.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        }),
      50,
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-line bg-brand-800 px-5 py-4 text-white">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-extrabold">NagorikSheba AI</p>
          <p className="text-xs text-brand-200">{s.subtitle}</p>
        </div>
      </div>
      <div
        className="max-h-[380px] space-y-3 overflow-y-auto bg-canvas px-4 py-5 sm:px-5"
        role="log"
        aria-label={s.chatLabel}
        aria-live="polite"
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2.5",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {m.role === "ai" ? (
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : null}
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6",
                m.role === "user"
                  ? "rounded-br-md bg-brand-600 text-white"
                  : "rounded-bl-md border border-line bg-white text-slate-700",
              )}
            >
              {m.text}
            </p>
            {m.role === "user" ? (
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <User className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : null}
>>>>>>> DEV
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="flex items-center gap-3 border-b border-line bg-brand-800 px-5 py-4 text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>

            <div>
              <p className="text-sm font-extrabold">NagorikSheba AI</p>
              <p className="text-xs text-brand-200">{s.subtitle}</p>
            </div>
          </div>

          <div
            className="max-h-120 min-h-75 space-y-3 overflow-y-auto bg-canvas px-4 py-5 sm:px-5"
            role="log"
            aria-live="polite"
            aria-label={s.history}
          >
            <div className="flex justify-start gap-2.5">
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>

              <p className="max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-white px-4 py-2.5 text-sm leading-6 text-slate-700">
                {s.greeting}
              </p>
            </div>

            {messages.map((message, index) => (
              <div
                key={message.id ?? `${index}-${message.role}`}
                className={cn(
                  "flex gap-2.5",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}

                {message.role === "assistant" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-white px-4 py-2.5 text-sm leading-6 text-slate-700">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900">
                            {children}
                          </strong>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-2 list-decimal space-y-1 pl-5">
                            {children}
                          </ol>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-2 list-disc space-y-1 pl-5">
                            {children}
                          </ul>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-brand-700 underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm leading-6 text-white">
                    {message.content}
                  </p>
                )}

                {message.role === "user" && (
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <User className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </div>
            ))}

            {pending && (
              <div className="flex justify-start gap-2.5">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </span>

                <p className="rounded-2xl rounded-bl-md border border-line bg-white px-4 py-2.5 text-sm leading-6 text-slate-500">
                  {s.thinking}
                </p>
              </div>
            )}

            <div ref={bottom} />
          </div>

          <div className="border-t border-line p-3 sm:p-4">
            {error && (
              <p
                role="alert"
                className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            {messages.length === 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter.en}
                    type="button"
                    disabled={pending}
                    onClick={() => void send(t(starter))}
                    className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t(starter)}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send(input);
              }}
              className="flex gap-2"
            >
              <label htmlFor="ai-input" className="sr-only">
                {s.inputLabel}
              </label>

              <input
                id="ai-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={s.placeholder}
                disabled={pending}
                className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none disabled:opacity-60"
              />

              <Button
                type="submit"
                size="icon"
                aria-label={s.send}
                disabled={pending || !input.trim()}
              >
                <SendHorizontal className="h-4.5 w-4.5" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </section>
      </div>
<<<<<<< HEAD

      {dialog && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onKeyDown={handleDialogKeyDown}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !dialogBusy) {
              closeDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="conversation-dialog-title"
            aria-describedby="conversation-dialog-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3 border-b border-line px-5 py-4">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  dialog.type === "rename"
                    ? "bg-brand-50 text-brand-700"
                    : "bg-red-50 text-red-600",
                )}
              >
                {dialog.type === "rename" ? (
                  <Pencil className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <h2
                  id="conversation-dialog-title"
                  className="text-base font-bold text-slate-900"
                >
                  {dialog.type === "rename" ? s.renameTitle : s.deleteTitle}
                </h2>
                <p
                  id="conversation-dialog-description"
                  className="mt-1 text-sm leading-5 text-slate-500"
                >
                  {dialog.type === "rename"
                    ? s.renameDescription
                    : s.deleteDescription}
                </p>
              </div>

              <button
                type="button"
                aria-label={s.cancel}
                disabled={dialogBusy}
                onClick={closeDialog}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-canvas hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {dialog.type === "rename" ? (
              <form onSubmit={submitRename} className="p-5">
                <label
                  htmlFor="conversation-title-input"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  {s.titleLabel}
                </label>
                <input
                  id="conversation-title-input"
                  type="text"
                  autoFocus
                  maxLength={120}
                  required
                  value={dialog.title}
                  disabled={dialogBusy}
                  onChange={(event) => {
                    const title = event.target.value;
                    setDialog((current) =>
                      current?.type === "rename"
                        ? { ...current, title }
                        : current,
                    );
                    setDialogError(null);
                  }}
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-slate-800 outline-none transition-shadow placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
                  placeholder={s.titleLabel}
                />

                {dialogError && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {dialogError}
                  </p>
                )}

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={dialogBusy}
                    onClick={closeDialog}
                    className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {s.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={dialogBusy || !dialog.title.trim()}
                    className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {dialogBusy ? s.saving : s.save}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5">
                {dialogError && (
                  <p
                    role="alert"
                    className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {dialogError}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={dialogBusy}
                    onClick={closeDialog}
                    className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {s.cancel}
                  </button>
                  <button
                    type="button"
                    disabled={dialogBusy}
                    onClick={() => void confirmDeleteConversation()}
                    className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {dialogBusy ? s.deleting : s.confirmDelete}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
=======
      <div className="border-t border-line p-3 sm:p-4">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {STARTERS.map((starter) => (
            <button
              key={starter.en}
              type="button"
              onClick={() => send(t(starter))}
              className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {t(starter)}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <label htmlFor="ai-input" className="sr-only">
            {s.inputLabel}
          </label>
          <input
            id="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={s.placeholder}
            className="h-11 flex-1 rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
          <Button type="submit" size="icon" aria-label={s.send}>
            <SendHorizonal className="h-[18px] w-[18px]" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
>>>>>>> DEV
  );
}

export default ChatWidget;
