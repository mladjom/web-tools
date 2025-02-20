import React from 'react';
import { Pilcrow, Home, Proportions } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ className, ...props }) => {
  const tools = [
    {
      name: "Home",
      href: "/",
      icon: Home
    },
    {
      name: "Typography Generator",
      href: "/tools/typography",
      icon: Pilcrow
    },
    {
      name: "Aspect Ratio Calculator",
      href: "/tools/aspectratio",
      icon: Proportions
    },
    {
      name: "Aspect Ratio Calculator (Old)",
      href: "/tools/aspectratioold",
      icon: Proportions
    }
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.name}
            variant="ghost"
            className="justify-start gap-2"
            asChild
          >
            <a href={tool.href}>
              <Icon className="h-4 w-4" />
              {tool.name}
            </a>
          </Button>
        );
      })}
    </nav>
  );
};
