type ArgumentTypes<F extends Function> = F extends (...args: infer A) => unknown ? A : never;

type AsyncFunction<A = unknown, O = unknown> = (...args: A) => Promise<O>;

type Nullable<T> = { [P in keyof T]: T[P] | null };

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

declare global {
  interface Window {
    tabId?: string;
  }
}
