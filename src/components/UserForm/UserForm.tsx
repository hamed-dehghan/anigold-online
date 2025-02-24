import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Viewer } from '../viewer/viewer';
import { Button } from '../ui/button';
import Icon from '../../lib/icon';
import { FormField } from '../FormField/FormField';
import TooltipProvider from '../../common/Tooltips';
import Toast from '../Toast/Toast';
import { convertImageUrl } from '../../lib/convertImageUrl';
import { useDropzone } from 'react-dropzone';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import ImageGalleryComponent from '../ImageGallery/ImageGallery';
import logoUploadProfile from '../../assets/images/avatar.png'
import { GetAllRole } from '../../lib/endPointes/role/getRole';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Modal } from '../../common/Modal/Modal';
import AddRole from './AddRole';
interface UserProduct {
    mode: 'add' | 'edit' | 'view' | 'updatePassword';
    initialData?: any;
    onSubmit?: (data: any) => Promise<void>;
    onClose: () => void;
    onEditSuccess?: (updatedProduct: any) => void;
    onAddSuccess?: (newProduct: any) => void;
    onDeleteImage?: (fileCode: string, productId: number) => void;
}

const UserForm: React.FC<UserProduct> = ({
    mode,
    initialData,
    onSubmit,
    onClose,
    onEditSuccess,
    onAddSuccess,
    onDeleteImage
}) => {
    const [currentMode, setCurrentMode] = useState<'add' | 'edit' | 'view' | 'updatePassword'>(mode);
    const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null); // State for selected image
    const [roles, setRoles] = useState<any>([]) //for save role fetched from endpoint
    const [openSelectedRole, setOpenSelectedRole] = useState(false);
    const [openModalAddRole, setOpenModalAddRole] = useState(false);
    const [againFetch, setAginFetch] = useState(false) //temp for updtate roles
    const handleAgainFetchRole = () => {
        setAginFetch((pre) => !pre)
    }

    const handleToggleModalAddRole = () => {
        setOpenModalAddRole(!openModalAddRole)
    }

    const addRolde = (data) => {
        setRoles((pre) => [
            ...pre, // Spread the previous state
            data,  // Add the new role
        ]);
    };

    const fetchAllRole = async () => {
        const response = await GetAllRole()
        if (response.data.isSuccessful) {
            setRoles(response.data.data.data)
        }
    }

    // useEffect(() => {
    //     fetchAllRole()
    // }, [againFetch])

    // Upload image state
    const [files, setFiles] = useState<File[]>([]);
    const uploadedFileRefs = useRef<{ [key: string]: string }>({});

    // Function to handle image click
    const handleImageClick = () => {
        const productImages = {
            original: convertImageUrl(initialData.fileCode),
            thumbnail: convertImageUrl(initialData.fileCode),
        };
        setSelectedImage(productImages);
        setIsImageGalleryOpen(true);
    };

    // Handle dropZone
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
        onDrop: async (acceptedFiles) => {
            if (currentMode === 'view') return;

            setFiles([...files, ...acceptedFiles]);

            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append("Content", file);

                try {
                    // Commenting out the API call
                    // const response = await UploadSingleFile(formData);
                    // if (response.data.isSuccessful) {
                    //     uploadedFileRefs.current[file.name] = response.data.data;
                    //     Toast({
                    //         message: 'آپلود عکس با موفقیت انجام شد',
                    //         type: 'success'
                    //     })
                    // }
                    Toast({
                        message: 'آپلود عکس با موفقیت انجام شد',
                        type: 'success'
                    });
                } catch (error: any) {
                    Toast({ message: error.message, type: 'error' });
                }
            }
        },
        disabled: currentMode === 'view',
    });

    const removeFile = (file: File) => {
        setFiles(files.filter(f => f !== file));
        delete uploadedFileRefs.current[file.name];
    };

    const {
        control,
        handleSubmit,
        reset,
        trigger,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: currentMode === 'add' ? {
            name: '',
            userName: '',
            fullName: '',
            password: '',
            rePassword: '',
            description: '',
            roleId: ''
        } : {
            name: initialData?.name,
            userName: initialData?.userName,
            fullName: initialData?.fullName,
            password: '',
            rePassword: '',
            description: initialData?.description,
            roleId: initialData?.roleName
        },
    });

    const password = useWatch({ control, name: 'password' });

    // This function validates that the rePassword matches the password.
    const validatePasswordMatch = (value: string) =>
        value === password || 'رمز عبور و تکرار آن باید یکسان باشند';

    // Regular expression rule that disallows any Farsi characters.
    const noFarsiPattern = {
        value: /^[^\u0600-\u06FF]*$/,
        message: 'ورودی به زبان فارسی مجاز نمی‌باشد'
    };
    const handleFormSubmit = async (data: any) => {

        if (data.password !== data.rePassword) {
            setError('rePassword', { type: 'manual', message: 'رمز عبور و تکرار آن باید یکسان باشند' });
            return;
        }
        const formData = {
            ...Object.fromEntries(Object.entries(data).filter(([_, value]) => value)),
            id: initialData?.id,
            photoFileCode: Object.values(uploadedFileRefs.current)[0] || '',
            // roleId: initialData?.roleId || role,
            userLevelId: 1,
        };

        try {
            // Commenting out the API call
            // const response = await onSubmit?.(formData);
            // Simulate a successful response
            const response = { data: { isSuccessful: true, getMessageText: ['کاربر با موفقیت ذخیره شد'] } };

            if (response?.data?.isSuccessful) {
                onEditSuccess?.(formData);
                onAddSuccess?.(formData);
                reset();
                onClose();
                response.data.getMessageText?.forEach((msg: string) =>
                    Toast({ message: msg, type: 'success' })
                );
            } else {
                response?.data?.message?.forEach((msg: any) =>
                    Toast({ message: msg?.messageText, type: 'error' })
                );
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Toast({ message: 'خطا در ارسال فرم. لطفا دوباره تلاش کنید.', type: 'error' });
        }
    };

    const handleCloseModal = () => {
        reset();
        onClose();
    };

    return (
        <Viewer
            SpecificationShow={false}
            HeaderShow={false}
            sepratorShow={false}
            headerTitlePrefix={
                mode === 'add'
                    ? 'ایجاد کاربر جدید'
                    : mode === 'edit'
                        ? 'ویرایش کاربر'
                        : mode === 'updatePassword'
                            ? 'تغیر رمز عبور'
                            : 'مشاهده کاربر'
            }
            onClose={handleCloseModal}
        >
            <div className="md:max-w-full w-full sm:w-full mx-auto md:mx-0">
                <div className="text-gray_45 flex flex-col items-center justify-center md:flex-row md:justify-between h-[63px] pt-9 md:pt-3 pr-3 md:items-start mt-2">
                    <div className="flex justify-between items-start gap-2">
                        <span className="truncate">
                            {mode === 'add'
                                ? 'ایجاد کاربر جدید'
                                : mode === 'edit'
                                    ? 'ویرایش کاربر'
                                    : mode === 'updatePassword'
                                        ? 'تغیر رمز عبور'
                                        : 'مشاهده کاربر'}
                        </span>
                        <TooltipProvider content={'کنید'} isShowTooltip={false}>
                            <Icon
                                icon="question"
                                className="w-6 h-6 border p-1 rounded-[50px] fill-white text-blue"
                            />
                        </TooltipProvider>
                    </div>
                    <div className="flex gap-3">
                        {currentMode === 'view' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-[21px] h-[20px] bg-yellow_5 hover:bg-yellow_5 rounded-[8px] py-[2px]"
                                onClick={() => setCurrentMode('edit')}
                            >
                                <Icon icon="edite" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-[21px] h-[20px] md:hover:bg-MainColor rounded-[20px] px-[5px] py-[10px] order-2"
                            onClick={handleCloseModal}
                        >
                            <Icon icon="xmark" size={13} />
                        </Button>
                    </div>
                </div>
                <div className="w-full border mt-4 md:mt-0"></div>

                {/* Image Uploader and Gallery Section */}
                {currentMode !== 'updatePassword' && (
                    <>
                        <div
                            className={`${currentMode === 'edit' && 'flex border-dashed border'}  w-fit md:max-w-full min-w-[140px] gap-4 mt-2 border p-3 rounded-[4px] border-boderFileUploader border-dashed h-[150px] cursor-pointer`}
                        >
                            <ScrollArea dir="rtl" className="max-w-xs lg:max-w-3xl ">
                                <div className="flex gap-2 ">
                                    {initialData?.fileCode && (
                                        <div key={initialData?.fileCode} className="relative">
                                            <img
                                                src={convertImageUrl(initialData?.fileCode)}
                                                alt={`Product ${initialData?.fileCode}`}
                                                className="h-[115px] max-w-[140px] object-cover rounded-[8px]"
                                                onClick={() => handleImageClick()}
                                            />
                                            {(currentMode === 'edit' || currentMode === 'add') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-[95px] left-[120px] bg-red-500 hover:bg-red-600 w-5 h-5 text-white rounded-full p-1"
                                                    onClick={() =>
                                                        onDeleteImage?.(initialData.fileCode, initialData.id)
                                                    }
                                                >
                                                    <Icon icon="trash" size={13} />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                    {files?.length > 0 &&
                                        files.map((item: File) => (
                                            <div key={item.name} className="relative">
                                                <img
                                                    src={URL.createObjectURL(item)}
                                                    alt={item.name}
                                                    className="h-[115px] max-w-[140px] object-cover rounded-[8px]"
                                                    onClick={() => handleImageClick()}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-[95px] left-[120px] bg-red-500 hover:bg-red-600 w-5 h-5 text-white rounded-full p-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(item);
                                                    }}
                                                >
                                                    <Icon icon="trash" size={13} />
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            {currentMode !== 'view' && files?.length < 1 && (
                                <div
                                    {...getRootProps()}
                                    className="min-w-[130px] lg:min-w-[140px] h-[117px] border border-dashed border-boderFileUploader flex items-center justify-between pt-5 rounded-[8px] flex-col"
                                >
                                    <input {...getInputProps()} />
                                    <img src={logoUploadProfile} alt="logoUploadProfile" className='w-16 h-16' />
                                    <span className="text-[10px] text-white px-4 mb-2 bg-blue_5">
                                        + بارگزاری تصویر
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* {isImageGalleryOpen && selectedImage && (
                    <ImageGalleryComponent
                        items={selectedImage}
                        onClickOutSide={setIsImageGalleryOpen}
                        renderLeftNav={renderLeftNav}
                        renderRightNav={renderRightNav}
                    />
                )} */}
                    </>
                )}


                <form onSubmit={handleSubmit(handleFormSubmit)} className="gap-5 my-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 *:mb-5">
                        {currentMode !== 'updatePassword' && (
                            <>
                                {/* Allowed to be Farsi */}
                                <FormField
                                    trigger={trigger}
                                    name="name"
                                    control={control}
                                    label="نام"
                                    errors={errors}
                                    disabled={currentMode === 'view'}
                                    autoFocus={true}
                                />
                                <FormField
                                    trigger={trigger}
                                    name="userName"
                                    control={control}
                                    label="نام کاربری"
                                    errors={errors}
                                    rules={{ required: 'وارد کردن نام کاربری اجباری است' }}
                                    disabled={currentMode === 'view'}
                                    requrid={true}
                                />
                                {/* Other fields: add extra pattern validation to disallow Farsi */}
                                <FormField
                                    trigger={trigger}
                                    name="fullName"
                                    control={control}
                                    label="نام کامل"
                                    errors={errors}
                                    rules={{
                                        required: 'وارد کردن نام کامل اجباری است',
                                        pattern: noFarsiPattern,
                                    }}
                                    disabled={currentMode === 'view'}
                                    requrid={true}
                                />
                                <FormField
                                    trigger={trigger}
                                    name="description"
                                    control={control}
                                    label="توضیح"
                                    errors={errors}
                                    rules={{ pattern: noFarsiPattern }}
                                    disabled={currentMode === 'view'}
                                />
                            </>
                        )}
                        {(currentMode === 'add' || currentMode === 'updatePassword') && (
                            <>
                                <FormField
                                    trigger={trigger}
                                    name="password"
                                    control={control}
                                    label="رمز عبور"
                                    errors={errors}
                                    rules={{
                                        required: 'وارد کردن رمز عبور اجباری است',
                                        pattern: noFarsiPattern,
                                    }}
                                    disabled={currentMode === 'view'}
                                    type="password"
                                    requrid={true}
                                />
                                <FormField
                                    trigger={trigger}
                                    name="rePassword"
                                    control={control}
                                    label="تکرار رمز عبور"
                                    errors={errors}
                                    rules={{
                                        required: 'تکرار رمز عبور اجباری است',
                                        pattern: noFarsiPattern,
                                        validate: validatePasswordMatch,
                                    }}
                                    disabled={currentMode === 'view'}
                                    type="password"
                                    requrid={true}
                                />
                            </>
                        )}
                        {currentMode !== 'updatePassword' && (
                            <div className={`border max-w-[90%] md:max-w-full border-blue_3 ${errors.quiddityProduct && '!border-red_5'} focus-within:border-[#9a732e] flex items-center justify-center  rounded-[5px]`}>
                                <label className={`min-w-[125px] text-gray_45 h-[37px] border-1 !border-blue_3 flex justify-center items-center rounded-[5px] rounded-l-none ${errors.productCollection ? 'bg-errorInput' : 'bg-blue_2'}`}>
                                    نقش
                                </label>
                                <Controller
                                    name="roleId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            open={openSelectedRole}
                                            onOpenChange={setOpenSelectedRole}
                                            onValueChange={(value) => {
                                                field.onChange(value); // Update the form state with the selected role's ID
                                            }}
                                            value={field.value?.toString() || ""} // Ensure the value is a string
                                            disabled={currentMode === 'view'}
                                            dir='ltr'
                                        >
                                            <SelectTrigger
                                                className="border-t-0 border-b-0 border-l-0 border-r-1 border-[inherit] rounded-none rounded-l-[5px] rounded-br-[18px] shadow-none focus:ring-0 bg-white mr-[-12px]"
                                            >
                                                <SelectValue>
                                                    {roles?.find((role: any) => role.id === parseInt(field.value))?.name || initialData?.roleName}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <>
                                                    {roles?.map((role: any) => (
                                                        <SelectItem
                                                            className="px-1 text-black_5 text-[14px]"
                                                            key={role.id}
                                                            value={role.id.toString()} // Ensure the value is a string
                                                        >
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                    <div className='flex justify-start items-center'>
                                                        <Modal
                                                            isOpen={openModalAddRole}
                                                            onClose={handleToggleModalAddRole}
                                                            trigger={
                                                                <Button
                                                                    variant='ghost'
                                                                    className='w-full'
                                                                >
                                                                    <i className='icon-circle-plus1'></i>
                                                                    <span>افزودن نقش</span>
                                                                </Button>
                                                            }
                                                            contentClass="!max-w-lg"
                                                        >
                                                            <AddRole key='add role' onClose={handleToggleModalAddRole} addRolde={addRolde} />
                                                        </Modal>
                                                    </div>
                                                </>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}

                    </div>
                    <div className="justify-center lg:justify-end flex gap-2">
                        <Button type="button" variant="outline" onClick={handleCloseModal}>
                            انصراف
                        </Button>
                        {currentMode !== 'view' && (
                            <Button type="submit" className="bg-green_1 text-white">
                                {currentMode === 'add' ? 'افزودن کاربر' : 'ذخیره'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </Viewer>
    );
};

export default UserForm;
