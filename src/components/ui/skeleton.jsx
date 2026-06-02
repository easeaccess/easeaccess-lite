import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      data-slot="skeleton"
      className={cn("zn:bg-accent zn:animate-pulse zn:rounded-md", className)}
      {...props} />)
  );
}

export { Skeleton }
