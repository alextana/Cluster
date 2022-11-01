import { Organisation } from "@prisma/client";
import { atom } from "jotai";

export const organisationAtom = atom<Organisation[] | null>(null);
