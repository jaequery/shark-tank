import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="container">
      <header className="header">
        <h1>DEAL TANK</h1>
        <p>Sign in to pitch your company to the Investors.</p>
      </header>

      <div className="card" style={{ textAlign: "center" }}>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button type="submit" className="btn-cta">
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
