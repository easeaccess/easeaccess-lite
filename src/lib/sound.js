// Sound utility for accessibility widget
let audioContext = null;
let isInitialized = false;

// Initialize AudioContext lazily to avoid browser restrictions
const initAudioContext = () => {
	if (!isInitialized && typeof window !== 'undefined' && window.AudioContext) {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		isInitialized = true;
	}
	return audioContext;
};

// Play a beep sound with specified frequency and duration
export const playBeep = (frequency = 440, duration = 100) => {
	try {
		// Check if sound is enabled
		const svgSettings = JSON.parse(localStorage.getItem('svgSettings') || '{}');
		if (!svgSettings.soundEffectsEnabled) {
			return;
		}

		const context = initAudioContext();
		if (!context) return;

		// Create oscillator
		const oscillator = context.createOscillator();
		const gainNode = context.createGain();

		// Connect nodes
		oscillator.connect(gainNode);
		gainNode.connect(context.destination);

		// Set frequency and wave type
		oscillator.frequency.setValueAtTime(frequency, context.currentTime);
		oscillator.type = 'sine';

		// Set volume envelope
		gainNode.gain.setValueAtTime(0, context.currentTime);
		gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
		gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000);

		// Start and stop
		oscillator.start(context.currentTime);
		oscillator.stop(context.currentTime + duration / 1000);

		// Clean up
		oscillator.onended = () => {
			oscillator.disconnect();
			gainNode.disconnect();
		};
	} catch (error) {
		console.warn('Failed to play sound:', error);
	}
};

// Predefined sounds for different actions
export const sounds = {
	open: () => playBeep(523.25, 100), // C5
	close: () => playBeep(261.63, 100), // C4
	click: () => playBeep(440, 50), // A4
	success: () => playBeep(659.25, 150), // E5
	error: () => playBeep(196, 200), // G3
};

// Check if sound is enabled
export const isSoundEnabled = () => {
	try {
		const svgSettings = JSON.parse(localStorage.getItem('svgSettings') || '{}');
		return svgSettings.soundEffectsEnabled || false;
	} catch {
		return false;
	}
};