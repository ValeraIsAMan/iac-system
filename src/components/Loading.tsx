import Spinner from "./Spinner";

type loadingProps = {
  isLoading: boolean;
  isError?: boolean;
  error?: string | undefined;
  custom?: string;
};

export const Loading = ({
  isLoading,
  isError,
  error,
  custom,
}: loadingProps) => {
  return (
    <>
      {(isLoading || isError) && (
        <div className="flex h-full w-full items-center justify-center">
          {isLoading && <Spinner color="fill-blue-500" bgColor={custom} />}

          {isError && <div className="text-center">{error}</div>}
        </div>
      )}
    </>
  );
};
