declare namespace JSX {
	interface IntrinsicElements {
		proximityprompt: JSX.IntrinsicElement<ProximityPrompt>;
		highlight: JSX.IntrinsicElement<Highlight>;
		folder: JSX.IntrinsicElement<Folder>;
		part: JSX.IntrinsicElement<Part>;
		motor6d: JSX.IntrinsicElement<Motor6D>;
		blureffect: JSX.IntrinsicElement<BlurEffect>;
		worldmodel: JSX.IntrinsicElement<WorldModel>;
		texture: JSX.IntrinsicElement<Texture>;
		rigidconstraint: JSX.IntrinsicElement<RigidConstraint>;
		attachment: JSX.IntrinsicElement<Attachment>;
		trail: JSX.IntrinsicElement<Trail>;
	}
}

interface FlipbookProps<Controls> {
	controls: Controls;
}
