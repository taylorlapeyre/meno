import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function NavBar({ user }: { user: User | null }) {
  return (
    <nav className="flex justify-between items-center w-full border padding p-4 my-7 rounded">
      <p>{user ? user.email : "no user"}</p>
      <div className="flex gap-4">
      <Link
        href="/enrollment"
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        View Enrollment Status
      </Link>
      <Link
        href="/logout"
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Logout
      </Link>
      </div>
    </nav>
  );
}
