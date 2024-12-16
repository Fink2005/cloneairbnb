'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserUpdateBody, UserUpdateBodyType } from '@/schemaValidations/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useGetUser, useUpdateMutation } from '@/queries/useUser'
import dayjs from 'dayjs';
import { handleErrorApi } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function EditEmployee({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {

  // console.log('id', id)
  const [file, setFile] = useState<File | null>(null)
  const form = useForm<UserUpdateBodyType>({
    resolver: zodResolver(UserUpdateBody),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthday: '',
      gender: true,
      role: 'USER',
    }
  })



  const updateUserMutation = useUpdateMutation();

  const { data } = useGetUser({
    id: id as number,
    enabled: Boolean(id)
  })

  useEffect(() => {
    if (data) {
      const { name, email, role, gender, phone, birthday } = data.content;
      form.reset({
        name,
        role,
        gender,
        phone,
        birthday,
        email
      })
    }
  }, [data, form])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: UserUpdateBodyType) => {
    if(updateUserMutation.isPending) return
    try {
      let body: UserUpdateBodyType & {id: number} = {id: id as number, ...values};
      const result = await updateUserMutation.mutateAsync(body);
      toast({
        description: result.statusCode
      })
      onSubmitSuccess && onSubmitSuccess();
      setId(undefined);
      reset();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }


  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
          reset();
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='edit-employee-form'
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
                        <Input id='name' className='w-full' {...field} />
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
                        <Input id='email' className='w-full' {...field} />
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
                            // Cập nhật giá trị birthday trong form dưới định dạng 'YYYY-MM-DD'
                            field.onChange((e.target.value));
                            console.log("birthday:", e.target.value);
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
        <div className="items-center gap-2 md:ml-auto flex">
          <Button variant="outline" size="sm" type="reset">
            Hủy
          </Button>
          <Button type='submit' form='edit-employee-form'>
            Lưu
          </Button>
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
