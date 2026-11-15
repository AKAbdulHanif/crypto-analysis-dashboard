import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getSmartMoneyActivity, getTokenData } from "./nansen-client";

export const nansenRouter = router({
  getTokenData: publicProcedure
    .input(z.object({ symbols: z.array(z.string()).optional() }))
    .query(({ input }) => getTokenData(input.symbols)),
  getSmartMoneyActivity: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(({ input }) => getSmartMoneyActivity(input.symbol)),
});
