import { protectedProcedure, publicProcedure, t } from "~/trpc/trpc-server";
import {
  createCategory,
  getCategoryStats,
  getPaginatedCategories,
  updateUserCategoryHandler,
} from "../controllers/category.controller";
import {
  CreateCategoryInputSchema,
  PaginationInputSchema,
  UpdateUserCategorySchema,
} from "~/lib/schema";

const CategoryRouter = t.router({
  createCategory: publicProcedure
    .input(CreateCategoryInputSchema)
    .mutation(createCategory),
  getCategories: protectedProcedure
    .input(PaginationInputSchema)
    .query(getPaginatedCategories),
  getCategoriesCount: protectedProcedure.query(getCategoryStats),
  updateUserCategories: protectedProcedure
    .input(UpdateUserCategorySchema)
    .mutation(updateUserCategoryHandler),
});

export default CategoryRouter;
