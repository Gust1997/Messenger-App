import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "../trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../shared/trpc";

type Props = { activeThreadId: number | null };

type RouterOutputs = inferRouterOutputs<AppRouter>;
type MessagesList = RouterOutputs["messages"]["list"];
type Message = MessagesList[number];

export default function ChatWindow({ activeThreadId }: Props) {
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const userId = useMemo(() => {
    const raw = sessionStorage.getItem("userId");
    return raw ? Number(raw) : null;
  }, []);

  // Load existing messages for the selected thread
  const { data: history } = trpc.messages.list.useQuery(
    { threadId: activeThreadId ?? 0 },
    { enabled: !!activeThreadId }
  );

  // Local render state
  const [messages, setMessages] = useState<Message[]>([]);

  // Hydrate when thread changes or history arrives
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }
    if (history) setMessages(history);
  }, [activeThreadId, history]);

  // Subscribe to new messages in this thread
  trpc.messages.onMessage.useSubscription(
    { threadId: activeThreadId ?? 0 },
    {
      enabled: !!activeThreadId,
      onData: (msg) => {
        setMessages((prev) => [...prev, msg]);
        // Auto-scroll to bottom
        requestAnimationFrame(() => {
          scrollerRef.current?.scrollTo({
            top: scrollerRef.current.scrollHeight,
            behavior: "smooth",
          });
        });
      },
    }
  );

  // Mutation to send a message
  const sendMutation = trpc.messages.send.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeThreadId || !userId) return;

    sendMutation.mutate({
      threadId: activeThreadId,
      senderId: userId,
      content: input.trim(),
    });

    setInput("");
  };

  // Empty state if no chat selected
  if (!activeThreadId) {
    return (
      <section className="flex-1 bg-gray-800 text-white flex items-center justify-center">
        <div className="text-slate-400">Select a chat to start messaging</div>
      </section>
    );
  }

  return (
    <section className="flex-1 bg-gray-800 text-white flex flex-col">
      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => {
          const isMine = m.senderId === userId;
          const created =
            typeof m.createdAt === "string"
              ? new Date(m.createdAt)
              : m.createdAt;
          return (
            <div
              key={m.id}
              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                isMine ? "bg-blue-600 ml-auto" : "bg-gray-700"
              }`}
              title={created ? created.toLocaleString() : ""}
            >
              {m.content}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-gray-700 p-3"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
