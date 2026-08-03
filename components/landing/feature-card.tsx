import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
