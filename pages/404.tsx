import { useRouter } from "next/router";
import React from "react";
import s from "../styles/Error.module.scss";
const Page404 = () => {
  const router = useRouter();
  const handleGoBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.back();
  };
  return (
    <div className={s.root}>
      <div className="transform -translate-y-10">
        <h1>404 Page not found</h1>
        <a
          onClick={handleGoBack}
          className="cursor-pointer transition-colors hover:text-blue-400 text-md text-center block mt-4 text-blue-500"
        >
          Go Back
        </a>
      </div>
    </div>
  );
};

export default Page404;
