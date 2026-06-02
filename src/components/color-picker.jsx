"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { RefreshCw } from "lucide-react";
import { AppTooltip } from "./tolltip-provider";

// --- Color Conversion Helpers (same as before) ---
function hsvToRgb(h, s, v) {
	s /= 100;
	v /= 100;
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;
	let r = 0,
		g = 0,
		b = 0;
	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);
	return { r, g, b };
}

function rgbToHex(r, g, b) {
	return (
		"#" +
		((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
	);
}

function hexToRgb(hex) {
	let r = 0,
		g = 0,
		b = 0;
	if (hex.length === 4) {
		r = Number.parseInt(hex[1] + hex[1], 16);
		g = Number.parseInt(hex[2] + hex[2], 16);
		b = Number.parseInt(hex[3] + hex[3], 16);
	} else if (hex.length === 7) {
		r = Number.parseInt(hex.substring(1, 3), 16);
		g = Number.parseInt(hex.substring(3, 5), 16);
		b = Number.parseInt(hex.substring(5, 7), 16);
	}
	return { r, g, b };
}

function rgbToHsv(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h,
		s,
		v = max;
	const d = max - min;
	s = max === 0 ? 0 : d / max;
	if (max === min) {
		h = 0;
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default:
				break;
		}
		h /= 6;
	}
	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		v: Math.round(v * 100),
	};
}

// --- End Color Conversion Helpers ---

const DEFAULT_SOLID_COLOR = {
	type: "solid",
	color: "#0040C1",
};

const DEFAULT_GRADIENT_COLOR = {
	type: "gradient",
	startColor: "#FF0000",
	endColor: "#0000FF",
	angle: 90,
};

export default function ColorPicker({
	value,
	onChange,
	disabled = [], // Array of strings: can contain 'solid', 'gradient', or both
}) {
	// Internal state for solid color picker
	const [solidHue, setSolidHue] = useState(0);
	const [solidSaturation, setSolidSaturation] = useState(0);
	const [solidValue, setSolidValue] = useState(0);

	// Internal state for gradient colors
	const [gradientStartHue, setGradientStartHue] = useState(0);
	const [gradientStartSaturation, setGradientStartSaturation] = useState(0);
	const [gradientStartValue, setGradientStartValue] = useState(0);
	const [gradientEndHue, setGradientEndHue] = useState(0);
	const [gradientEndSaturation, setGradientEndSaturation] = useState(0);
	const [gradientEndValue, setGradientEndValue] = useState(0);
	const [gradientAngle, setGradientAngle] = useState(
		DEFAULT_GRADIENT_COLOR.angle,
	);

	// State to track which gradient color is being edited by the main picker
	const [activeGradientColorTarget, setActiveGradientColorTarget] =
		useState(null); // 'start' | 'end' | null

	const colorAreaRef = useRef(null);
	const hueSliderRef = useRef(null);

	// Helper functions to check what's available
	const isSolidDisabled = disabled.includes("solid");
	const isGradientDisabled = disabled.includes("gradient");
	const isTypeSelectionDisabled = isSolidDisabled || isGradientDisabled;

	// Auto-adjust value type if current type is disabled
	useEffect(() => {
		if (value.type === "solid" && isSolidDisabled && !isGradientDisabled) {
			triggerChange(DEFAULT_GRADIENT_COLOR);
		} else if (
			value.type === "gradient" &&
			isGradientDisabled &&
			!isSolidDisabled
		) {
			triggerChange(DEFAULT_SOLID_COLOR);
		}
	}, [disabled]);

	// --- Synchronize internal state with 'value' prop ---
	useEffect(() => {
		if (value.type === "solid") {
			const { r, g, b } = hexToRgb(value.color || DEFAULT_SOLID_COLOR.color);
			const { h, s, v } = rgbToHsv(r, g, b);
			setSolidHue(h);
			setSolidSaturation(s);
			setSolidValue(v);
		} else if (value.type === "gradient") {
			const {
				r: rs,
				g: gs,
				b: bs,
			} = hexToRgb(value.startColor || DEFAULT_GRADIENT_COLOR.startColor);
			const { h: hs, s: ss, v: vs } = rgbToHsv(rs, gs, bs);
			setGradientStartHue(hs);
			setGradientStartSaturation(ss);
			setGradientStartValue(vs);
			const {
				r: re,
				g: ge,
				b: be,
			} = hexToRgb(value.endColor || DEFAULT_GRADIENT_COLOR.endColor);
			const { h: he, s: se, v: ve } = rgbToHsv(re, ge, be);
			setGradientEndHue(he);
			setGradientEndSaturation(se);
			setGradientEndValue(ve);
			setGradientAngle(value.angle || DEFAULT_GRADIENT_COLOR.angle);
		}
	}, [value]);

	// --- Helper to trigger onChange callback ---
	const triggerChange = useCallback(
		(updatedValue) => {
			if (onChange) {
				onChange(updatedValue);
			}
		},
		[onChange],
	);

	// --- Handlers for Solid Color Picker ---
	// Local state for input fields
	const [solidHexInput, setSolidHexInput] = useState(
		value.color || DEFAULT_SOLID_COLOR.color,
	);
	const [gradientStartHexInput, setGradientStartHexInput] = useState(
		value.startColor || DEFAULT_GRADIENT_COLOR.startColor,
	);
	const [gradientEndHexInput, setGradientEndHexInput] = useState(
		value.endColor || DEFAULT_GRADIENT_COLOR.endColor,
	);

	// Sync local input state when value changes
	useEffect(() => {
		if (value.type === "solid") {
			setSolidHexInput(value.color || DEFAULT_SOLID_COLOR.color);
		} else if (value.type === "gradient") {
			setGradientStartHexInput(
				value.startColor || DEFAULT_GRADIENT_COLOR.startColor,
			);
			setGradientEndHexInput(value.endColor || DEFAULT_GRADIENT_COLOR.endColor);
		}
	}, [value]);

	const handleSolidHexInputChange = useCallback(
		(e) => {
			let newHex = e.target.value.toUpperCase();
			if (!newHex.startsWith("#")) {
				newHex = "#" + newHex;
			}
			setSolidHexInput(newHex);
			if (/^#([0-9A-F]{3}){1,2}$/.test(newHex)) {
				triggerChange({ ...value, color: newHex });
			}
		},
		[value, triggerChange],
	);
	const handleSolidHexInputBlur = useCallback(
		(e) => {
			let newHex = e.target.value.toUpperCase();
			if (!newHex.startsWith("#")) {
				newHex = "#" + newHex;
			}
			if (/^#([0-9A-F]{3}){1,2}$/.test(newHex)) {
				triggerChange({ ...value, color: newHex });
			} else {
				setSolidHexInput(value.color || DEFAULT_SOLID_COLOR.color);
			}
		},
		[value, triggerChange],
	);

	// --- Handlers for Gradient Color Inputs ---
	const handleGradientStartColorHexChange = useCallback(
		(e) => {
			let newHex = e.target.value.toUpperCase();
			if (!newHex.startsWith("#")) {
				newHex = "#" + newHex;
			}
			setGradientStartHexInput(newHex);
			if (/^#([0-9A-F]{3}){1,2}$/.test(newHex)) {
				triggerChange({ ...value, startColor: newHex });
			}
		},
		[value, triggerChange],
	);
	const handleGradientStartColorHexBlur = useCallback(
		(e) => {
			let newHex = e.target.value.toUpperCase();
			if (!newHex.startsWith("#")) {
				newHex = "#" + newHex;
			}
			if (/^#([0-9A-F]{3}){1,2}$/.test(newHex)) {
				triggerChange({ ...value, startColor: newHex });
			} else {
				setGradientStartHexInput(
					value.startColor || DEFAULT_GRADIENT_COLOR.startColor,
				);
			}
		},
		[value, triggerChange],
	);

	const handleGradientEndColorHexChange = useCallback(
		(e) => {
			let newHex = e.target.value.toUpperCase();
			if (!newHex.startsWith("#")) {
				newHex = "#" + newHex;
			}
			setGradientEndHexInput(newHex);
			if (/^#([0-9A-F]{3}){1,2}$/.test(newHex)) {
				triggerChange({ ...value, endColor: newHex });
			}
		},
		[value, triggerChange],
	);
	const handleGradientEndColorHexBlur = useCallback(
		(e) => {
			let newHex = e.target.value.toUpperCase();
			if (!newHex.startsWith("#")) {
				newHex = "#" + newHex;
			}
			if (/^#([0-9A-F]{3}){1,2}$/.test(newHex)) {
				triggerChange({ ...value, endColor: newHex });
			} else {
				setGradientEndHexInput(
					value.endColor || DEFAULT_GRADIENT_COLOR.endColor,
				);
			}
		},
		[value, triggerChange],
	);

	const handleGradientAngleChange = useCallback(
		(e) => {
			const angle = Number(e.target.value);
			if (!isNaN(angle)) {
				triggerChange({ ...value, angle: angle });
			}
		},
		[value, triggerChange],
	);

	// --- Universal Color Area Mouse Down Handler ---
	const handleColorAreaMouseDown = useCallback(
		(e) => {
			e.preventDefault();
			const area = colorAreaRef.current;
			if (!area) return;
			const rect = area.getBoundingClientRect();
			const updateColor = (clientX, clientY) => {
				let x = clientX - rect.left;
				let y = clientY - rect.top;
				x = Math.max(0, Math.min(x, rect.width));
				y = Math.max(0, Math.min(y, rect.height));
				const newSaturation = Math.round((x / rect.width) * 100);
				const newValue = Math.round(100 - (y / rect.height) * 100);
				if (value.type === "solid") {
					const { r, g, b } = hsvToRgb(solidHue, newSaturation, newValue);
					triggerChange({ ...value, color: rgbToHex(r, g, b) });
				} else if (value.type === "gradient" && activeGradientColorTarget) {
					const currentHue =
						activeGradientColorTarget === "start"
							? gradientStartHue
							: gradientEndHue;
					const { r, g, b } = hsvToRgb(currentHue, newSaturation, newValue);
					const newHex = rgbToHex(r, g, b);
					if (activeGradientColorTarget === "start") {
						triggerChange({ ...value, startColor: newHex });
					} else {
						triggerChange({ ...value, endColor: newHex });
					}
				}
			};
			updateColor(e.clientX, e.clientY);
			const onMouseMove = (moveEvent) =>
				updateColor(moveEvent.clientX, moveEvent.clientY);
			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		},
		[
			value,
			solidHue,
			gradientStartHue,
			gradientEndHue,
			activeGradientColorTarget,
			triggerChange,
		],
	);

	// --- Universal Hue Slider Mouse Down Handler ---
	const handleHueSliderMouseDown = useCallback(
		(e) => {
			e.preventDefault();
			const slider = hueSliderRef.current;
			if (!slider) return;
			const rect = slider.getBoundingClientRect();
			const updateHue = (clientY) => {
				let y = clientY - rect.top;
				y = Math.max(0, Math.min(y, rect.height));
				const newHue = Math.round(360 - (y / rect.height) * 360);
				if (value.type === "solid") {
					const { r, g, b } = hsvToRgb(newHue, solidSaturation, solidValue);
					triggerChange({ ...value, color: rgbToHex(r, g, b) });
				} else if (value.type === "gradient" && activeGradientColorTarget) {
					const currentSaturation =
						activeGradientColorTarget === "start"
							? gradientStartSaturation
							: gradientEndSaturation;
					const currentValue =
						activeGradientColorTarget === "start"
							? gradientStartValue
							: gradientEndValue;
					const { r, g, b } = hsvToRgb(newHue, currentSaturation, currentValue);
					const newHex = rgbToHex(r, g, b);
					if (activeGradientColorTarget === "start") {
						triggerChange({ ...value, startColor: newHex });
					} else {
						triggerChange({ ...value, endColor: newHex });
					}
				}
			};
			updateHue(e.clientY);
			const onMouseMove = (moveEvent) => updateHue(moveEvent.clientY);
			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		},
		[
			value,
			solidSaturation,
			solidValue,
			gradientStartSaturation,
			gradientStartValue,
			gradientEndSaturation,
			gradientEndValue,
			activeGradientColorTarget,
			triggerChange,
		],
	);

	// --- Reset Handler ---
	const handleReset = useCallback(() => {
		if (value.type === "solid" && !isSolidDisabled) {
			triggerChange(DEFAULT_SOLID_COLOR);
		} else if (value.type === "gradient" && !isGradientDisabled) {
			triggerChange(DEFAULT_GRADIENT_COLOR);
		}
		setActiveGradientColorTarget(null); // Reset active gradient target on full reset
	}, [value, triggerChange, isSolidDisabled, isGradientDisabled]);

	// --- Derived values for rendering ---
	let currentHue = solidHue;
	let currentSaturation = solidSaturation;
	let currentValue = solidValue;
	let currentHexColor = value.color;

	if (value.type === "gradient" && activeGradientColorTarget === "start") {
		currentHue = gradientStartHue;
		currentSaturation = gradientStartSaturation;
		currentValue = gradientStartValue;
		currentHexColor = value.startColor;
	} else if (value.type === "gradient" && activeGradientColorTarget === "end") {
		currentHue = gradientEndHue;
		currentSaturation = gradientEndSaturation;
		currentValue = gradientEndValue;
		currentHexColor = value.endColor;
	}

	const mainColorAreaBackground = `hsl(${currentHue}, 100%, 50%)`;
	const selectorX = (currentSaturation / 100) * 100 + "%";
	const selectorY = ((100 - currentValue) / 100) * 100 + "%";
	const hueSliderHandleY = ((360 - currentHue) / 360) * 100 + "%";
	const currentPreviewStyle =
		value.type === "solid"
			? { backgroundColor: value.color }
			: {
					background: `linear-gradient(${value.angle}deg, ${value.startColor}, ${value.endColor})`,
			  };

	return (
		<div className=" zn:w-full ">
			<div className="zn:flex zn:gap-4">
				<div
					ref={colorAreaRef}
					className="zn:relative zn:flex-grow zn:h-48 zn:rounded-md zn:overflow-hidden zn:cursor-crosshair"
					style={{ backgroundColor: mainColorAreaBackground }}
					onMouseDown={handleColorAreaMouseDown}
				>
					<div
						className="zn:absolute zn:inset-0"
						style={{
							background: "linear-gradient(to right, #fff, transparent)",
						}}
					/>
					<div
						className="zn:absolute zn:inset-0"
						style={{
							background: "linear-gradient(to top, #000, transparent)",
						}}
					/>
					<div
						className="zn:absolute zn:w-4 zn:h-4 zn:border-2 zn:border-white zn:rounded-full zn:shadow-md"
						style={{
							left: `calc(${selectorX} - 8px)`,
							top: `calc(${selectorY} - 8px)`,
							backgroundColor: currentHexColor,
						}}
					/>
				</div>
				<div
					ref={hueSliderRef}
					className="zn:relative zn:w-6 zn:h-48 zn:rounded-md zn:overflow-hidden zn:cursor-ns-resize"
					onMouseDown={handleHueSliderMouseDown}
					style={{
						background:
							"linear-gradient(to top, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)",
					}}
				>
					<div
						className="zn:absolute zn:left-0 zn:right-0 zn:h-2 zn:bg-white zn:border zn:border-gray-300 zn:rounded-full zn:shadow-sm"
						style={{
							top: `calc(${hueSliderHandleY} - 4px)`,
						}}
					/>
				</div>
			</div>
			{value.type === "solid" ? (
				<div className="zn:flex zn:items-center zn:gap-2 zn:mt-4">
					<div
						className="zn:w-8 zn:h-8 zn:rounded-md zn:border"
						style={currentPreviewStyle}
					/>
					<Input
						className="zn:flex-grow"
						value={solidHexInput}
						onChange={handleSolidHexInputChange}
						onBlur={handleSolidHexInputBlur}
					/>
					<AppTooltip
						title={
							<Button variant="outline" size="icon" onClick={handleReset}>
								<RefreshCw className="zn:h-4 zn:w-4" />
							</Button>
						}
						content="Reset Color"
					/>
				</div>
			) : (
				<div className="zn:flex zn:flex-col zn:gap-4 zn:mt-4">
					<div
						className="zn:w-full zn:h-24 zn:rounded-md zn:border zn:overflow-hidden"
						style={currentPreviewStyle}
					/>
					<div className="zn:grid zn:grid-cols-2 zn:gap-2">
						<div>
							<label
								htmlFor="start-color"
								className="zn:block zn:text-xs zn:font-medium zn:text-gray-700 zn:mb-1"
							>
								Start Color
							</label>
							<div className="zn:flex zn:items-center zn:gap-2">
								<div
									className={`zn:w-8 zn:h-8 zn:rounded-md zn:border zn:cursor-pointer ${
										activeGradientColorTarget === "start"
											? "zn:ring-2 zn:ring-blue-500"
											: ""
									}`}
									style={{ backgroundColor: value.startColor }}
									onClick={() => setActiveGradientColorTarget("start")}
								/>
								<Input
									id="start-color"
									value={gradientStartHexInput}
									onChange={handleGradientStartColorHexChange}
									onBlur={handleGradientStartColorHexBlur}
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="end-color"
								className="zn:block zn:text-xs zn:font-medium zn:text-gray-700 zn:mb-1"
							>
								End Color
							</label>
							<div className="zn:flex zn:items-center zn:gap-2">
								<div
									className={`zn:w-8 zn:h-8 zn:rounded-md zn:border zn:cursor-pointer ${
										activeGradientColorTarget === "end"
											? "zn:ring-2 zn:ring-blue-500"
											: ""
									}`}
									style={{ backgroundColor: value.endColor }}
									onClick={() => setActiveGradientColorTarget("end")}
								/>
								<Input
									id="end-color"
									value={gradientEndHexInput}
									onChange={handleGradientEndColorHexChange}
									onBlur={handleGradientEndColorHexBlur}
								/>
							</div>
						</div>
						<div className="zn:col-span-2">
							<label
								htmlFor="gradient-angle"
								className="zn:block zn:text-xs zn:font-medium zn:text-gray-700 zn:mb-1"
							>
								Angle (deg)
							</label>
							<Input
								id="gradient-angle"
								type="number"
								value={value.angle}
								onChange={handleGradientAngleChange}
							/>
						</div>
					</div>
				</div>
			)}
			<div className="zn:flex zn:items-center zn:gap-2 zn:mt-4">
				{/* <Button variant="outline" size="icon" onClick={handleReset}>
					<RefreshCw className="zn:h-4 zn:w-4" />
				</Button> */}
				{!isTypeSelectionDisabled && (
					<Select
						value={value.type}
						onValueChange={(newType) => {
							if (newType === "solid" && !isSolidDisabled) {
								triggerChange(DEFAULT_SOLID_COLOR);
							} else if (newType === "gradient" && !isGradientDisabled) {
								triggerChange(DEFAULT_GRADIENT_COLOR);
							}
							setActiveGradientColorTarget(null);
						}}
					>
						<SelectTrigger className="zn:w-[120px]">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							{!isSolidDisabled && (
								<SelectItem value="solid">Solid color</SelectItem>
							)}
							{!isGradientDisabled && (
								<SelectItem value="gradient">Gradient</SelectItem>
							)}
						</SelectContent>
					</Select>
				)}
			</div>
		</div>
	);
}
