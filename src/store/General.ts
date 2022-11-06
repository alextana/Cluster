import { atom } from "jotai";

export const loginSetupPage = atom<"create-org" | "join-org" | null>(null);
export const expandedTask = atom<string | null>("");
