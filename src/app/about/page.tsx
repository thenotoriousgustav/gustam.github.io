import Container from "@/components/container";
import SocialMediaBtn from "@/components/work/social-media-btn";
import Image from "next/image";
import React from "react";

export default function AboutPage() {
  return (
    <Container as="section" className="gap-x-6 pt-5 lg:flex lg:justify-between">
      <div className="w-full lg:w-5/12">
        <Image
          src="/me.jpeg"
          width="0"
          height="0"
          sizes="100vw"
          alt="gustam"
          className="h-[580px] w-full object-cover"
        />
      </div>
      <div className="w-full lg:w-7/12 ">
        <h1 className="mb-4 text-2xl font-bold">Hi, I&apos;am Gustam </h1>
        <p className="mb-4 tracking-tight">
          I&apos;m currently studying Information Systems, Computer Science, and
          Human-Computer Interaction at Carnegie Mellon University. I&apos;m
          originally from Maryland and am currently based in Pittsburgh.
        </p>
        <p className="mb-4 tracking-tight">
          I enjoy working on creative web tools and creating engaging
          experiences through technology. I&apos;m most interested in working on
          educational technology and examining how we can facilitate social
          connection through data.
        </p>
        <p className="mb-4 tracking-tight">
          <strong>Things I&apos;m exploring right now:</strong> projection
          mapping, mobile development, physical prototyping, cooking,
          entrepeneuership
        </p>
        <p className="mb-4 tracking-tight">
          <strong>Things I want to learn more about:</strong> data
          visualization, distributed systems, film photography, art history,
          mixology, WebGL, Three.js, dj-ing, gender studies, film, philosophy,
          LLM&apos;s, drumming
        </p>
        <p className="mb-4 tracking-tight">
          <strong>Things I enjoy:</strong> curating Spotify playlists (I have
          over 100!), bouldering, functional programming, indie rock, waking up
          with the sun, cold brew, watching leaves turn red in the fall, horror
          movies, watching the swans and geese near my neighborhood pond at
          sunset, running on the West Side Highway
        </p>

        <p>
          <b>Current favorites:</b>
        </p>

        <ul>
          <li>
            <b>Movies</b>: <i>Before Sunset</i>, <i>Whiplash</i>,{" "}
            <i>Aftersun</i>, <i>Short Term 12</i>, <i>Moonlight</i>
          </li>
          <li>
            <b>Books</b>: <i>Writers & Lovers</i> by Lily King,{" "}
            <i>In the Dream House</i> by Carmen Maria Machado,{" "}
            <i>Either / Or</i> by Elif Batuman, <i>The Remains of the Day</i> by
            Kazuo Ishiguro, <i>Another Country</i> by James Baldwin
          </li>
          <li>
            <b>Artists</b>: Elliott Smith, Boygenius, Alice Phoebe Lou, Bright
            Eyes, Mac Miller
          </li>
          <li>
            <b>Shows</b>: The Haunting of Hill House, Masterchef, Dead to Me,
            Bojack Horseman, The Last of Us
          </li>
          <li>
            <b>Places</b>: Copenhagen, the golf course next to my house (I
            don&apos;t actually golf, just trespass), Amsterdam, Target in the
            suburbs, Gantry Plaza State Park, Flagstaff hill
          </li>
        </ul>
        <SocialMediaBtn />
      </div>
    </Container>
  );
}
