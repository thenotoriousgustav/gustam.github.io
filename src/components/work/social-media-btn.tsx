import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function SocialMediaBtn({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-6 lg:space-x-10", className)}>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "link" }),
          "p-0 text-gray-400 underline",
        )}
      >
        Email
      </Link>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "link" }),
          "p-0 text-gray-400 underline",
        )}
      >
        Github
      </Link>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "link" }),
          "p-0 text-gray-400 underline",
        )}
      >
        Linkedin
      </Link>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "link" }),
          "p-0 text-gray-400 underline",
        )}
      >
        Instagram
      </Link>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "link" }),
          "p-0 text-gray-400 underline",
        )}
      >
        Spotify
      </Link>
    </div>
  );
}
