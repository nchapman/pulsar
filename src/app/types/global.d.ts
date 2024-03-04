declare module '*.svg' {
  import { FC, SVGProps } from 'preact/compat';

  const SVG: FC<SVGProps<SVGSVGElement>>;
  export default SVG;
}

type ValueOf<T> = T[keyof T];

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type OptionalRecord<R extends keyof any, T> = {
  [P in R]?: T;
};

type Id = string;

interface IdObj {
  id: Id;
}
type Dto<T extends IdObj> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateDto<T extends IdObj> = Partial<Dto<T>>;
