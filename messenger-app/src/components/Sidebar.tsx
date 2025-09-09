import { useState } from "react";
import { trpc } from "../trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../shared/trpc";

type Props = {
  activeThreadId: number | null;
  onSelectThread: (id: number) => void;
};

type RouterOutputs = inferRouterOutputs<AppRouter>;
type Thread = RouterOutputs["threads"]["list"][number];

export default function Sidebar({ activeThreadId, onSelectThread }: Props) {
  const [username, setUsername] = useState("");
  const currentUser = sessionStorage.getItem("username") ?? "";

  const { data: chats, refetch } = trpc.threads.list.useQuery(
    { currentUser },
    { enabled: !!currentUser }
  );

  const createThread = trpc.threads.create.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    createThread.mutate({
      currentUser,
      targetUser: username.trim(),
    });

    setUsername("");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="p-3 border-b border-gray-800 flex gap-2"
      >
        <input
          type="text"
          placeholder="New chat username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 rounded bg-gray-800 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded"
        >
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chats?.map((chat: Thread) => {
          const otherUser =
            chat.userA.username === currentUser
              ? chat.userB.username
              : chat.userA.username;

          const isActive = activeThreadId === chat.id;

          return (
            <button
              key={chat.id}
              onClick={() => onSelectThread(chat.id)}
              className={`w-full text-left rounded-lg p-3 cursor-pointer border ${
                isActive
                  ? "bg-blue-700 border-blue-600"
                  : "bg-gray-800 hover:bg-gray-700 border-gray-700"
              }`}
            >
              {otherUser}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
