// Inlined from recoil-nexus@0.4.0 — avoids the unresolvable npm package.
// Only RecoilNexus (component) and setRecoil are used in this project,
// but the full API is preserved for completeness.
import { useRecoilCallback, RecoilState } from "recoil";

type ValOrUpdater<T> = T | ((currVal: T) => T);

const nexus: {
  get?: <T>(atom: RecoilState<T>) => T;
  getPromise?: <T>(atom: RecoilState<T>) => Promise<T>;
  set?: <T>(atom: RecoilState<T>, valOrUpdater: ValOrUpdater<T>) => void;
  reset?: <T>(atom: RecoilState<T>) => void;
} = {};

export default function RecoilNexus() {
  nexus.get = useRecoilCallback(
    ({ snapshot }) =>
      <T>(atom: RecoilState<T>) =>
        snapshot.getLoadable(atom).contents,
    [],
  );
  nexus.getPromise = useRecoilCallback(
    ({ snapshot }) =>
      <T>(atom: RecoilState<T>) =>
        snapshot.getPromise(atom),
    [],
  );
  nexus.set = useRecoilCallback(
    ({ transact_UNSTABLE }) =>
      <T>(atom: RecoilState<T>, valOrUpdater: ValOrUpdater<T>) => {
        transact_UNSTABLE(({ set }) => set(atom, valOrUpdater));
      },
    [],
  );
  nexus.reset = useRecoilCallback(
    ({ reset }) =>
      <T>(atom: RecoilState<T>) =>
        reset(atom),
    [],
  );
  return null;
}

export function getRecoil<T>(atom: RecoilState<T>): T {
  return nexus.get!(atom);
}

export function getRecoilPromise<T>(atom: RecoilState<T>): Promise<T> {
  return nexus.getPromise!(atom);
}

export function setRecoil<T>(atom: RecoilState<T>, valOrUpdater: ValOrUpdater<T>): void {
  nexus.set!(atom, valOrUpdater);
}

export function resetRecoil<T>(atom: RecoilState<T>): void {
  nexus.reset!(atom);
}
