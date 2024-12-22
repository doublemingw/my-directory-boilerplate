// import "server-only";

// import { experimental_taintUniqueValue } from "react";

// export const token = process.env.SANITY_API_READ_TOKEN;
export const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_TOKEN");
}

// TODO(javayhu) env vars maybe wrong configed, need to check later
// TypeError: (0 , react__WEBPACK_IMPORTED_MODULE_1__.experimental_taintUniqueValue) is not a function
// experimental_taintUniqueValue(
//   "Do not pass the sanity API read token to the client.",
//   process,
//   token,
// );
