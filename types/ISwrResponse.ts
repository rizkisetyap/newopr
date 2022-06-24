import { KeyedMutator, SWRResponse } from "swr";

export default interface ISWResponse<T> extends SWRResponse<any, any> {
  data?: T[] | T | null;
  error: any;
  isValidating: boolean;
  mutate: KeyedMutator<any>;
}
