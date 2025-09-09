import React, { useState } from "react";
import { trpc } from "../trpc";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = trpc.auth.login.useMutation();

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await loginMutation.mutateAsync({username, password});
            if (res.ok) {
                console.log("Got a succeful login");
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("userId", String(res.user.id));
                navigate("/chat");
            }
        } catch (err) {
            console.log("Username or password wrong")
        }
    }
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
          <form
            className="w-full max-w-sm bg-slate-900 p-6 rounded-lg shadow-md space-y-4 text-slate-100"
            onSubmit={handleSubmit}
          >
            <h1 className="text-xl font-semibold text-center text-slate-100">
              Messages Login
            </h1>
      
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1 text-slate-300">
                Username
              </label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
      
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-slate-300">
                Password
              </label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
      
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">
              Sign In
            </button>
          </form>
        </div>
      );
}