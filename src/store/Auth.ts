import { atom } from "jotai";

type Session = { id: string } & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export const userAtom = atom<Session | undefined | null>(null);
