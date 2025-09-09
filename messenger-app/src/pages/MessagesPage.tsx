import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function MessagesPage() {
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar
        activeThreadId={activeThreadId}
        onSelectThread={setActiveThreadId}
      />
      <ChatWindow activeThreadId={activeThreadId} />
    </div>
  );
}