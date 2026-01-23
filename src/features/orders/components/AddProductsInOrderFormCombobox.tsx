import * as React from "react";
import { IconChevronDown } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductModel } from "@/generated/prisma/models";

interface AddProductsInOrderFormComboboxProps {
  items: ProductModel[];
  onSelect: (productId: number) => void;
}

export function AddProductsInOrderFormCombobox({
  items,
  onSelect,
}: AddProductsInOrderFormComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between"
        >
          Select product...
          <IconChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="Search product..." className="h-9" />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name} // Use name for search filtering
                  onSelect={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                >
                  {item.name}
                  {/* Check icon removed as the item will disappear from list upon selection */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
