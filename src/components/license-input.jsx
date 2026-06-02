"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const LicenseInput = React.forwardRef(
	({ className, value = "", onChange, ...props }, ref) => {
		const [actualValue, setActualValue] = React.useState("");
		const [displayValue, setDisplayValue] = React.useState("");

		const handleInputChange = (e) => {
			const inputValue = e.target.value;

			// Handle backspace/delete - if display is shorter, remove from actual value
			if (inputValue.length < displayValue.length) {
				const newActualValue = actualValue.slice(0, inputValue.length);
				setActualValue(newActualValue);
				setDisplayValue("*".repeat(newActualValue.length));

				// Create synthetic event with the actual license value
				const syntheticEvent = {
					target: { value: newActualValue },
					preventDefault: () => {},
					stopPropagation: () => {},
				};
				onChange?.(syntheticEvent);
				return;
			}

			if (inputValue.length > displayValue.length) {
				// Get all the new characters that were added
				const newChars = inputValue.slice(displayValue.length);
				const newActualValue = actualValue + newChars;
				setActualValue(newActualValue);
				setDisplayValue("*".repeat(newActualValue.length));

				// Create synthetic event with the actual license value
				const syntheticEvent = {
					target: { value: newActualValue },
					preventDefault: () => {},
					stopPropagation: () => {},
				};
				onChange?.(syntheticEvent);
			}
		};

		React.useEffect(() => {
			if (value !== actualValue) {
				setActualValue(value);
				setDisplayValue("*".repeat(value.length));
			}
		}, [value]);

		return (
			<Input
				{...props}
				ref={ref}
				type="text"
				value={displayValue}
				onChange={handleInputChange}
				className={cn("font-mono tracking-wider", className)}
				placeholder="Enter license key..."
			/>
		);
	},
);

LicenseInput.displayName = "LicenseInput";

export { LicenseInput };
