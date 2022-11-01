import { User } from "@prisma/client";
import { atom } from "jotai";

export const userAtom = atom<User | undefined | null>(null);
