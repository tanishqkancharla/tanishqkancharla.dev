import { TKBlock } from "../parser/parseTK";

type Transformer<In, Out> = (ast: In) => Out | Promise<Out>;

export type TKBlockTransformer<
	BlockType extends TKBlock["type"],
	Out extends { type: BlockType }
> = Transformer<Extract<TKBlock, { type: BlockType }>, Out>;

export type BlockTransformPlugin<
	BlockType extends TKBlock["type"],
	Out extends { type: BlockType }
> = {
	type: BlockType;
	transform: TKBlockTransformer<BlockType, Out>;
};

export type TypeTransformedBlocks<
	TypeA extends TKBlock["type"],
	OutA extends { type: TypeA },
	TypeB extends TKBlock["type"],
	OutB extends { type: TypeB },
	TypeC extends TKBlock["type"],
	OutC extends { type: TypeC }
> =
	| Exclude<TKBlock, { type: TypeA } | { type: TypeB } | { type: TypeC }>
	| OutA
	| OutB
	| OutC;
