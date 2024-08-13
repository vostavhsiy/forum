import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  page: number;
  size: number;
  total: number;
  baseLink: string;
  search?: string;
  filter?: string;
  isQuery?: boolean;
}

export const Pagination: FC<Props> = ({
  page,
  size,
  total,
  baseLink,
  search,
  filter,
  isQuery,
}) => {
  return (
    <div className="flex items-center gap-4 w-full justify-end mt-[30px]">
      <h3>
        Страница {page} из {Math.ceil(total / size) || 1}
      </h3>
      <div className="flex items-center gap-2">
        <Button disabled={page <= 1} asChild={page > 1}>
          {page <= 1 ? (
            "Назад"
          ) : (
            <Link
              href={
                isQuery
                  ? `${baseLink}?page=${page - 1}&${search ? `search=${search}$` : ""}${filter ? `filter=${filter}` : ""}`
                  : `${baseLink}/${page - 1}?${search ? `search=${search}&` : ""}${filter ? `filter=${filter}` : ""}`
              }
            >
              Назад
            </Link>
          )}
        </Button>
        <Button
          disabled={page >= Math.ceil(total / size)}
          asChild={page < Math.ceil(total / size)}
        >
          {page >= Math.ceil(total / size) ? (
            "Вперед"
          ) : (
            <Link
              href={
                isQuery
                  ? `${baseLink}?page=${page + 1}&${search ? `search=${search}&` : ""}${filter ? `filter=${filter}` : ""}`
                  : `${baseLink}/${page + 1}?${search ? `search=${search}&` : ""}${filter ? `filter=${filter}` : ""}`
              }
            >
              Вперед
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
};
