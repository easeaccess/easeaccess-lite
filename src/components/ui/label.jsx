import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../../lib/utils";

function Label({ className, ...props }) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				"zn:flex zn:items-center zn:gap-2 zn:text-sm zn:leading-none zn:font-normal zn:select-none zn:group-data-[disabled=true]:pointer-events-none zn:group-data-[disabled=true]:opacity-50 zn:peer-disabled:cursor-not-allowed zn:peer-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
