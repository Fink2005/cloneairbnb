'use client'

import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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
import { UserListResType, UserType } from '@/schemaValidations/user.schema'
import AddEmployee from '@/app/manage/accounts/add-employee'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EditEmployee from '@/app/manage/accounts/edit-employee'
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
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import { useDeleteUserMutation, useGetUserList } from '@/queries/useUser'
import { handleErrorApi } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

type AccountItem = UserListResType['content'][0]

const AccountTableContext = createContext<{
  setEmployeeIdEdit: (value: number) => void
  employeeIdEdit: number | undefined
  employeeDelete: AccountItem | null
  setEmployeeDelete: (value: AccountItem | null) => void
}>({
  setEmployeeIdEdit: (value: number | undefined) => { },
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: (value: AccountItem | null) => { }
})

export const columns: ColumnDef<UserType>[] = [
  // {
  //   id: 'checkbox',
  //   header: ({ table }) => (
  //     <input
  //       type="checkbox"
  //       onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
  //       checked={table.getIsAllRowsSelected()}
  //       className="w-4 h-4"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <input
  //       type="checkbox"
  //       checked={row.getIsSelected()}
  //       onChange={() => row.toggleSelected()}
  //       className="w-4 h-4"
  //     />
  //   ),
  // },
  {
    id: 'stt',
    header: 'STT',
    cell: ({ row }) => {
      return (
        <>{row.index + 1}</>
      )
    }
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          ID
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      // const avatarUrl = row.getValue('avatar');
      // console.log(avatarUrl);
      return (
        <div>
          <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
            <AvatarImage src={row.getValue('avatar')} />
            <AvatarFallback className='rounded-none'>{row.original.name}</AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Tên
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>
  },
  // {
  //   accessorKey: 'gender',
  //   header: ({ column }) => {
  //     return (
  //       <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //         Gender
  //         <CaretSortIcon className='ml-2 h-4 w-4' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const gender = row.getValue<boolean>('gender'); // Lấy giá trị boolean
  //     return <div className='capitalize'>{gender ? 'Nam' : 'Nữ'}</div>;
  //   }
  // },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <div className="flex flex-col">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Gender
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        <select
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="mt-1 border border-gray-300 rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="true">Nam</option>
          <option value="false">Nữ</option>
        </select>
      </div>
    ),
    cell: ({ row }) => {
      const gender = row.getValue<boolean>('gender');
      return <div className="capitalize">{gender ? 'Nam' : 'Nữ'}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true; // Hiển thị tất cả nếu không có filter
      return row.getValue(columnId) === (filterValue === 'true');
    }
  },
  // {
  //   accessorKey: 'role',
  //   header: ({ column }) => {
  //     return (
  //       <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //         Role
  //         <CaretSortIcon className='ml-2 h-4 w-4' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className='capitalize'>{row.getValue('role')}</div>
  // },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <div className="flex flex-col">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        <select
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="mt-1 border border-gray-300 rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue('role')}</div>,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true; // Hiển thị tất cả nếu không có filter
      return row.getValue(columnId) === filterValue;
    }
  },
  
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => {
  //     return (
  //       <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //         Email 
  //         <CaretSortIcon className='ml-2 h-4 w-4' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>
  // },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <div className="flex flex-col">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
        <Input
          placeholder="Filter email..."
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="mt-1"
        />
      </div>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    filterFn: (row, columnId, value) => {
      const user = row.original;
      if (user) {
        // const nameMatch = user.name?.toLowerCase().includes(value.toLowerCase()) ?? false;
        // const phoneMatch = user.phone?.toLowerCase().includes(value.toLowerCase()) ?? false;
        const nameMatch = String(user?.name || "").toLowerCase().includes(value.toLowerCase());
        const emailMatch = String(user?.email || "").toLowerCase().includes(value.toLowerCase());
        // const phoneMatch = String(user.phone || "").toLowerCase().includes(value.toLowerCase());
        return nameMatch || emailMatch ;
      }
      return false; // Return false if no user data exists
    }
    // filterFn: 'includesString', // Cách lọc dữ liệu
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setEmployeeIdEdit, setEmployeeDelete } = useContext(AccountTableContext)
      const openEditEmployee = () => {
        // console.log(row.original.id)
        setEmployeeIdEdit(row.original.id)
      }

      const openDeleteEmployee = () => {
        setEmployeeDelete(row.original)
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
            <DropdownMenuItem onClick={openEditEmployee}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteEmployee}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteAccount({
  employeeDelete,
  setEmployeeDelete
}: {
  employeeDelete: AccountItem | null
  setEmployeeDelete: (value: AccountItem | null) => void
}) {

  const {mutateAsync} = useDeleteUserMutation();
  const deleteUser = async () => {
    if(employeeDelete) {
      try {
        const result = await mutateAsync(employeeDelete.id);
        setEmployeeDelete(null);
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
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='bg text-primary-foreground rounded px-1'>{employeeDelete?.name}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteUser}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function AccountTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>()
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(null)


  const userListQuery = useGetUserList();
  const data = userListQuery.data?.content ?? [];
  
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
    },
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <AccountTableContext.Provider value={{ employeeIdEdit, setEmployeeIdEdit, employeeDelete, setEmployeeDelete }}>
      <div className='w-full'>
        <EditEmployee id={employeeIdEdit} setId={setEmployeeIdEdit} onSubmitSuccess={() => { }} />
        <AlertDialogDeleteAccount employeeDelete={employeeDelete} setEmployeeDelete={setEmployeeDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Search name or emails '
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            // onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            onChange={(e) => {
              const filterValue = e.target.value.trim();
              const col = table.getColumn('email');
              col?.setFilterValue(filterValue);
            }}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddEmployee />
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
              pathname='/manage/accounts'
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
