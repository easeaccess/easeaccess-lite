import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
// lightweight inline calendar (simple) without existing calendar component
// If a full Calendar component is later added, replace this inline version.
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ChevronLeft,
	Info,
	Download,
	Settings,
	Trash2,
	X,
	ExternalLink,
	CheckCircle,
	AlertCircle,
	FilePlus,
	Plus,
	ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { useStatement } from "@/hooks/use-statement";
import { usePages } from "@/hooks/use-pages";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BigFile } from "@/icons";
import { LabelTooltip } from "@/components/label-tooltip";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import AnimatedSparkle from "@/components/AnimatedSparkle";
import { MotionTextLoader } from "@/components/motion-text-loader";
export default function StatementPage() {
	const [step, setStep] = useState(0); // 0: initial, 1: generate form, 2: statement generated
	const [formData, setFormData] = useState({
		companyName: "",
		address: "",
		websiteUrl: "",
		businessEmail: "",
		phoneNumber: "",
		generationDate: new Date().toISOString().split("T")[0],
		// Honest conformance fields (WCAG 2.2 / W3C WAI template)
		conformanceLevel: "partial", // 'full' | 'partial' | 'non'
		knownLimitations: "",
		remediationTimeline: "",
		assessmentMethod: "",
		agreedToTerms: false,
	});
	// Date picker popover state
	const [dateOpen, setDateOpen] = useState(false);
	const [accessibilityWidgetEnabled, setAccessibilityWidgetEnabled] =
		useState(false);
	const [linkPage, setLinkPage] = useState("");
	const [linkText, setLinkText] = useState("Statement");

	// Use custom hooks
	const {
		statementData,
		isLoading,
		error,
		createStatement,
		updateStatement,
		deleteStatement,
		downloadStatement,
	} = useStatement();

	const { pages: availablePages, isLoading: pagesLoading } = usePages();

	// Track if this is the initial load
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	useEffect(() => {
		if (!pagesLoading && isInitialLoad) {
			setIsInitialLoad(false);
		}
	}, [pagesLoading, isInitialLoad]);

	// Set initial state when statement data loads (without clobbering user selection if page_url is empty)
	useEffect(() => {
		if (!statementData) return;

		setAccessibilityWidgetEnabled(statementData.widget_enabled || false);
		setLinkText(statementData.link_text || "Statement");

		// Only update linkPage if statementData.page_url is a non-empty string
		if (statementData.page_url && statementData.page_url !== "") {
			setLinkPage((prev) => (prev ? prev : statementData.page_url));
		}

		// Prefill form fields so when user goes back to customize previous values show
		// Ensure generation date is never in the past
		const today = new Date().toISOString().split("T")[0];
		const savedDate = statementData.generation_date;
		const validDate = savedDate && savedDate >= today ? savedDate : today;

		setFormData((prev) => ({
			...prev,
			companyName: statementData.company_name || prev.companyName,
			address: statementData.address || prev.address,
			websiteUrl: statementData.website_url || prev.websiteUrl,
			businessEmail: statementData.business_email || prev.businessEmail,
			phoneNumber: statementData.phone_number || prev.phoneNumber,
			generationDate: validDate,
			conformanceLevel:
				statementData.conformance_level || prev.conformanceLevel,
			knownLimitations:
				statementData.known_limitations || prev.knownLimitations,
			remediationTimeline:
				statementData.remediation_timeline || prev.remediationTimeline,
			assessmentMethod:
				statementData.assessment_method || prev.assessmentMethod,
		}));
		setStep(2);
	}, [statementData]);

	// URL validation function
	const isValidUrl = (string) => {
		try {
			const url = new URL(string);
			return url.protocol === "http:" || url.protocol === "https:";
		} catch (_) {
			return false;
		}
	};

	// Basic email validation (HTML5 type=email handles much, this adds custom message + disable logic)
	// Intentionally simple: local@domain.tld with at least 2-char TLD and no spaces
	const isValidEmail = (email) => {
		if (!email) return false; // treat empty as invalid for our required field logic
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // avoids overly complex RFC regex
		return emailRegex.test(email);
	};

	const handleInputChange = (e) => {
		const { id, value, type, checked } = e.target;

		// Special handling for URL validation
		if (id === "websiteUrl" && value && !isValidUrl(value)) {
			// Show error feedback but still allow typing
			e.target.setCustomValidity(
				"Please enter a valid URL starting with http:// or https://",
			);
		} else if (id === "websiteUrl") {
			e.target.setCustomValidity("");
		}

		// Special handling for Email validation
		if (id === "businessEmail" && value && !isValidEmail(value)) {
			e.target.setCustomValidity("Please enter a valid business email address");
		} else if (id === "businessEmail") {
			e.target.setCustomValidity("");
		}

		setFormData((prev) => ({
			...prev,
			[id]: type === "checkbox" ? checked : value,
		}));
	};

	const handleGenerateStatement = async () => {
		try {
			// Validate URL before sending
			if (!isValidUrl(formData.websiteUrl)) {
				toast.error(
					"Please enter a valid website URL starting with http:// or https://",
				);
				return;
			}

			// Validate Email before sending
			if (!isValidEmail(formData.businessEmail)) {
				toast.error("Please enter a valid business email address.");
				return;
			}

			// Validate date
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const selectedDate = new Date(formData.generationDate);

			if (selectedDate < today) {
				toast.error(
					"Please select today's date or a future date for statement generation.",
				);
				return;
			}

			const response = await createStatement(formData);
			setAccessibilityWidgetEnabled(true);
			if (response.page_url) {
				setLinkPage(response.page_url);
			}
			setStep(2);
			toast.success("Accessibility statement page created successfully.");
		} catch (error) {
			// Show more specific error messages based on the error response
			const errorMessage =
				error.message ||
				"Failed to generate accessibility statement. Please try again.";
			toast.error(errorMessage);
		}
	};

	const handleDeleteStatement = async () => {
		try {
			await deleteStatement();
			setAccessibilityWidgetEnabled(false);
			setLinkPage("");
			setStep(0);
			toast.success("Accessibility statement has been deleted.");
		} catch (error) {
			toast.error("Failed to delete accessibility statement.");
		}
	};

	const handleDownload = async (format) => {
		try {
			await downloadStatement(format);
			toast.success(`Statement downloaded as ${format.toUpperCase()}`);
		} catch (error) {
			toast.error("Failed to download statement.");
		}
	};

	const updateStatementSettings = async () => {
		try {
			const updatedSettings = {
				...statementData,
				widget_enabled: accessibilityWidgetEnabled,
				link_text: linkText,
				page_url: linkPage || (statementData && statementData.page_url) || "",
			};

			await updateStatement(updatedSettings);

			toast.success("Statement settings updated successfully.");
		} catch (error) {
			toast.error("Failed to update settings.");
		}
	};

	// Allow saving link/widget settings even if a statement has not been generated yet
	const saveLinkOnlySettings = async () => {
		try {
			// Fetch full settings so we don't overwrite unrelated parts
			const currentSettings = await apiFetch({ path: "/easeaccess-lite/v1/settings" });
			const updated = {
				...currentSettings,
				statementSettings: {
					...(currentSettings.statementSettings || {}),
					widget_enabled: accessibilityWidgetEnabled,
					link_text: linkText,
					page_url: linkPage || "",
				},
			};

			await apiFetch({
				path: "/easeaccess-lite/v1/settings",
				method: "POST",
				data: updated,
			});

			toast.success("Link settings saved.");
		} catch (error) {
			toast.error("Failed to save link settings.");
		}
	};

	const generatePreviewStatement = () => {
		const companyName = formData.companyName || "[company name]";
		const companyWebsite = formData.websiteUrl || "[company website]";
		const companyEmail = formData.businessEmail || "[company email]";
		const generationDate = formData.generationDate
			? new Date(formData.generationDate).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
			  })
			: "[7/19/2025.]";

		const conformanceMap = {
			full: {
				label: "fully conforms",
				sentence: (
					<>
						The website {companyWebsite} is <strong>fully conformant</strong>{" "}
						with WCAG 2.2 level AA. Fully conformant means that the content
						fully meets the accessibility standard without any exceptions.
					</>
				),
			},
			partial: {
				label: "partially conforms",
				sentence: (
					<>
						The website {companyWebsite} is{" "}
						<strong>partially conformant</strong> with WCAG 2.2 level AA.
						Partially conformant means that some parts of the content do not
						fully conform to the accessibility standard.
					</>
				),
			},
			non: {
				label: "does not conform",
				sentence: (
					<>
						The website {companyWebsite} is <strong>non-conformant</strong> with
						WCAG 2.2 level AA. Non-conformant means that the content does not
						meet the accessibility standard.
					</>
				),
			},
		};

		const conf =
			conformanceMap[formData.conformanceLevel] || conformanceMap.partial;

		const limitationsLines = (formData.knownLimitations || "")
			.split(/\r\n|\r|\n/)
			.map((s) => s.trim())
			.filter(Boolean);

		const defaultLimitations = [
			"Some older video or audio files may not include captions or transcripts. We are working to retrofit these as resources allow.",
			"Certain third-party plugins, embeds, or user-generated content may not fully meet WCAG 2.2 AA requirements.",
			"Some PDF documents published before this statement was issued may not be fully tagged for assistive technologies.",
		];

		const renderedLimitations =
			limitationsLines.length > 0 ? limitationsLines : defaultLimitations;

		const assessmentMethod =
			formData.assessmentMethod ||
			"self-evaluation, including automated testing tools and manual review of key pages";

		return (
			<div className="space-y-4 text-sm">
				<h3 className="font-semibold text-lg">
					Accessibility Statement for {companyWebsite}
				</h3>

				<h4 className="font-semibold">Commitment to Accessibility</h4>
				<p>
					{companyName} is committed to ensuring digital accessibility for
					people with disabilities. We are continually improving the user
					experience for everyone, and applying the relevant accessibility
					standards.
				</p>

				<h4 className="font-semibold">Conformance Status</h4>
				<p>
					The Web Content Accessibility Guidelines (WCAG) defines requirements
					for designers and developers to improve accessibility for people with
					disabilities. It defines three levels of conformance: Level A, Level
					AA, and Level AAA.
				</p>
				<p>{conf.sentence}</p>

				{formData.conformanceLevel !== "full" && (
					<>
						<h4 className="font-semibold">
							Known Limitations and Alternatives
						</h4>
						<p>
							Despite our best efforts to ensure accessibility of{" "}
							{companyWebsite}, there may be some limitations. Below is a
							description of known limitations. Please contact us if you observe
							an issue not listed below.
						</p>
						<ul className="list-disc pl-6 space-y-1">
							{renderedLimitations.map((line, i) => (
								<li key={i}>{line}</li>
							))}
						</ul>
						{formData.remediationTimeline && (
							<p>
								<strong>Remediation timeline:</strong>{" "}
								{formData.remediationTimeline}
							</p>
						)}
					</>
				)}

				<h4 className="font-semibold">Assessment Approach</h4>
				<p>
					{companyName} assessed the accessibility of {companyWebsite} by the
					following approach: {assessmentMethod}. Automated tools cannot detect
					every accessibility issue, so we combine them with manual review and
					user feedback.
				</p>

				<h4 className="font-semibold">Feedback</h4>
				<p>
					We welcome your feedback on the accessibility of {companyWebsite}.
					Please let us know if you encounter accessibility barriers:
				</p>
				<p>Email: {companyEmail}</p>
				{formData.phoneNumber && <p>Phone: {formData.phoneNumber}</p>}
				{formData.address && <p>Address: {formData.address}</p>}
				<p>We try to respond to feedback within 3–5 business days.</p>

				<h4 className="font-semibold">Date</h4>
				<p>
					This statement was created on {generationDate} using the EaseAccess
					accessibility tooling. The site {conf.label} with WCAG 2.2 level AA at
					the time of writing.
				</p>
			</div>
		);
	};

	const isGenerateButtonDisabled =
		!formData.agreedToTerms ||
		!formData.companyName ||
		!formData.websiteUrl ||
		!formData.businessEmail ||
		!isValidUrl(formData.websiteUrl) ||
		!isValidEmail(formData.businessEmail);

	if (pagesLoading && isInitialLoad) {
		return (
			<MotionTextLoader
				text="Loading Statement..."
				variant="dots"
				speed="fast"
			/>
		);
	}

	return (
		<div className="">
			<div>
				{step === 1 && (
					<div className="zn:mb-6">
						<Button
							variant="ghost"
							onClick={() => setStep(statementData ? 2 : 0)}
							className="zn:flex zn:items-center zn:gap-2 zn:text-sm zn:text-muted-foreground"
						>
							<ChevronLeft className="zn:w-4 zn:h-4" />
							Back to Previous
						</Button>
					</div>
				)}

				{(step === 0 || step === 2) && (
					<Card className="zn:flex zn:flex-col zn:items-center zn:justify-center zn:text-center zn:py-[47px]">
						<CardContent>
							<div className="zn:w-24 zn:h-24 zn:bg-gradient-to-b zn:from-white zn:to-[#B2CCFF] zn:rounded-full  zn:mx-auto">
								<BigFile className="zn:relative zn:start-5 zn:top-3" />
							</div>

							{/* Show create UI only if no statement exists */}
							{!statementData && step === 0 && (
								<>
									<div className="zn:text-xl zn:font-semibold zn:mb-1 zn:mt-8">
										Need an accessibility statement?
									</div>
									<div className="zn:text-muted-foreground zn:mb-5">
										You can have a statement created for you or use what you
										already have.
									</div>
									<Button
										size="default"
										className="zn:cursor-pointer"
										onClick={() => setStep(1)}
									>
										<Plus className="zn:w-4 zn:h-4 " />
										Create New Statement & Page
									</Button>
								</>
							)}

							{/* Show existing statement actions if statement exists (for step 2 or fallback when returning) */}
							{statementData &&
								(step === 2 || (step === 0 && statementData)) && (
									<>
										<h2 className="zn:text-xl zn:font-semibold zn:mb-2">
											Accessibility Statement
										</h2>
										<div className="zn:flex zn:gap-2 zn:mb-6">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<div>
														<Button variant="outline" disabled={isLoading}>
															<Download className="zn:w-4 zn:h-4 zn:mr-2" />
															Download
														</Button>
													</div>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<DropdownMenuItem
														onClick={() => handleDownload("pdf")}
													>
														Download as PDF
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDownload("html")}
													>
														Download as HTML
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>

											<Button onClick={() => setStep(1)}>
												<Settings className="zn:w-4 zn:h-4 zn:mr-2" />
												Customize
											</Button>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="outline"
														className="zn:text-red-500 zn:border-red-200 hover:zn:bg-red-50 zn:bg-transparent"
														disabled={isLoading}
													>
														<Trash2 className="zn:w-4 zn:h-4 zn:mr-2" />
														{isLoading ? "Deleting..." : "Delete"}
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Delete Accessibility Statement?
														</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will
															permanently delete the accessibility statement and
															remove the WordPress page from your site.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={handleDeleteStatement}
															className="zn:bg-red-600 zn:text-white hover:zn:bg-red-700"
														>
															Delete Statement
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</>
								)}
						</CardContent>
					</Card>
				)}

				<div className=" zn:grid zn:lg:grid-cols-2 zn:grid-cols-1 zn:gap-6 zn:mt-6">
					{step === 1 ? (
						<Card>
							<CardHeader className="zn:border-b zn:border-default-200 zn:pb-4">
								<div className="zn:text-sm zn:font-semibold zn:text-default-900">
									Generate an Accessibility Statement
								</div>
							</CardHeader>
							<CardContent className="zn:space-y-4">
								<div className="zn:space-y-2">
									<Label
										htmlFor="companyName"
										className="zn:text-sm zn:font-normal"
									>
										Company or organization name
										<span className="zn:text-red-500">*</span>
									</Label>
									<Input
										id="companyName"
										placeholder="Example Inc."
										value={formData.companyName}
										onChange={handleInputChange}
									/>
								</div>
								<div className="zn:space-y-2">
									<Label
										htmlFor="address"
										className="zn:text-sm zn:font-normal"
									>
										Address
									</Label>
									<Input
										id="address"
										placeholder="123 Main Street, City, State 12345"
										value={formData.address}
										onChange={handleInputChange}
									/>
								</div>
								<div className="zn:space-y-2">
									<Label
										htmlFor="websiteUrl"
										className="zn:text-sm zn:font-normal"
									>
										Company website URL
										<span className="zn:text-red-500">*</span>
									</Label>
									<Input
										id="websiteUrl"
										type="url"
										placeholder="https://yourwebsite.com"
										value={formData.websiteUrl}
										onChange={handleInputChange}
										className={cn(
											formData.websiteUrl && !isValidUrl(formData.websiteUrl)
												? "zn:border-red-500 focus:zn:border-red-500 focus:zn:ring-red-500"
												: "",
										)}
									/>
									{formData.websiteUrl && !isValidUrl(formData.websiteUrl) && (
										<p className="zn:text-sm zn:text-red-500">
											Please enter a valid URL starting with http:// or https://
										</p>
									)}
								</div>
								<div className="zn:space-y-2">
									<Label
										htmlFor="businessEmail"
										className="zn:text-sm zn:font-normal"
									>
										Business email<span className="zn:text-red-500">*</span>
									</Label>
									<Input
										id="businessEmail"
										type="email"
										placeholder="contact@yourcompany.com"
										value={formData.businessEmail}
										onChange={handleInputChange}
										className={cn(
											formData.businessEmail &&
												!isValidEmail(formData.businessEmail)
												? "zn:border-red-500 focus:zn:border-red-500 focus:zn:ring-red-500"
												: "",
										)}
									/>
									{formData.businessEmail &&
										!isValidEmail(formData.businessEmail) && (
											<p className="zn:text-sm zn:text-red-500">
												Please enter a valid business email address
											</p>
										)}
								</div>
								<div className="zn:space-y-2">
									<Label
										htmlFor="phoneNumber"
										className="zn:text-sm zn:font-normal"
									>
										Phone number
									</Label>
									<Input
										id="phoneNumber"
										type="tel"
										placeholder="+1 (555) 123-4567"
										value={formData.phoneNumber}
										onChange={handleInputChange}
									/>
								</div>

								{/* --- Honest conformance fields (W3C WAI Statement Generator pattern) --- */}
								<div className="zn:space-y-2">
									<Label
										htmlFor="conformanceLevel"
										className="zn:text-sm zn:font-normal"
									>
										Conformance status
										<span className="zn:text-red-500">*</span>
									</Label>
									<select
										id="conformanceLevel"
										value={formData.conformanceLevel}
										onChange={handleInputChange}
										className="zn:flex zn:h-9 zn:w-full zn:rounded-md zn:border zn:border-input zn:bg-background zn:px-3 zn:py-1 zn:text-sm zn:shadow-sm focus:zn:outline-none focus:zn:ring-1 focus:zn:ring-ring"
									>
										<option value="full">Fully conformant — WCAG 2.2 AA</option>
										<option value="partial">
											Partially conformant — WCAG 2.2 AA (recommended &amp;
											honest)
										</option>
										<option value="non">Non-conformant</option>
									</select>
									<p className="zn:text-xs zn:text-muted-foreground">
										W3C WAI recommends “partially conformant” unless you have
										completed a full third-party audit.
									</p>
								</div>

								<div className="zn:space-y-2">
									<Label
										htmlFor="knownLimitations"
										className="zn:text-sm zn:font-normal"
									>
										Known accessibility limitations
									</Label>
									<textarea
										id="knownLimitations"
										value={formData.knownLimitations}
										onChange={handleInputChange}
										rows={4}
										placeholder={
											"One per line, e.g.:\nSome older PDFs are not tagged for screen readers\nThird-party booking widget may not be keyboard-accessible"
										}
										className="zn:flex zn:min-h-[90px] zn:w-full zn:rounded-md zn:border zn:border-input zn:bg-background zn:px-3 zn:py-2 zn:text-sm zn:shadow-sm focus:zn:outline-none focus:zn:ring-1 zn:focus:ring-ring"
									/>
									<p className="zn:text-xs zn:text-muted-foreground">
										Each line becomes a bullet item. Leave blank for sensible
										defaults.
									</p>
								</div>

								<div className="zn:space-y-2">
									<Label
										htmlFor="remediationTimeline"
										className="zn:text-sm zn:font-normal"
									>
										Remediation timeline
									</Label>
									<Input
										id="remediationTimeline"
										placeholder="e.g. We aim to address known limitations by Q4 2026"
										value={formData.remediationTimeline}
										onChange={handleInputChange}
									/>
								</div>

								<div className="zn:space-y-2">
									<Label
										htmlFor="assessmentMethod"
										className="zn:text-sm zn:font-normal"
									>
										Assessment approach
									</Label>
									<Input
										id="assessmentMethod"
										placeholder="e.g. Self-evaluation using EaseAccess scanner + manual keyboard testing"
										value={formData.assessmentMethod}
										onChange={handleInputChange}
									/>
								</div>

								<div className="zn:space-y-2">
									<Label
										htmlFor="generationDate"
										className="zn:text-sm zn:font-normal"
									>
										What date is this statement being generated?
									</Label>
									<Popover open={dateOpen} onOpenChange={setDateOpen}>
										<PopoverTrigger asChild>
											<div>
												<Button
													variant="outline"
													type="button"
													className="zn:w-full zn:justify-start zn:text-left zn:font-normal"
													id="generationDate"
												>
													<CalendarIcon className="zn:mr-2 zn:h-4 zn:w-4" />
													{formData.generationDate
														? new Date(
																formData.generationDate,
														  ).toLocaleDateString()
														: "Pick a date"}
												</Button>
											</div>
										</PopoverTrigger>
										<PopoverContent className="zn:w-auto zn:p-2" align="start">
											{/* Minimal calendar grid */}
											<Calendar
												mode="single"
												selected={
													formData.generationDate
														? new Date(formData.generationDate)
														: undefined
												}
												onSelect={(date) => {
													if (date) {
														// Validate that the selected date is not in the past
														const today = new Date();
														today.setHours(0, 0, 0, 0);

														if (date < today) {
															toast.error(
																"Please select today's date or a future date for the statement generation.",
															);
															return;
														}

														const iso = date.toISOString().split("T")[0];
														setFormData((prev) => ({
															...prev,
															generationDate: iso,
														}));
														setDateOpen(false);
													}
												}}
												disabled={(date) => {
													// Disable past dates
													const today = new Date();
													today.setHours(0, 0, 0, 0);
													return date < today;
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="zn:flex zn:items-center zn:space-x-2">
									<Checkbox
										id="agreedToTerms"
										checked={formData.agreedToTerms}
										onCheckedChange={(checked) =>
											setFormData((prev) => ({
												...prev,
												agreedToTerms: !!checked,
											}))
										}
									/>
									<Label
										htmlFor="agreedToTerms"
										className="zn:text-sm zn:font-normal zn:leading-none peer-disabled:zn:cursor-not-allowed peer-disabled:zn:opacity-70"
									>
										I confirm the accessibility status is my assessment, and the
										provider assumes no liability.
									</Label>
								</div>
							</CardContent>
							<CardFooter>
								<Button
									className="zn:w-full"
									onClick={handleGenerateStatement}
									disabled={isGenerateButtonDisabled || isLoading}
								>
									<AnimatedSparkle className="zn:h-4 zn:w-4" />
									{isLoading
										? "Generating..."
										: "Generate My Accessibility Statement & Page"}
								</Button>
							</CardFooter>
						</Card>
					) : (
						<Card>
							<CardHeader className="zn:flex zn:flex-row zn:items-center zn:justify-between zn:border-b zn:border-default-200 zn:pb-4">
								<CardTitle>Statement link and Visibility</CardTitle>
							</CardHeader>
							<CardContent className="zn:space-y-4 zn:divide-y zn:divide-default-200 zn:-mx-6  ">
								<div className="zn:flex zn:items-center zn:justify-between zn:space-x-2 zn:px-6 zn:pb-4">
									<LabelTooltip
										label="Add Accessibility Statement to Menubar"
										htmlFor="accessibility-widget"
										tooltip="Add Accessibility Statement to Menubar"
									/>
									<Switch
										id="accessibility-widget"
										checked={accessibilityWidgetEnabled}
										onCheckedChange={setAccessibilityWidgetEnabled}
									/>
								</div>
								{statementData && (
									<div className="zn:space-y-2 zn:px-6 zn:pb-4">
										<Label className="zn:text-xs zn:font-normal">
											Current Statement Page
										</Label>
										<div className="zn:flex zn:items-center zn:gap-2 zn:p-3 zn:bg-green-50 zn:border zn:border-green-200 zn:rounded-md">
											<CheckCircle className="zn:w-4 zn:h-4 zn:text-green-600" />
											<span className="zn:text-sm zn:text-green-800">
												Accessibility Statement
											</span>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													window.open(statementData.page_url, "_blank")
												}
												className="zn:ml-auto zn:h-auto zn:p-1"
											>
												<ExternalLink className="zn:w-4 zn:h-4" />
											</Button>
										</div>
									</div>
								)}

								<div className="zn:space-y-2 zn:px-6 zn:pb-4">
									<LabelTooltip
										htmlFor="choose-page"
										tooltip="Select the page where your accessibility statement is located"
										label="Choose Which Page to Link"
									/>
									<div className="zn:relative zn:h-full">
										<Select
											value={linkPage}
											onValueChange={(val) => {
												// Prevent accidentally setting an empty string which breaks radix Select invariant
												if (val === "") return;
												setLinkPage(val);
											}}
										>
											<SelectTrigger className="zn:w-full">
												<SelectValue placeholder="Select a page" />
											</SelectTrigger>
											<SelectContent>
												{statementData &&
													statementData.page_url &&
													statementData.page_url !== "" && (
														<SelectItem value={statementData.page_url}>
															Accessibility Statement (Generated)
														</SelectItem>
													)}
												{availablePages
													.filter((page) => page.url && page.url !== "")
													.map((page) => (
														<SelectItem key={page.id} value={page.url}>
															{page.title}
														</SelectItem>
													))}
												{/* Fallback to show currently selected linkPage even if statementData.page_url not yet populated */}
												{(!statementData || !statementData.page_url) &&
													linkPage &&
													availablePages.every((p) => p.url !== linkPage) && (
														<SelectItem value={linkPage}>
															Selected Page
														</SelectItem>
													)}
											</SelectContent>
										</Select>
										{/* {linkPage && (
											<Button
												variant="ghost"
												size="icon"
												className="zn:absolute zn:end-8 zn:top-1/2 -zn:translate-y-1/2 zn:h-6 zn:w-6"
												onClick={() => window.open(linkPage, "_blank")}
											>
												<ExternalLink className="zn:h-3 zn:w-3" />
											</Button>
										)} */}
									</div>
								</div>
								<div className="zn:space-y-2 zn:px-6 zn:pb-4">
									<LabelTooltip
										label="Link Text"
										htmlFor="link-text"
										tooltip="Text for the link that appears in the menubar."
									/>

									<Input
										id="link-text"
										placeholder="Statement"
										value={linkText}
										onChange={(e) => setLinkText(e.target.value)}
									/>
								</div>

								{statementData ? (
									<div className="zn:text-start">
										<Button
											onClick={updateStatementSettings}
											className="zn:mx-6 "
											disabled={isLoading}
										>
											{isLoading ? "Updating..." : "Save Settings"}
										</Button>
									</div>
								) : (
									<div className="zn:text-start">
										<Button
											onClick={saveLinkOnlySettings}
											className="zn:mx-6 "
											disabled={
												isLoading || (!linkPage && !accessibilityWidgetEnabled)
											}
										>
											{isLoading ? "Saving..." : "Save Link Settings"}
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{step === 1 ? (
						<Card>
							<CardHeader className="zn:border-b zn:border-default-200 zn:pb-4">
								<CardTitle className=" zn:font-semibold">
									Preview Statement
								</CardTitle>
							</CardHeader>
							<CardContent>{generatePreviewStatement()}</CardContent>
						</Card>
					) : (
						<Card>
							<CardHeader className="zn:flex zn:flex-row zn:items-center zn:justify-between zn:border-b zn:border-default-200 zn:pb-4">
								<CardTitle>Preview Statement link</CardTitle>
							</CardHeader>
							<CardContent clasName="zn:h-full">
								<div
									className={cn(
										"zn:flex zn:relative zn:items-end zn:justify-start zn:h-full zn:min-h-[220px]  zn:bg-default-100 zn:rounded-md",
										{
											"zn:justify-center zn:items-center":
												!accessibilityWidgetEnabled,
										},
										{
											"zn:justify-center zn:items-center":
												accessibilityWidgetEnabled && !linkText,
										},
									)}
								>
									{accessibilityWidgetEnabled && linkText ? (
										<div className="zn:bg-primary zn:text-start zn:flex zn:gap-1.5 zn:text-primary-foreground zn:px-4 zn:py-3 zn:rounded-b-md zn:flex-1 zn:w-full">
											{linkText} <ArrowUpRight className="zn:h-4 zn:w-4" />
										</div>
									) : (
										<div className=" zn:flex-1 zn:h-full zn:w-full zn:text-sm  zn:flex zn:items-center zn:justify-center">
											{accessibilityWidgetEnabled
												? "No link text provided."
												: "Widget is disabled."}
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
