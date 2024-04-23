import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { url } from "../constants/the-graph-url.constant";

export const client = new Client({
  url,
  exchanges: [cacheExchange, fetchExchange],
});
