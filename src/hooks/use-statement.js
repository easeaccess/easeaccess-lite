import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

/**
 * Custom hook for managing accessibility statement
 */
export const useStatement = () => {
	const [statementData, setStatementData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch statement data
	const fetchStatement = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiFetch({ path: "/easeaccess-lite/v1/statement" });
			if (response.exists) {
				setStatementData(response.statement_settings);
			} else {
				setStatementData(null);
			}
		} catch (err) {
			console.error("Error fetching statement:", err);
			setError(err.message || "Failed to fetch statement");
			setStatementData(null);
		} finally {
			setIsLoading(false);
		}
	};

	// Create statement
	const createStatement = async (formData) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiFetch({
				path: "/easeaccess-lite/v1/statement",
				method: "POST",
				data: formData,
			});

			if (response.success) {
				// Some responses may provide page_url separately; ensure it's merged.
				const merged = {
					...response.statement_settings,
					page_url:
						response.statement_settings.page_url || response.page_url || "",
				};
				setStatementData(merged);
				return { ...response, statement_settings: merged };
			}
			throw new Error("Failed to create statement");
		} catch (err) {
			console.error("Error creating statement:", err);
			setError(err.message || "Failed to create statement");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Update statement settings
	const updateStatement = async (settings) => {
		setIsLoading(true);
		setError(null);
		try {
			const currentSettings = await apiFetch({ path: "/easeaccess-lite/v1/settings" });

			const updated = {
				...currentSettings,
				statementSettings: {
					...currentSettings.statementSettings,
					...settings,
				},
			};

			await apiFetch({
				path: "/easeaccess-lite/v1/settings",
				method: "POST",
				data: updated,
			});

			setStatementData(updated.statementSettings);
		} catch (err) {
			setError(err.message || "Failed to update statement");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Delete statement
	const deleteStatement = async () => {
		setIsLoading(true);
		setError(null);
		try {
			await apiFetch({
				path: "/easeaccess-lite/v1/statement",
				method: "DELETE",
			});
			setStatementData(null);
		} catch (err) {
			console.error("Error deleting statement:", err);
			setError(err.message || "Failed to delete statement");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Download statement
	const downloadStatement = async (format = "html") => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiFetch({
				path: "/easeaccess-lite/v1/statement/download",
				method: "POST",
				data: { format },
			});

			if (format === "pdf") {
				// For PDF, we need to generate it on the frontend using the HTML content
				await generatePDF(response.content, response.filename);
			} else {
				// For HTML, use direct download
				const blob = new Blob([response.content], { type: response.mime_type });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = response.filename;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}

			return response;
		} catch (err) {
			console.error("Error downloading statement:", err);
			setError(err.message || "Failed to download statement");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Helper function to generate PDF from HTML content
	const generatePDF = async (htmlContent, filename) => {
		try {
			// Method 1: Try browser print-to-PDF
			await printToPDF(htmlContent, filename);
		} catch (error) {
			console.warn("Print-to-PDF failed, trying alternative method:", error);
			try {
				// Method 2: Create a properly formatted HTML file for PDF conversion
				await downloadFormattedHTML(htmlContent, filename);
			} catch (fallbackError) {
				console.error("All PDF generation methods failed:", fallbackError);
				// Method 3: Plain HTML download as final fallback
				const blob = new Blob([htmlContent], { type: "text/html" });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = filename.replace(".pdf", ".html");
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);

				throw new Error("PDF generation failed. Downloaded as HTML instead.");
			}
		}
	};

	// Method 1: Print to PDF using browser print dialog
	const printToPDF = async (htmlContent, filename) => {
		return new Promise((resolve, reject) => {
			try {
				const printWindow = window.open("", "_blank");
				if (!printWindow) {
					reject(new Error("Popup blocked - cannot open print window"));
					return;
				}

				printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Accessibility Statement</title>
                        <meta charset="utf-8">
                        <style>
                            body {
                                font-family: 'Times New Roman', serif;
                                line-height: 1.6;
                                max-width: 100%;
                                margin: 0;
                                padding: 20px;
                                color: #000;
                                background: white;
                            }
                            h2 {
                                color: #000;
                                font-size: 20px;
                                margin-top: 20px;
                                margin-bottom: 10px;
                                border-bottom: 1px solid #000;
                                padding-bottom: 5px;
                            }
                            h3 {
                                color: #000;
                                font-size: 16px;
                                margin-top: 15px;
                                margin-bottom: 8px;
                            }
                            p {
                                margin-bottom: 12px;
                                text-align: justify;
                                font-size: 12px;
                            }
                            @media print {
                                body {
                                    margin: 0;
                                    padding: 0.5in;
                                }
                                @page {
                                    margin: 0.5in;
                                    size: A4;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${htmlContent}
                        <script>
                            window.onload = function() {
                                setTimeout(function() {
                                    window.print();
                                    window.close();
                                }, 1000);
                            };
                        </script>
                    </body>
                    </html>
                `);

				printWindow.document.close();

				// Resolve after a delay to allow print dialog to open
				setTimeout(() => {
					resolve();
				}, 2000);
			} catch (error) {
				reject(error);
			}
		});
	};

	// Method 2: Download formatted HTML optimized for PDF conversion
	const downloadFormattedHTML = async (htmlContent, filename) => {
		const formattedHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Accessibility Statement</title>
                <style>
                    @media screen {
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            max-width: 800px;
                            margin: 20px auto;
                            padding: 20px;
                            color: #333;
                            background: white;
                        }
                        .print-instruction {
                            background: #f0f8ff;
                            border: 2px solid #2563eb;
                            border-radius: 8px;
                            padding: 15px;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        .print-button {
                            background: #2563eb;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin: 10px;
                        }
                        .print-button:hover {
                            background: #1d4ed8;
                        }
                    }
                    @media print {
                        .print-instruction {
                            display: none;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        @page {
                            margin: 1in;
                            size: A4;
                        }
                    }
                    h2 {
                        color: #2563eb;
                        font-size: 24px;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 10px;
                    }
                    h3 {
                        color: #2563eb;
                        font-size: 18px;
                        margin-top: 20px;
                        margin-bottom: 10px;
                    }
                    p {
                        margin-bottom: 15px;
                        text-align: justify;
                    }
                </style>
            </head>
            <body>
                <div class="print-instruction">
                    <h3>🖨️ Ready to Save as PDF</h3>
                    <p>To save this accessibility statement as a PDF:</p>
                    <ol style="text-align: left; display: inline-block;">
                        <li>Click the "Print/Save as PDF" button below, or use Ctrl+P (Cmd+P on Mac)</li>
                        <li>In the print dialog, select "Save as PDF" as the destination</li>
                        <li>Choose your save location and click "Save"</li>
                    </ol>
                    <br>
                    <button class="print-button" onclick="window.print()">🖨️ Print/Save as PDF</button>
                    <button class="print-button" onclick="window.close()">❌ Close</button>
                </div>
                ${htmlContent}
                <script>
                    // Auto-focus for better accessibility
                    document.addEventListener('DOMContentLoaded', function() {
                        const printBtn = document.querySelector('.print-button');
                        if (printBtn) printBtn.focus();
                    });
                </script>
            </body>
            </html>
        `;

		// Open in new window
		const pdfWindow = window.open("", "_blank");
		if (!pdfWindow) {
			throw new Error("Popup blocked - cannot open PDF generation window");
		}

		pdfWindow.document.write(formattedHTML);
		pdfWindow.document.close();
	};

	// Check if statement is enabled in widget
	const isStatementEnabledInWidget = () => {
		return statementData?.widget_enabled && statementData?.page_url;
	};

	// Get statement link data for widget
	const getStatementLinkData = () => {
		if (!isStatementEnabledInWidget()) return null;

		return {
			url: statementData.page_url,
			text: statementData.link_text || "Accessibility Statement",
			enabled: statementData.widget_enabled,
		};
	};

	// Initial fetch on mount
	useEffect(() => {
		fetchStatement();
	}, []);

	return {
		statementData,
		isLoading,
		error,
		fetchStatement,
		createStatement,
		updateStatement,
		deleteStatement,
		downloadStatement,
		isStatementEnabledInWidget,
		getStatementLinkData,
	};
};

export default useStatement;
