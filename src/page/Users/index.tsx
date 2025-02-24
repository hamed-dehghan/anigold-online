import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../../components/table/Table";
import { getColumns } from "./column";
import { productModel } from "./types";
import { Modal } from "../../common/Modal/Modal";
import { Button } from "../../components/ui/button";
import UserForm from "../../components/UserForm/UserForm";

const USERS_STORAGE_KEY = 'users_data';

const Users = () => {
    const [Users, setUsers] = useState<productModel[]>([]);
    const [IsLoading, setIsLoading] = useState(false);
    const [IsModalAddUsersOpen, setIsModalAddUsersOpen] = useState(false);

    // Load users from localStorage
    const loadUsers = () => {
        try {
            setIsLoading(true);
            const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            }
        } catch (error) {
            console.error("Error loading users from localStorage:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Save users to localStorage
    const saveUsers = (updatedUsers: productModel[]) => {
        try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        } catch (error) {
            console.error("Error saving users to localStorage:", error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const addUser = (newUser: productModel) => {
        const updatedUsers = [...Users, { ...newUser, id: Date.now() }];
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    const handleEditSuccess = (updatedUser: productModel) => {
        const updatedUsers = Users.map((user) => {
            return user.id === updatedUser.id ? updatedUser : user
        });
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    const handleDeleteSuccess = (deletedUserId: number) => {
        const updatedUsers = Users.filter((user) => user.id !== deletedUserId);
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    const handleDeletePicture = (fileCode: any, productId: any) => {
        const updatedUsers = Users.map((product) =>
            product.id === productId
                ? {
                    ...product,
                    productImages: product.productImages.filter((img: any) => img.fileCode !== fileCode),
                }
                : product
        );
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    const handleAddImage = (fileCode: any, productId: any) => {
        const updatedUsers = Users.map((product) =>
            product.id === productId
                ? {
                    ...product,
                    productImages: [...product.productImages, { fileCode: fileCode, isMain: false }],
                }
                : product
        );
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    const handleCreateUser = async (userData: any) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    ...userData,
                    id: Date.now(),
                    productImages: []
                };
                addUser(newUser);
                resolve({ success: true, data: newUser });
            }, 500);
        });
    };

    const columns = getColumns(handleEditSuccess, handleDeleteSuccess, handleDeletePicture, handleAddImage);
    const data = useMemo(() => Users, [Users]);

    const handleOpenModalUsers = () => {
        setIsModalAddUsersOpen(!IsModalAddUsersOpen);
    };

    return (
        <div className="flex gap-4 justify-center items-center h-full relative">
            <div className="w-full h-full bg-white rounded-[15px] border">
                <div className="bg-content h-full flex flex-col gap-2 rounded-[15px]">
                    <div className='flex justify-between lg:flex-row gap-5 items-start lg:items-center pr-5 pl-2 flex-wrap pt-6'>
                        <div className="grid grid-cols-2 gap-6 items-center justify-between w-full">
                            <div className="">
                                <p className="text-gray_45 text-[18px]">نام کاربری</p>
                            </div>
                            <div className="flex justify-end">
                                <Modal
                                    isOpen={IsModalAddUsersOpen}
                                    onClose={handleOpenModalUsers}
                                    trigger={
                                        <Button className='ml-[8px] self-center w-[107px] rounded-[5px] h-[41px] flex justify-center items-end flex-shrink-0 bg-blue_5 hover:bg-blue_5'>
                                            <div>
                                                <span className='text-white text-[14px] font-[400] leading-[21px] h-[30px] w-[69px]'>+ کاربر جدید</span>
                                            </div>
                                        </Button>
                                    }
                                >
                                    <UserForm
                                        mode="add"
                                        onSubmit={handleCreateUser}
                                        onClose={handleOpenModalUsers}
                                        onAddSuccess={addUser}
                                    />
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div className="font-Poppins mt-0">
                        <DataTable columns={columns} data={data} IsLoading={IsLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
