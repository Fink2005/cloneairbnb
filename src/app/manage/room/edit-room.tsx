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
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { toast } from '@radix-ui/react-toast'
import { handleErrorApi } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CreateRoomBodyType, CreateRoomBody } from '@/schemaValidations/room.schema';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useGetRoom, useUpdateRoomMutation, useUploadMediaMutation } from '@/queries/useRoom';

export default function EditRoom({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CreateRoomBodyType>({
    resolver: zodResolver(CreateRoomBody),
    defaultValues: {
      id: id,
      tenPhong: "",
      khach: 0,
      phongNgu: 0,
      giuong: 0,
      phongTam: 0,
      moTa: "",
      giaTien: 0,
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: false,
      bep: false,
      doXe: false,
      hoBoi: false,
      banUi: false,
      maViTri: 0,
      hinhAnh: "string"
    }
  })

  const useUpdateRoom = useUpdateRoomMutation();
  const useUploadMedia = useUploadMediaMutation();
  const { data } = useGetRoom({
    id: id as number,
    enabled: Boolean(id)
  })

  useEffect(() => {
    if (data) {
      const { tenPhong, giaTien, moTa, khach, phongNgu, giuong, phongTam, mayGiat, banLa, banUi, tivi, dieuHoa, wifi, bep, doXe, hoBoi, hinhAnh } = data.content;
      console.log('data.content', data.content);
      form.reset({
        id: id,
        tenPhong,
        giaTien,
        moTa,
        khach,
        phongNgu,
        giuong,
        phongTam,
        mayGiat,
        banLa,
        banUi,
        tivi,
        dieuHoa,
        wifi,
        bep,
        doXe,
        hoBoi,
        hinhAnh: hinhAnh ?? undefined,
        maViTri: 0
      })
    }
  }, [data, form])

  const hinhAnh = form.watch('hinhAnh')
  const name = form.watch('tenPhong')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return hinhAnh
  }, [file, hinhAnh])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: CreateRoomBodyType) => {
    if (useUpdateRoom.isPending) return
    if (id) {
      try {
        let body = values
        body = {
          ...values,
          id: id
        }
        const result = await useUpdateRoom.mutateAsync(body);

        if (file) {
          const formData = new FormData();
          const uploadMedia = {
            maPhong: result?.content?.id,
            formFile: formData
          }
          formData.append('formFile', file);
          await useUploadMedia.mutateAsync(uploadMedia)
        }
        toast({
          title: 'Thêm thành công'
        })
        reset();
        setOpen(false);
      } catch (error) {
        handleErrorApi({
          error,
          setError: form.setError
        })
      }
    }
  }
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined)
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật phòng</DialogTitle>
          <DialogDescription>Các trường sau đây là bắ buộc: Tên, ảnh</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='edit-dish-form'
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='hinhAnh'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className='rounded-none'>{name || 'hinhAnh'}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        accept='image/*'
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:3000/' + file.name)
                          }
                        }}
                        className='hidden'
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name='tenPhong'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='tenPhong'>Tên phòng</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='tenPhong' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            console.log("tenPhong", e.target.value);
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
                name='giaTien'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='giaTien'>Giá</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='giaTien' className='w-full' {...field} type='number'
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            console.log("giaTien", Number(e.target.value));
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
                name='moTa'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='moTa'>Mô tả phòng</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Textarea id='moTa' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            console.log("moTa", e.target.value);
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
                name='khach'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='khach'>Số khách</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='khach' type='number' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            console.log("khach", Number(e.target.value));
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
                name='phongNgu'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='phongNgu'>Số phòng ngủ</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='phongNgu' type='number' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            console.log("phongNgu", Number(e.target.value));
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
                name='giuong'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='giuong'>Số giường</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='giuong' type='number' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            console.log("giuong", Number(e.target.value));
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
                name='phongTam'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='phongTam'>Số phòng tắm</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='phongTam' type='number' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            console.log("phongTam", Number(e.target.value));
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
                name='mayGiat'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='mayGiat'>Máy giặt</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='mayGiat'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("mayGiat:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='banLa'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='banLa'>Bàn là</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='banLa'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("banLa:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='banUi'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='banLa'>Bàn Ủi</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='banUi'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("banUi:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tivi'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='tivi'>Tivi</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='tivi'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("tivi:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dieuHoa'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='dieuHoa'>Điều hòa</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='dieuHoa'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("dieuHoa:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='wifi'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='wifi'>Wi-Fi</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='wifi'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("wifi:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bep'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='bep'>Bếp</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='bep'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("bep:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='doXe'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='doXe'>Đỗ xe</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='doXe'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("doXe:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='hoBoi'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='hoBoi'>Hồ bơi</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className="flex items-center space-x-2">
                          <Switch id='hoBoi'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              console.log("hoBoi:", checked);
                              field.onChange(checked);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />



            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-dish-form'>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
