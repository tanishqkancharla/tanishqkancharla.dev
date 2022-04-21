import { TKBlock } from "../parser/parseTK";

type Transformer<In, Out> = (ast: In) => Out | Promise<Out>;

export type TKBlockTransformer<
	BlockType extends TKBlock["type"],
	Out extends { type: BlockType }
> = Transformer<TKBlock, Exclude<TKBlock, { type: BlockType }> | Out>;
