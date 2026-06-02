import * as React from "react";

import { cn } from "../../lib/utils";

function Input({ className, type, ...props }) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"zn:file:text-foreground zn:placeholder:text-muted-foreground zn:selection:bg-primary zn:selection:text-primary-foreground zn:dark:bg-input/30 zn:!border-input zn:flex zn:h-9 zn:w-full zn:min-w-0 zn:!rounded-md zn:border zn:bg-transparent zn:px-3 zn:py-1 zn:text-base zn:shadow-xs zn:transition-[color,box-shadow] zn:outline-none zn:file:inline-flex zn:file:h-7 zn:file:border-0 zn:file:bg-transparent zn:file:text-sm zn:file:font-medium zn:disabled:pointer-events-none zn:disabled:cursor-not-allowed zn:disabled:opacity-50 zn:md:text-sm",
				"zn:focus-visible:border-primary zn:focus-visible:ring-primary/50 zn:focus-visible:ring-[3px]",
				"zn:aria-invalid:ring-destructive/20 zn:dark:aria-invalid:ring-destructive/40 zn:aria-invalid:border-destructive zn:focus:!shadow-none zn:focus:!border-transparent",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
