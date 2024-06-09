import EXPERIENCE from "@/data/experience";
import SocialMediaBtn from "./social-media-btn";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function Experience() {
  return (
    <ScrollArea
      className={cn(
        "h-full w-full border-primary pt-4",
        "lg:h-screen lg:w-4/6 lg:border-r",
      )}
    >
      <h1 className="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">
        Hi! Im a software engineer passionate about creating engaging
        experiences, fostering social connection, and provoking conversations
        through my work.
      </h1>

      <p className="leading-tight">
        Currently studying{" "}
        <span className="italic">
          {" "}
          Information Systems / Computer Science / Human-Computer Interaction{" "}
        </span>{" "}
        at Gunadarma University.
      </p>

      <SocialMediaBtn className="mb-8 mt-5" />

      <h1 className="text-xl font-semibold tracking-tight">EXPERIENCE</h1>
      <Separator className="border-b border-primary" />

      <div className="mb-10 pr-6 lg:mb-36">
        {EXPERIENCE.map((item, index) => (
          <div
            key={index}
            className="mb-3 border-t border-black/30 py-3 first:border-none"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold tracking-tight">{item.name}</h2>
              <p className="text-sm">
                {[item.dates.start, item.dates.end ?? "Present"].join(" - ")}
              </p>
            </div>
            <p className="tracking-tight text-gray-400">{item.position}</p>
            <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
