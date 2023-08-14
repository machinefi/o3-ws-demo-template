"use client";

import { TokenInput } from "./TokenInput";
import { RegisterButton } from "./RegisterButton";
import useStore from "@/store";
import { ErrorText } from "../components/text/ErrorText";

export const TokenControl = () => {
  const { errorMsg } = useStore((state) => state);

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row">
        <TokenInput />
        <RegisterButton />
      </div>
      {errorMsg ? (
        <div className="ml-4">
          <ErrorText error={errorMsg} />
        </div>
      ) : (
        <div className="ml-4 text-transparent">errorplaceholder</div>
      )}
    </>
  );
};
