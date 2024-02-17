"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@/components/Loader";

const filters = [
  {
    value: "subscribers",
    label: "Сначала популярные",
  },
  {
    value: "name",
    label: "По имени",
  },
  {
    value: "new",
    label: "Сначала новые",
  },
  {
    value: "old",
    label: "Сначала старые",
  },
];

interface Props {
  filter?: string;
}

export function Filter({ filter }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(filter || filters[0].value);

  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();

  const router = useRouter();
  const selectHandler = (currentValue: string) => {
    startTransition(() => {
      router.push(
        `/users/1?filter=${currentValue}&${searchParams.get("search") ? `search=${searchParams.get("search")}` : ""}`,
      );
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {isPending && <Loader />}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={isPending}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {filters.find((filter) => filter.value === value)?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {filters.map((filter) => (
              <CommandItem
                key={filter.value}
                value={filter.value}
                onSelect={async (currentValue) => {
                  setValue(currentValue);
                  setOpen(false);
                  selectHandler(currentValue);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === filter.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {filter.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
