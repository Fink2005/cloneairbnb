// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import React, { useState } from 'react';

// function UploadExcelForm() {
//   const [file, setFile] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
//       if (fileExtension === 'xls' || fileExtension === 'xlsx') {
//         setFile(selectedFile);
//         console.log('File hợp lệ:', selectedFile.name);
//       } else {
//         alert('Vui lòng chọn file Excel hợp lệ (.xls, .xlsx)');
//         event.target.value = ''; // Reset input
//         setFile(null);
//       }
//     }
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!file) {
//       alert('Vui lòng chọn file Excel trước khi thêm!');
//       return;
//     }
//     // Thực hiện logic xử lý file
//     console.log('File được tải lên:', file);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="">
//       <div className="flex">
//           <Input
//             id="file"
//             type="file"
//             accept=".xls,.xlsx"
//             onChange={handleFileChange}
//             placeholder="Chọn file Excel"
//             className="block w-full"
//           />
//           <Button type="submit" className='ml-2'>
//             Add
//           </Button>
//       </div>
//     </form>
//   );
// }

// export default UploadExcelForm;
