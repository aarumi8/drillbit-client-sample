import { BenefitsSection } from "@/components/layout/sections/benefits";
import { ChatSection } from "@/components/layout/sections/chat";
import { HeroSection } from "@/components/layout/sections/hero";

export const metadata = {
  title: "Drillbit Find",
  description: "Free Shadcn landing page for developers",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ChatSection />
    </>
  );
}
