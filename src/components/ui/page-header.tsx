import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Public pages: center the header and clear the fixed site navbar. */
  site?: boolean;
};

export function PageHeader({ title, description, site = false }: PageHeaderProps) {
  return (
    <header
      className={cn("space-y-3", site && "mx-auto w-full max-w-7xl px-5 pt-32 pb-12 sm:px-8")}
    >
      <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      {description ? <p className="max-w-2xl text-lg text-muted">{description}</p> : null}
    </header>
  );
}
