import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { productModel } from "./types";
import { useState } from "react";
import Toast from "../../components/Toast/Toast";
import { Modal } from "../../common/Modal/Modal";
import AlertDialogModal from "../../components/AlertDialog/AlertDialog";
import Trash from "../../components/Trash/Trash";
import { convertImageUrl } from "../../lib/convertImageUrl";
import UserForm from "../../components/UserForm/UserForm";
import { Switch } from "../../components/ui/switch";

const ActionButtons = ({ rowInfo, onEditSuccess, onDeleteSuccess, onDeleteImage, onAddImage }: { rowInfo: productModel; onEditSuccess: (updatedProduct: productModel) => void; onDeleteSuccess: (deletedProductId: number) => void; onDeleteImage: (fileCode: string, productId: number) => void; }) => {
    const [isOpenModalViewProduct, setIsOpenModalViewProduct] = useState(false);
    const [isOpenModalEditProduct, setIsOpenModalEditProduct] = useState(false);
    const [isOpenModalUpdatePassUser, setIsOpenModalUpdatePassUser] = useState(false);
    const handleCloseModalViewProduct = () => {
        setIsOpenModalViewProduct((prev) => !prev);
    };
    const handleCloseModalEditProduct = () => {
        setIsOpenModalEditProduct((prev) => !prev);
    };
    const handleCloseModalUpdatePassUser = () => {
        setIsOpenModalUpdatePassUser((prev) => !prev);
    };
    const handleDelete = () => {
        const updatedUsers = JSON.parse(localStorage.getItem('users_data') || '[]');
        const filteredUsers = updatedUsers.filter(user => user.id !== rowInfo.id);
        localStorage.setItem('users_data', JSON.stringify(filteredUsers));
        onDeleteSuccess(rowInfo.id);
        Toast({ message: 'کاربر با موفقیت حذف شد', type: 'success' });
    };
    return (
        <div className="inline-flex h-[30px] justify-center items-start gap-[5px] flex-shrink-0 pt-[4px] pr-[0px] pb-[4px] pl-[5px]">
            <Modal
                isOpen={isOpenModalViewProduct}
                onClose={handleCloseModalViewProduct}
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-[22px] h-[22px] flex-shrink-0 rounded-[8px] py-[2px]"
                    >
                        <i className="icon-view text-black"></i>
                    </Button>
                }
            >
                <UserForm
                    mode="view"
                    initialData={rowInfo}
                    onClose={handleCloseModalViewProduct}
                    onEditSuccess={onEditSuccess}
                    onDeleteImage={onDeleteImage}
                />
            </Modal>

            <Modal
                isOpen={isOpenModalEditProduct}
                onClose={handleCloseModalEditProduct}
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-[23px] h-[22px] flex-shrink-0 rounded-[8px] py-[2px]"
                    >
                        <i className="icon-edite text-black"></i>
                    </Button>
                }
            >

                <UserForm
                    mode="edit"
                    initialData={rowInfo}
                    onClose={handleCloseModalEditProduct}
                    onEditSuccess={onEditSuccess}
                    onDeleteImage={onDeleteImage}
                />
            </Modal>

            <Modal
                isOpen={isOpenModalUpdatePassUser}
                onClose={handleCloseModalUpdatePassUser}
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-[23px] h-[22px] flex-shrink-0 rounded-[8px] py-[2px]"
                    >
                        <i className="icon-key text-black"></i>
                    </Button>
                }
            >

                <UserForm
                    mode="updatePassword"
                    initialData={rowInfo}
                    onClose={handleCloseModalUpdatePassUser}
                />
            </Modal>

            <AlertDialogModal
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-[23px] h-[22px] flex-shrink-0 rounded-[8px] py-[2px]"
                    >
                        <i className="icon-trash text-black"></i>
                    </Button>
                }
                cancelText="انصراف"
                confirmText="حذف"
                onConfirm={handleDelete}
            >
                <Trash
                    describtion={
                        <span className="text-[14px]"> آیا از حذف کاربرِِ <span> "{rowInfo?.userName}" </span>مطمئن هستید؟</span>
                    }
                />
            </AlertDialogModal>

        </div>
    );
};

export const getColumns = (
    onEditSuccess: (updatedProduct: productModel) => void,
    onDeleteSuccess: (deletedProductId: number) => void,
    onDeleteImage: (fileCode: string, productId: number) => void,
    onAddImage: (fileCode: string, productId: number) => void,
): ColumnDef<productModel>[] => [
        {
            id: "انتخاب",
            size: 10,
            header: ({ table }) => (
                <div className="flex justify-start pr-3">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="custom-checkbox"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex justify-start pr-3">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="custom-checkbox"
                    />
                </div>
            ),
        },
        {
            accessorKey: "roleName",
            id: "نقش",
            cell: (info) => info.getValue(),
            header: () => <div className="text-center"><span>نقش</span></div>,
        },
        {
            accessorKey: "userName",
            id: "نام کاربری",
            cell: (info) => info.getValue(),
            header: () => <div className="text-center"><span>نام کاربری</span></div>,
        },
        {
            accessorKey: "fullName",
            id: "نام کامل",
            cell: (info) => info.getValue(),
            header: () => <div className="text-center"><span>نام کامل</span></div>,
        },
        {
            accessorKey: "level",
            id: "سطح دسترسی",
            cell: (info) => info.getValue(),
            header: () => <div className="text-center"><span>سطح دسترسی</span></div>,
        },
        {
            id: 'عکس',
            accessorKey: 'fileCode',
            header: () => <div className="text-center"><span>تصاویر</span></div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        {row?.original?.fileCode && (
                            <div
                                key={row.original.fileCode}
                                className={`border w-[33px] h-[33px] rounded-[50%]  ml-[-22px] cursor-pointer hover:z-50`}
                            >
                                <img src={convertImageUrl(row?.original?.fileCode)} alt={row?.original?.fileCode} className="w-full h-full rounded-[100%] object-contain" loading="lazy" />
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "isActive",
            id: "وضعیت",
            header: () => <div className="text-center"><span>فعال</span></div>,
            cell: ({ row }) => {
                return (
                    <Switch
                        className="data-[state=checked]:bg-green_1"
                        checked={row.original.isActive}
                        onCheckedChange={(checked) => {
                            onEditSuccess({ ...row.original, isActive: checked });
                            Toast({ message: 'وضعیت کاربر با موفقیت تغییر کرد', type: 'success' });
                        }} />
                )
            },
        },
        {
            id: "عملیات",
            header: () => <div className="text-center"><span>عملیات</span></div>,
            cell: ({ row }) => <ActionButtons
                rowInfo={row.original}
                onEditSuccess={onEditSuccess}
                onDeleteSuccess={onDeleteSuccess}
                onDeleteImage={onDeleteImage}
                onAddImage={onAddImage}
            />,

        },
    ];