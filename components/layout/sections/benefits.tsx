import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    title: "Find Local Professionals Instantly",
    description:
      "Enter your ZIP code and discover a network of trusted home service providers in your area. No more endless searching—just reliable professionals ready to help.",
  },
  {
    icon: "LineChart",
    title: "AI-Powered Matching",
    description:
      "Describe your issue in our AI chat, and we’ll match you with the best contractors for the job. No guesswork, just quick and accurate recommendations.",
  },
  {
    icon: "Wallet",
    title: "Seamless Communication",
    description:
      "Call our single hotline or chat directly with contractors through the platform. Our AI assistant ensures your request is handled efficiently, so you get a response fast.",
  },
  {
    icon: "Sparkle",
    title: "Transparent and Reliable",
    description:
      "See ratings, reviews, and pricing upfront. Drillbit ensures you get quality service at a fair price, every time.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefits</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your One-Stop Solution for Home Services
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
          From finding the right professional to managing the entire process, Drillbit simplifies home maintenance so you can focus on what matters most.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
