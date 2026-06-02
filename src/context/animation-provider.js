import { createContext, useContext } from "@wordpress/element";

// Animation variants
export const animationVariants = {
	fadeInUp: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	},
	fadeIn: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	},
	slideInLeft: {
		initial: { opacity: 0, x: -20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 20 },
	},
	slideInRight: {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
	},
	scaleIn: {
		initial: { opacity: 0, scale: 0.9 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.9 },
	},
	staggerContainer: {
		animate: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	},
};

const AnimationContext = createContext(undefined);

export function AnimationProvider({ children }) {
	return (
		<AnimationContext.Provider value={{ variants: animationVariants }}>
			{children}
		</AnimationContext.Provider>
	);
}

export function useAnimation() {
	const context = useContext(AnimationContext);
	if (context === undefined) {
		throw new Error("useAnimation must be used within an AnimationProvider");
	}
	return context;
}
