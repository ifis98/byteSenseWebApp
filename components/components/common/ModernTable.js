'use client'

import React, { useState, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { Card, Form, InputGroup, Button } from 'react-bootstrap';
import styles from '../../../styles/common.module.scss';

const ModernTable = ({ data, columns, keyField = 'id', pagination = true, search = true }) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = useMemo(() =>
    columns.map(col => ({
      accessorKey: col.dataField,
      header: col.text,
      cell: info => {
        if (col.formatter) {
          return col.formatter(info.getValue(), info.row.original, info.row.index);
        }
        return info.getValue();
      },
      ...col
    })),
    [columns]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className={styles.modernTableContainer}>
      {/* Search Bar */}
      {search && (
        <div className="mb-3">
          <InputGroup>
            <Form.Control
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search..."
            />
            <Button variant="outline-secondary" onClick={() => setGlobalFilter('')}>
              Clear
            </Button>
          </InputGroup>
        </div>
      )}

      {/* Table */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} onClick={() => {
                    const clickableCol = columns.find(col => col.events?.onClick);
                    if (clickableCol) {
                      clickableCol.events.onClick(row.original);
                    }
                  }}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <span>
                  Page <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
                </span>
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="me-2"
                >
                  Previous
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ModernTable;
