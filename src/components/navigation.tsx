import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Container from "./container";

export default function Navigation() {
  return (
    <Container as="nav" className="fixed z-50 w-full bg-white lg:static">
      <div className="flex w-full items-center justify-between border-b border-black py-6">
        <Link href="/">
          <h1 className="text-xl font-semibold tracking-tighter lg:text-3xl">
            Gustam Rheza.
          </h1>
        </Link>
        <div className="flex lg:space-x-4">
          <Button className=" font-normal" variant="ghost" asChild>
            <Link href="/">Work</Link>
          </Button>
          <Button className=" font-normal" variant="ghost" asChild>
            <Link href="/gallery">Gallery</Link>
          </Button>
          <Button className=" font-normal" variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
