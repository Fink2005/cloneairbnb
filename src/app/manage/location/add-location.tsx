'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAddLocationMutation, useUploadMediaMutation } from '@/queries/useLocation';
import { handleErrorApi } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { CreateLocationBody, CreateLocationBodyType } from '@/schemaValidations/location.schema'

export default function AddLocation() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const addLocationMutation = useAddLocationMutation();
  const uploadMediaMutation = useUploadMediaMutation();

  const hinhAnhInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreateLocationBodyType>({
    resolver: zodResolver(CreateLocationBody),
    defaultValues: {
      id: 0,
      tenViTri: "",
      tinhThanh: "",
      quocGia: "",
      hinhAnh: undefined
    }
  })
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
    if (addLocationMutation.isPending) return
    try {
      let body = values
      const result = await addLocationMutation.mutateAsync(body);
      if (result?.content?.id) {
        if (file) {
          const formData = new FormData();
          const uploadMedia = {
            maViTri: result?.content?.id,
            formFile: formData
          }
          formData.append('formFile', file);
          await uploadMediaMutation.mutateAsync(uploadMedia)
        }
        toast({
          title: 'Thêm thành công'
        })
        reset();
        setOpen(false);
      }
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
          <span className=''>Thêm phòng</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Thêm phòng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='add-dish-form'
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
                        accept='hinhAnh/*'
                        ref={hinhAnhInputRef}
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
                        onClick={() => hinhAnhInputRef.current?.click()}
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
                            field.onChange( e.target.value);
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
          <Button type='submit' form='add-dish-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
