export function isRenderableComponent(Component) {
	return (
		typeof Component === "string" ||
		typeof Component === "function" ||
		(!!Component && typeof Component === "object" && "$$typeof" in Component)
	);
}
