"use client";
import SigninForm from "@/app/(public)/auth/SigninForm";
import { DialogHeader, DialogOverlay } from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import React, { useState } from "react";
import SignupForm from "@/app/(public)/auth/SignupForm";
import { Button } from "@/components/ui/button";

export default function AuthBox() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState<string>("signin");

  const handleClick = () => {
    setTabValue("signin");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-md font-medium w-full cursor-pointer flex justify-start"
            onClick={() => setOpen(true)}
          >
            <p className="text-sm">Đăng nhập / Đăng ký</p>
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-20" />
          <DialogContent className="w-[500px] p-5 border fixed dark:bg-black bg-white shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl z-20 px-3">
            <DialogHeader>
              <DialogTitle className="text-center font-semibold text-lg py-5">
                Đăng nhập hoặc đăng ký
              </DialogTitle>
            </DialogHeader>
            <hr />
            <div className="h-auto">
              <Tabs
                value={tabValue}
                onValueChange={setTabValue}
                className="w-full h-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Đăng Nhập</TabsTrigger>
                  <TabsTrigger value="signup">Đăng ký</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <SigninForm handleClose={handleClose} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm handleClick={handleClick} />
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
