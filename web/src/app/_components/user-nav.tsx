"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <button
        className="btn-sign-in"
        onClick={() => signIn("google")}
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="user-nav">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt=""
          className="user-avatar"
        />
      )}
      <span className="user-name">{session.user?.name}</span>
      <button
        className="btn-sign-out"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
