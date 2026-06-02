"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodePreview({ code, title, language = "jsx" }) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000); // Reset "Copied!" state after 2 seconds
	};

	return (
		<div className="zn:relative zn:w-full zn:overflow-hidden zn:rounded-md zn:border zn:!bg-neutral-950 zn:!text-white">
			{title && (
				<div className="zn:flex zn:items-center zn:justify-between zn:border-b zn:border-neutral-800 zn:px-4 zn:py-2">
					<span className="zn:text-sm zn:font-medium zn:!text-neutral-400">
						{title}
					</span>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="zn:h-8 zn:w-8 zn:!text-neutral-400 zn:!hover:bg-neutral-800 zn:hover:text-white"
									onClick={handleCopy}
									aria-label="Copy code"
								>
									{copied ? (
										<Check className="zn:h-4 zn:w-4 zn:text-green-500" />
									) : (
										<Copy className="zn:h-4 zn:w-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{copied ? "Copied!" : "Copy code"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			)}
			<div className="zn:!p-4">
				<SyntaxHighlighter
					language={language}
					style={atomDark}
					wrapLines={true}
					wrapLongLines={true}
					customStyle={{
						backgroundColor: "transparent",
						padding: 0,
						margin: 0,
						overflowX: "auto",
						fontSize: "0.875rem", // text-sm
						lineHeight: "1.25rem", // leading-5
					}}
					codeTagProps={{
						style: {
							fontFamily: "monospace",
						},
					}}
				>
					{code}
				</SyntaxHighlighter>
			</div>
			{!title && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="zn:absolute zn:right-2 zn:top-2 zn:h-8 zn:w-8 zn:!text-neutral-400 zn:!hover:bg-neutral-800 hover:text-white"
								onClick={handleCopy}
								aria-label="Copy code"
							>
								{copied ? (
									<Check className="zn:h-4 zn:w-4 zn:text-green-500" />
								) : (
									<Copy className="zn:h-4 zn:w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{copied ? "Copied!" : "Copy code"}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
}
