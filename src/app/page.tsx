import Container from "@/components/container";
import Experience from "@/components/work/experience";
import SelectedWork from "@/components/work/selected-work";

export default function Home() {
  return (
    <Container
      as="section"
      className="flex flex-col pt-24 lg:fixed lg:flex-row lg:pt-0"
    >
      <Experience />
      <SelectedWork />
    </Container>
  );
}
