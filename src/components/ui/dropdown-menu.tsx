"use client";
import * as React from "react";
import * as M from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = M.Root;
export const DropdownMenuTrigger = M.Trigger;
export const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof M.Content>, React.ComponentPropsWithoutRef<typeof M.Content>>(({ className, sideOffset = 8, ...p }, ref) => (
  <M.Portal><M.Content ref={ref} sideOffset={sideOffset} className={cn("z-50 min-w-[14rem] overflow-hidden rounded-md border bg-popover p-1.5 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", className)} {...p} /></M.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";
export const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof M.Item>, React.ComponentPropsWithoutRef<typeof M.Item>>(({ className, ...p }, ref) => (
  <M.Item ref={ref} className={cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:size-4", className)} {...p} />
));
DropdownMenuItem.displayName = "DropdownMenuItem";
export const DropdownMenuLabel = ({ className, ...p }: React.ComponentPropsWithoutRef<typeof M.Label>) => <M.Label className={cn("px-2.5 py-2 text-sm font-semibold", className)} {...p} />;
export const DropdownMenuSeparator = ({ className, ...p }: React.ComponentPropsWithoutRef<typeof M.Separator>) => <M.Separator className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...p} />;
