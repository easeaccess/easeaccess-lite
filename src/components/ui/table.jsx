import * as React from "react"

import { cn } from "@/lib/utils"

function Table({
  className,
  ...props
}) {
  return (
    (<div
      data-slot="table-container"
      className="zn:relative zn:w-full zn:overflow-x-auto">
      <table
        data-slot="table"
        className={cn("zn:w-full zn:caption-bottom zn:text-sm", className)}
        {...props} />
    </div>)
  );
}

function TableHeader({
  className,
  ...props
}) {
  return (
    (<thead
      data-slot="table-header"
      className={cn("zn:[&_tr]:border-b", className)}
      {...props} />)
  );
}

function TableBody({
  className,
  ...props
}) {
  return (
    (<tbody
      data-slot="table-body"
      className={cn("zn:[&_tr:last-child]:border-0", className)}
      {...props} />)
  );
}

function TableFooter({
  className,
  ...props
}) {
  return (
    (<tfoot
      data-slot="table-footer"
      className={cn(
        "zn:bg-muted/50 zn:border-t zn:font-medium zn:[&>tr]:last:border-b-0",
        className
      )}
      {...props} />)
  );
}

function TableRow({
  className,
  ...props
}) {
  return (
    (<tr
      data-slot="table-row"
      className={cn(
        "zn:hover:bg-muted/50 zn:data-[state=selected]:bg-muted zn:border-b zn:transition-colors",
        className
      )}
      {...props} />)
  );
}

function TableHead({
  className,
  ...props
}) {
  return (
    (<th
      data-slot="table-head"
      className={cn(
        "zn:text-foreground zn:h-10 zn:px-2 zn:text-left zn:align-middle zn:font-medium zn:whitespace-nowrap zn:[&:has([role=checkbox])]:pr-0 zn:[&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props} />)
  );
}

function TableCell({
  className,
  ...props
}) {
  return (
    (<td
      data-slot="table-cell"
      className={cn(
        "zn:p-2 zn:align-middle zn:whitespace-nowrap zn:[&:has([role=checkbox])]:pr-0 zn:[&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props} />)
  );
}

function TableCaption({
  className,
  ...props
}) {
  return (
    (<caption
      data-slot="table-caption"
      className={cn("zn:text-muted-foreground zn:mt-4 zn:text-sm", className)}
      {...props} />)
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
