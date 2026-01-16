import React from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  console.log(columns,'columns')
  console.log(data,'data')
  return (
    <div className="overflow-x-auto rounded-lg border-black w-full">
      <table className="min-w-full bg-grey-50">
        <thead className="bg-gray-50 border-b-grey-200">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-3 text-sm font-semibold text-gray-600"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data?.map((row, idx) => (
            <tr
              key={idx}
              className="border-b-grey-20 hover:bg-gray-50 transition"
            >
              {columns?.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm">
                  {col.render
                    ? col.render((row as any)[col.key], row)
                    : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
