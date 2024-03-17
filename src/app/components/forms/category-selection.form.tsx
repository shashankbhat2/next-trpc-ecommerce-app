"use client";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UserCategoryType } from "~/lib/schema";
import { trpc } from "~/trpc/trpc";

const CategorySelectionForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryChanges, setCategoryChanges] = useState<UserCategoryType>({});
  const { data, isLoading } = trpc.getCategories.useQuery({
    page: currentPage,
    pageSize: 6,
  });

  const { mutate: updateUserCategoriesHandler } =
    trpc.updateUserCategories.useMutation();

  const { data: categoryStats, isLoading: isStatsLoading } =
    trpc.getCategoriesCount.useQuery();

  const getPageRange = (totalPages: number) => {
    const totalVisiblePages = 7;
    const visiblePagesHalf = Math.floor(totalVisiblePages / 2);

    let startPage = Math.max(1, currentPage - visiblePagesHalf);
    let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);

    if (currentPage < visiblePagesHalf + 1) {
      endPage = Math.min(totalVisiblePages, totalPages);
    } else if (currentPage > totalPages - visiblePagesHalf) {
      startPage = Math.max(1, totalPages - totalVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };
  const totalPages = categoryStats ? categoryStats.totalPages : 0;
  const visiblePageNumbers = totalPages
    ? getPageRange(totalPages)
    : [1, 2, 3, 4, 5, 6, 7];

  const debouncedUpdateCategories = useCallback(
    debounce(async (categoryChanges) => {
      updateUserCategoriesHandler(categoryChanges);
    }, 1500),
    [],
  );

  useEffect(() => {
    if (Object.keys(categoryChanges).length > 0) {
      debouncedUpdateCategories(categoryChanges);
    }
  }, [categoryChanges, debouncedUpdateCategories]);

  const handleCategoryToggle = async (
    categoryId: string,
    isChecked: boolean,
  ) => {
    setCategoryChanges((prevChanges: any) => ({
      ...prevChanges,
      [categoryId]: isChecked,
    }));
  };

  const mergedUserCategories = useMemo(() => {
    if (data) {
      return { ...data.userCategoryMap, ...categoryChanges };
    }
  }, [data, categoryChanges]);

  return (
    <div className="bg-ct-dark-200 mx-auto flex w-full max-w-md flex-col items-center justify-center gap-1 space-y-5 overflow-hidden rounded-xl border p-4">
      <h1 className="text-2xl font-semibold">Please mark your interests!</h1>
      <p className="text-center">We will keep you notified.</p>
      {data && mergedUserCategories && (
        <div className=" flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col gap-2 text-lg">
            {data.categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 ">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-black"
                  checked={mergedUserCategories[category.id] === true}
                  onChange={(e) =>
                    handleCategoryToggle(category.id, e.target.checked)
                  }
                />{" "}
                <span> {category.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {isLoading && <div>Loading...</div>}

      <div className="flex items-center justify-center gap-2 text-gray-400">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          {"<<"}
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <div className="flex gap-2">
          {visiblePageNumbers.map((number: number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number as number)}
              className={
                number === currentPage
                  ? "font-bold text-black"
                  : "text-normal text-gray-400"
              }
              disabled={number === currentPage || isStatsLoading}
            >
              {number}
            </button>
          ))}
          {visiblePageNumbers[visiblePageNumbers.length - 1] ===
          totalPages ? null : (
            <span>...</span>
          )}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default CategorySelectionForm;
