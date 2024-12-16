'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateUserBody, CreateUserBodyType, UserUpdateBodyType } from '@/schemaValidations/user.schema';
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import {  useState } from 'react';
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useAddUserMutation } from '@/queries/useUser'
import dayjs from 'dayjs';
import { handleErrorApi } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function AddEmployee() {
  const [open, setOpen] = useState(false)
  const addUserMutation = useAddUserMutation();


  const form = useForm<CreateUserBodyType>({
    resolver: zodResolver(CreateUserBody),
    defaultValues: {
      id: 0,
      name: '',
      email: '',
      phone: '',
      birthday: '',
      gender: true,
      role: 'USER',
    }
  })


  // const avatar = form.watch('avatar')
  // const name = form.watch('name')
  // const previewAvatar = () => (file ? URL.createObjectURL(file) : avatar)


  const reset = () => {
    form.reset()
    // setFile(null)
  }

  const onSubmit = async (values: CreateUserBodyType) => {
    if (addUserMutation.isPending) return
    try {
      const result = await addUserMutation.mutateAsync(values);
      toast({
        title: 'Thêm thành công'
      })
      // reset();
      // setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }


  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className=''>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className=''>Tạo tài khoản</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='add-employee-form'
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e)
            })}
          >
            <div className='grid gap-4 py-4'>
             

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Tên</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(e); // Cập nhật giá trị trong form
                            // Bạn có thể thực hiện các logic bổ sung nếu cần
                            console.log("Tên mới:", e.target.value);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id="phone" type="text" className="w-full" {...field}
                          onChange={(e) => {
                            field.onChange(e); // Cập nhật giá trị trong form
                            // Bạn có thể thực hiện các logic bổ sung nếu cần
                            console.log("phone", e.target.value);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='email' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            console.log("email:", e.target.value);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='password'>Password</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='password' type='password' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            console.log("Tên mới:", e.target.value);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="birthday">Ngày sinh</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id="birthday"
                          type="date"
                          className="w-full"
                          placeholder="Chọn ngày"
                          value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''}
                          onChange={(e) => {
                            const isoDate = new Date(e.target.value).toISOString();
                            field.onChange(isoDate);
                            console.log("birthday (ISO Date):", isoDate);
                            // field.onChange((new Date(e.target.value).toISOString).toString());
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="gender">Giới tính</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <select
                          id="gender"
                          {...field}
                          className="w-full p-2"
                          value={field.value ? 'true' : 'false'}
                          onChange={(e) => {
                            // Chuyển đổi giá trị từ string thành boolean
                            field.onChange(e.target.value === 'true'); // Chuyển 'true' thành true, 'false' thành false
                            console.log("gender:", e.target.value === 'true');
                          }}
                        >
                          <option value="true">Nam</option>
                          <option value="false">Nữ</option>
                        </select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />



              {/* Role Field */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="role">Vai trò</Label>
                      <div className='col-span-3 w-full space-y-2'>

                        <select id="role" {...field} className="w-full p-2"
                          onChange={(e) => {
                            field.onChange(e); // Cập nhật giá trị trong form
                            // Bạn có thể thực hiện các logic bổ sung nếu cần
                            console.log("role:", e.target.value);
                          }}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />


            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-employee-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
