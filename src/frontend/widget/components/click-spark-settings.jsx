import { useState, useEffect } from "@wordpress/element";
import { cn } from "@/lib/utils";

// Simple input component fallback (adjust to existing design system if available)
function Labeled({ label, children }) {
	return (
		<label className="zn:flex zn:flex-col zn:gap-1 zn:text-xs zn:font-medium zn:text-zinc-200">
			<span>{label}</span>
			{children}
		</label>
	);
}

export default function ClickSparkSettings({ className }) {
	const [values, setValues] = useState({
		color: "#ffffff",
		size: 10,
		radius: 15,
		count: 8,
		duration: 400,
		scale: 1,
		easing: "ease-out",
	});

	// Load
	useEffect(() => {
		try {
			const saved = JSON.parse(
				localStorage.getItem("accessibility-widget-clickSpark-settings") ||
					"{}",
			);
			setValues((v) => ({ ...v, ...saved }));
		} catch {}
	}, []);

	// Persist on change
	useEffect(() => {
		try {
			localStorage.setItem(
				"accessibility-widget-clickSpark-settings",
				JSON.stringify(values),
			);
		} catch {}
	}, [values]);

	function update(key, val) {
		setValues((prev) => ({ ...prev, [key]: val }));
	}

	return (
		<div className={cn("zn:flex zn:flex-col zn:gap-3", className)}>
			<div className="zn:grid zn:grid-cols-2 zn:gap-3">
				<Labeled label="Spark Color">
					<input
						type="color"
						value={values.color}
						onChange={(e) => update("color", e.target.value)}
						className="zn:h-8 zn:w-full zn:rounded zn:bg-zinc-800 zn:border zn:border-zinc-700"
					/>
				</Labeled>
				<Labeled label="Spark Size">
					<input
						type="number"
						min={2}
						max={40}
						value={values.size}
						onChange={(e) => update("size", Number(e.target.value) || 0)}
						className="zn:h-8 zn:w-full zn:px-2 zn:rounded zn:bg-zinc-800 zn:border zn:border-zinc-700"
					/>
				</Labeled>
				<Labeled label="Radius">
					<input
						type="number"
						min={5}
						max={200}
						value={values.radius}
						onChange={(e) => update("radius", Number(e.target.value) || 0)}
						className="zn:h-8 zn:w-full zn:px-2 zn:rounded zn:bg-zinc-800 zn:border zn:border-zinc-700"
					/>
				</Labeled>
				<Labeled label="Count">
					<input
						type="number"
						min={3}
						max={32}
						value={values.count}
						onChange={(e) => update("count", Number(e.target.value) || 0)}
						className="zn:h-8 zn:w-full zn:px-2 zn:rounded zn:bg-zinc-800 zn:border zn:border-zinc-700"
					/>
				</Labeled>
				<Labeled label="Duration (ms)">
					<input
						type="number"
						min={50}
						max={3000}
						value={values.duration}
						onChange={(e) => update("duration", Number(e.target.value) || 0)}
						className="zn:h-8 zn:w-full zn:px-2 zn:rounded zn:bg-zinc-800 zn:border zn:border-zinc-700"
					/>
				</Labeled>
				<Labeled label="Extra Scale">
					<input
						type="number"
						step={0.1}
						min={0.5}
						max={5}
						value={values.scale}
						onChange={(e) => update("scale", Number(e.target.value) || 1)}
						className="zn:h-8 zn:w-full zn:px-2 zn:rounded zn:bg-zinc-800 zn:border zn:border-zinc-700"
					/>
				</Labeled>
				<Labeled label="Easing">
					<select
						value={values.easing}
						onChange={(e) => update("easing", e.target.value)}
						className="zn:h-8 zn:w-full zn:px-2 zn:rounded zn:bg-zinc-800 zn:border zn:border-zinc-700"
					>
						<option value="ease-out">ease-out</option>
						<option value="linear">linear</option>
						<option value="ease-in">ease-in</option>
						<option value="ease-in-out">ease-in-out</option>
					</select>
				</Labeled>
			</div>
			<p className="zn:text-[10px] zn:text-zinc-400">
				Changes auto-save. Disable and re-enable Click Spark to apply instantly.
			</p>
		</div>
	);
}
