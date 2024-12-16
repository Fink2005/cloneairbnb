"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SignupBody, SignupBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi, setUserToLocalStorage } from "@/lib/utils";
import { useSignupMutation } from "@/queries/useAuth";
import { BirthdayPicker } from "@/app/(public)/auth/BirthdayPicker";
import { CircleAlert } from "lucide-react";

export default function SignupForm({ handleClick }: any) {
  const signupMutation = useSignupMutation();

  const form = useForm<SignupBodyType>({
    resolver: zodResolver(SignupBody),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: null,
      birthday: null,
    },
  });

  const onSubmit = async (data: SignupBodyType) => {
    if (signupMutation.isPending) return;
    try {
      const result = await signupMutation.mutateAsync(data);
      // localStorage.setItem("user", JSON.stringify(user));
      if (result.statusCode == 400) {
        toast({
          variant: "destructive",
          description: (
            <p className="flex text-lg font-normal items-center">
              {" "}
              <CircleAlert className="me-2" />
              Email đã tồn tại
            </p>
          ),
        });
      } else {
        handleClick();
        toast({
          description: `Đăng ký thành công`,
        });
      }
      // window.location.href = "/manage/dashboard";
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <div className="">
      <Card className=" w-full  shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng Ký</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tạo tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
              noValidate
              onSubmit={form.handleSubmit(onSubmit, (err) => {
                console.warn("loi", err);
              })}
            >
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2 ">
                        <Label htmlFor="name">Họ và Tên</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          required
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Mật khẩu</Label>
                        </div>
                        <Input id="password" type="text" required {...field} />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="phone">Số điện thoại</Label>
                        </div>
                        <Input id="phone" type="number" required {...field} />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-start space-x-5">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-2">
                          <Label htmlFor="gender">Giới tính</Label>

                          <Select
                            required
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            } // Convert string "true"/"false" to boolean
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent side="top">
                              <SelectGroup>
                                <SelectItem value="true">Nam</SelectItem>
                                <SelectItem value="false">Nữ</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-2">
                          <Label htmlFor="gender">Giới tính</Label>

                          <Select required onValueChange={field.onChange}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent side="top">
                              <SelectGroup>
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-2 ">
                          <Label htmlFor="birthday">Sinh nhật</Label>

                          <BirthdayPicker field={field} />

                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="">
                  Đăng Ký
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
