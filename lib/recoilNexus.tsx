// Inlined from recoil-nexus@0.4.0 — avoids the unresolvable npm package.
import { useRecoilCallback, RecoilState } from "recoil";

type ValOrUpdater<T> = T | ((currVal: T) => T);

// Internal storage uses `any` — generics live on the exported functions below.
const nexus: {
  get?: (atom: RecoilState<any>) => any;
  getPromise?: (atom: RecoilState<any>) => Promise<any>;
  set?: (atom: RecoilState<any>, valOrUpdater: any) => void;
  reset?: (atom: RecoilState<any>) => void;
} = {};

export default function RecoilNexus() {
  nexus.get = useRecoilCallback(
    ({ snapshot }) =>
      (atom: RecoilState<any>) =>
        snapshot.getLoadable(atom).contents,
    [],
  );
  nexus.getPromise = useRecoilCallback(
    ({ snapshot }) =>
      (atom: RecoilState<any>) =>
        snapshot.getPromise(atom),
    [],
  );
  nexus.set = useRecoilCallback(
    ({ transact_UNSTABLE }) =>
      (atom: RecoilState<any>, valOrUpdater: any) => {
        transact_UNSTABLE(({ set }) => set(atom, valOrUpdater));
      },
    [],
  );
  nexus.reset = useRecoilCallback(
    ({ reset }) =>
      (atom: RecoilState<any>) =>
        reset(atom),
    [],
  );
  return null;
}

export function getRecoil<T,>(atom: RecoilState<T>): T {
  return nexus.get!(atom);
}

export function getRecoilPromise<T,>(atom: RecoilState<T>): Promise<T> {
  return nexus.getPromise!(atom);
}

export function setRecoil<T,>(atom: RecoilState<T>, valOrUpdater: ValOrUpdater<T>): void {
  nexus.set!(atom, valOrUpdater);
}

export function resetRecoil<T,>(atom: RecoilState<T>): void {
  nexus.reset!(atom);
}