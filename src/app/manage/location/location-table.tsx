'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {formatCurrency, handleErrorApi} from '@/lib/utils';
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import EditLocation from '@/app/manage/location/edit-location'
import AddLocation from '@/app/manage/location/add-location'

import {toast} from '@/hooks/use-toast';
import { LocationListResType } from '@/schemaValidations/location.schema'
import { useDeleteLocationMutation, useGetLocationList } from '@/queries/useLocation'

type LocationItem = LocationListResType['content'][0]

const LocationTableContext = createContext<{
  setLocationIdEdit: (value: number) => void
  locationIdEdit: number | undefined
  locationDelete: LocationItem | null
  setLocationDelete: (value: LocationItem | null) => void
}>({
  setLocationIdEdit: (value: number | undefined) => { },
  locationIdEdit: undefined,
  locationDelete: null,
  setLocationDelete: (value: LocationItem | null) => { }
})

export const columns: ColumnDef<LocationItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'hinhAnh',
    header: 'Ảnh',
    cell: ({ row }) => (
      <div>
        <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
          <AvatarImage src={row.getValue('hinhAnh')} />
          <AvatarFallback className='rounded-none'>{row.original.hinhAnh}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: 'tenViTri',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('tenViTri')}</div>
  },
  {
    accessorKey: 'tinhThanh',
    header: 'Tỉnh thành',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('tinhThanh')}</div>
  },
  // {
  //   accessorKey: 'moTa',
  //   header: 'Mô tả',
  //   cell: ({ row }) => (
  //     <div dangerouslySetInnerHTML={{ __html: row.getValue('moTa') }} className='whitespace-pre-line' />
  //   )
  // },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setLocationIdEdit, setLocationDelete } = useContext(LocationTableContext)
      const openEditLocation = () => {
        setLocationIdEdit(row.original.id)
      }

      const openDeleteLocation = () => {
        setLocationDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditLocation}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteLocation}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteLocation({
  locationDelete,
  setLocationDelete
}: {
  locationDelete: LocationItem | null
  setLocationDelete: (value: LocationItem | null) => void
}) {
  // console.log("🚀 ~ locationDelete id:", locationDelete);


  const {mutateAsync} = useDeleteLocationMutation();
  const deleteLocation = async () => {
    if(locationDelete) {
      try {
        const result = await mutateAsync(locationDelete.id);
        setLocationDelete(null);
        toast({
          title: result.message
        })
      } catch (error) {
        handleErrorApi({
          error,
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(locationDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setLocationDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa location?</AlertDialogTitle>
          <AlertDialogDescription>
            Location <span className='bg text-primary-foreground rounded px-1'>{locationDelete?.tenViTri}</span> sẽ bị xóa
            vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteLocation}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function LocationTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [locationIdEdit, setLocationIdEdit] = useState<number | undefined>()
  const [locationDelete, setLocationDelete] = useState<LocationItem | null>(null)
  
  const locationListQuery = useGetLocationList();
  const data = locationListQuery.data?.content ?? [];

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <LocationTableContext.Provider value={{ locationIdEdit, setLocationIdEdit, locationDelete, setLocationDelete }}>
      <div className='w-full'>
        <EditLocation id={locationIdEdit} setId={setLocationIdEdit} />
        <AlertDialogDeleteLocation locationDelete={locationDelete} setLocationDelete={setLocationDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc tên'
            value={(table.getColumn('tenViTri')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('tenViTri')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddLocation />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/location'
            />
          </div>
        </div>
      </div>
    </LocationTableContext.Provider>
  )
}
