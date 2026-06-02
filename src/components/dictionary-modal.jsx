import { useState, useEffect, useRef } from "@wordpress/element";
import { createPortal } from "@wordpress/element";
import {
	X,
	Play,
	Pause,
	Volume2,
	ChevronRight,
	ChevronLeft,
} from "lucide-react";
import { speak } from "@/lib/feature-style";
import { useTranslation } from "@/hooks/use-translation";

const DictionaryModal = ({ isOpen, onClose, initialWord = "" }) => {
	const { __ } = useTranslation();
	const [word, setWord] = useState(initialWord);
	const [definitions, setDefinitions] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [speaking, setSpeaking] = useState(false);
	const [portalContainer, setPortalContainer] = useState(null);
	const inputRef = useRef(null);

	// Create portal container on mount
	useEffect(() => {
		const container = document.createElement("div");
		container.id = "dictionary-modal-portal";
		document.body.appendChild(container);
		setPortalContainer(container);

		return () => {
			if (container && container.parentNode) {
				container.parentNode.removeChild(container);
			}
		};
	}, []);

	// Focus input when modal opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current.focus();
			}, 100);
		}
	}, [isOpen]);

	// Set initial word when provided
	useEffect(() => {
		if (initialWord && initialWord !== word) {
			setWord(initialWord);
			if (initialWord.trim()) {
				fetchDefinitions(initialWord.trim());
			}
		}
	}, [initialWord]);

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			if (word.trim()) {
				fetchDefinitions(word.trim());
			} else {
				setDefinitions([]);
				setCurrentPage(0);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [word]);

	const fetchDefinitions = async (searchWord) => {
		setLoading(true);
		setDefinitions([]);
		setCurrentPage(0);

		try {
			const response = await fetch(
				`${
					window.location.origin
				}/wp-json/easeaccess-lite/v1/dictionary/${encodeURIComponent(
					searchWord.toLowerCase(),
				)}`,
			);

			if (response.ok) {
				const data = await response.json();

				if (data.error) {
					setDefinitions([
						{
							type: "Error",
							definition: data.error,
						},
					]);
					return;
				}

				const allDefinitions = [];

				data.forEach((entry) => {
					entry.meanings.forEach((meaning) => {
						meaning.definitions.forEach((def) => {
							allDefinitions.push({
								type: meaning.partOfSpeech,
								definition: def.definition,
								example: def.example || null,
							});
						});
					});
				});

				setDefinitions(allDefinitions);
			} else {
				const errorData = await response
					.json()
					.catch(() => ({ error: "Unknown error" }));
				setDefinitions([
					{
						type: "Error",
						definition:
							errorData.error || `No definition found for "${searchWord}".`,
					},
				]);
			}
		} catch (error) {
			console.error("Dictionary API error:", error);
			setDefinitions([
				{
					type: "Error",
					definition: `Unable to fetch definition. Please check your internet connection.`,
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	const handleReadDefinition = () => {
		if (speaking) {
			if (window.speechSynthesis.speaking) {
				window.speechSynthesis.cancel();
			}
			setSpeaking(false);
		} else {
			if (definitions.length > 0 && definitions[currentPage]) {
				const textToRead = `${definitions[currentPage].type}. ${definitions[currentPage].definition}`;
				speak(textToRead, () => {
					setSpeaking(false);
				});
				setSpeaking(true);
			}
		}
	};

	const handleSpellWord = () => {
		if (!word.trim()) return;

		if (window.speechSynthesis.speaking) {
			window.speechSynthesis.cancel();
		}
		setSpeaking(false);

		const letters = word.trim().split("");
		let letterIndex = 0;

		const spellNextLetter = () => {
			if (letterIndex < letters.length) {
				const letter = letters[letterIndex];
				const utterance = new SpeechSynthesisUtterance(letter);
				utterance.rate = 0.8;
				utterance.onend = () => {
					letterIndex++;
					setTimeout(spellNextLetter, 300);
				};
				window.speechSynthesis.speak(utterance);
			}
		};

		spellNextLetter();
	};

	const changePage = (direction) => {
		if (definitions.length <= 1) return;

		let newPage = currentPage + direction;
		if (newPage < 0) newPage = definitions.length - 1;
		if (newPage >= definitions.length) newPage = 0;

		setCurrentPage(newPage);
		setSpeaking(false);
	};

	const handleClose = () => {
		if (window.speechSynthesis.speaking) {
			window.speechSynthesis.cancel();
		}
		setSpeaking(false);
		onClose();
	};

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape" && isOpen) {
				handleClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen]);

	if (!isOpen || !portalContainer) return null;

	const currentDef = definitions[currentPage];

	const modalContent = (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: "100vw",
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 999999,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				fontFamily: "system-ui, -apple-system, sans-serif",
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>
			<div
				style={{
					backgroundColor: "#ffffff",
					borderRadius: "12px",
					padding: "24px",
					width: "400px",
					maxWidth: "90vw",
					maxHeight: "90vh",
					overflow: "auto",
					boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
					<div style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}>
						{__("Dictionary", "easeaccess")}
					</div>
					<button
						onClick={handleClose}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: "4px",
							color: "#9ca3af",
						}}
					>
						<X style={{ width: "24px", height: "24px" }} />
					</button>
				</div>

				{/* Input */}
				<div style={{ marginBottom: "20px" }}>
					<input
						ref={inputRef}
						type="text"
						value={word}
						onChange={(e) => setWord(e.target.value)}
						placeholder={__("Type a word...", "easeaccess")}
						style={{
							width: "100%",
							padding: "10px 12px",
							border: "1px solid #d1d5db",
							borderRadius: "6px",
							fontSize: "16px",
							outline: "none",
							boxSizing: "border-box",
						}}
					/>
				</div>

				{/* Content */}
				<div style={{
					minHeight: "150px",
					marginBottom: "20px",
					padding: "16px",
					backgroundColor: "#f9fafb",
					borderRadius: "6px",
				}}>
					{loading ? (
						<p style={{ color: "#6b7280", textAlign: "center", margin: 0 }}>
							{__("Loading definitions...", "easeaccess")}
						</p>
					) : definitions.length === 0 ? (
						<p style={{ color: "#6b7280", textAlign: "center", margin: 0 }}>
							{__("Type or select a word to see its definition", "easeaccess")}
						</p>
					) : currentDef ? (
						<div>
							<div style={{ marginBottom: "12px" }}>
								<span style={{
									backgroundColor: "#2563eb",
									color: "#ffffff",
									padding: "4px 8px",
									borderRadius: "4px",
									fontSize: "14px",
								}}>
									{currentDef.type}
								</span>
							</div>
							<p style={{ color: "#111827", lineHeight: "1.6", margin: 0 }}>
								{currentDef.definition}
							</p>
							{currentDef.example && (
								<p style={{
									marginTop: "12px",
									padding: "12px",
									backgroundColor: "#f3f4f6",
									borderLeft: "3px solid #2563eb",
									fontStyle: "italic",
									color: "#4b5563",
									fontSize: "14px",
								}}>
									{__("Example:", "easeaccess")} {currentDef.example}
								</p>
							)}
						</div>
					) : null}
				</div>

				{/* Pagination */}
				{definitions.length > 1 && (
					<div style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "16px",
						marginBottom: "20px",
					}}>
						<span
							onClick={() => changePage(-1)}
							style={{
								padding: "6px 12px",
								backgroundColor: "#e5e7eb",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							<ChevronLeft style={{ width: "16px", height: "16px" }} />
						</span>
						<span style={{ fontSize: "14px", color: "#6b7280" }}>
							{currentPage + 1} / {definitions.length}
						</span>
						<span
							onClick={() => changePage(1)}
							style={{
								padding: "6px 12px",
								backgroundColor: "#e5e7eb",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							<ChevronRight style={{ width: "16px", height: "16px" }} />
						</span>
					</div>
				)}

				{/* Action Buttons */}
				<div style={{ display: "flex", gap: "12px" }}>
					<span
						onClick={handleReadDefinition}
						style={{
							flex: 1,
							padding: "10px 16px",
							backgroundColor: "#2563eb",
							color: "#ffffff",
							borderRadius: "6px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "8px",
							cursor: "pointer",
							fontSize: "14px",
							fontWeight: "500",
						}}
					>
						{speaking ? (
							<>
								<Pause style={{ width: "16px", height: "16px" }} />
								{__("Pause", "easeaccess")}
							</>
						) : (
							<>
								<Play style={{ width: "16px", height: "16px" }} />
								{__("Read", "easeaccess")}
							</>
						)}
					</span>
					<span
						onClick={handleSpellWord}
						style={{
							flex: 1,
							padding: "10px 16px",
							backgroundColor: "#10b981",
							color: "#ffffff",
							borderRadius: "6px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "8px",
							cursor: "pointer",
							fontSize: "14px",
							fontWeight: "500",
						}}
					>
						<Volume2 style={{ width: "16px", height: "16px" }} />
						{__("Spell", "easeaccess")}
					</span>
				</div>
			</div>
		</div>
	);

	return createPortal(modalContent, portalContainer);
};

export default DictionaryModal;
