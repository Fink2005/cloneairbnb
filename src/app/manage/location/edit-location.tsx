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
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useGetLocation, useUpdateLocationMutation, useUploadMediaMutation } from '@/queries/useLocation'
import { CreateLocationBody, CreateLocationBodyType } from '@/schemaValidations/location.schema'

export default function EditLocation({
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

  const form = useForm<CreateLocationBodyType>({
    resolver: zodResolver(CreateLocationBody),
    defaultValues: {
      id: id,
      tenViTri: "",
      tinhThanh: "",
      quocGia: "",
      hinhAnh: undefined
    }
  })

  const useUpdateLocation = useUpdateLocationMutation();
  const useUploadMedia = useUploadMediaMutation();
  const { data } = useGetLocation({
    id: id as number,
    enabled: Boolean(id)
  })

  useEffect(() => {
    if (data) {
      const { tenViTri, tinhThanh, quocGia, hinhAnh} = data.content;
      console.log('data.content', data.content);
      form.reset({
        id: id,
        tenViTri,
        tinhThanh,
        quocGia,
        hinhAnh
      })
    }
  }, [data, form])

  const hinhAnh = form.watch('hinhAnh')
  const name = form.watch('tenViTri')
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

  const onSubmit = async (values: CreateLocationBodyType) => {
    if (useUpdateLocation.isPending) return
    if (id) {
      try {
        let body = values
        body = {
          ...values,
          id: id
        }
        const result = await useUpdateLocation.mutateAsync(body);

        if (file) {
          const formData = new FormData();
          const uploadMedia = {
            maViTri: result?.content?.id,
            formFile: formData
          }
          formData.append('formFile', file);
          await useUploadMedia.mutateAsync(uploadMedia)
        }
        toast({
          title: 'Update thành công'
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
          <DialogTitle>Cập nhật vị trí</DialogTitle>
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
                name='tenViTri'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='tenViTri'>Tên vị trí</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='tenViTri' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            console.log("tenViTri", e.target.value);
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
                name='tinhThanh'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='tinhThanh'>Tỉnh thành</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='tinhThanh' className='w-full' {...field} type='text'
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            console.log("tinhThanh", e.target.value);
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
                name='quocGia'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='quocGia'>Quốc gia</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='quocGia' className='w-full' {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            console.log("quocGia", e.target.value);
                          }}
                        />
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
          <Button type='submit' form='edit-dish-form'>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
