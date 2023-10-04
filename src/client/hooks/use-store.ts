import { useProducer, UseProducerHook } from "@rbxts/react-reflex";
import { RootStore } from "client/store";

export const useStore: UseProducerHook<RootStore> = useProducer;
