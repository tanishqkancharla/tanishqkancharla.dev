import { FlutedGlass } from "@paper-design/shaders-react";

type HeaderShaderProps = {
	image: string;
};

export function HeaderShader({ image }: HeaderShaderProps) {
	return (
		<FlutedGlass
			image={image}
			colorBack="#00000000"
			colorShadow="#000000"
			colorHighlight="#ffffff"
			size={0.5}
			shadows={0.25}
			highlights={0.1}
			shape="lines"
			angle={0}
			distortionShape="prism"
			distortion={0.5}
			shift={0}
			stretch={0}
			blur={0}
			edges={0.25}
			margin={0}
			grainMixer={0}
			grainOverlay={0}
			fit="cover"
			width="100%"
			height="100%"
			minPixelRatio={1}
			style={{ width: "100%", height: "100%", display: "block" }}
		/>
	);
}
