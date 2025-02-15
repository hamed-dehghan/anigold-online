import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../../components/table/Table";
import { getColumns } from "./column";
import { productModel } from "./types";
import { Modal } from "../../common/Modal/Modal";
import { Button } from "../../components/ui/button";
import { GetAllUsers } from "../../lib/endPointes/users/getAllUsers";
import { CreateUser } from '../../lib/endPointes/users/createUser'
import UserForm from "../../components/UserForm/UserForm";
import { _getVisibleLeafColumns } from "@tanstack/react-table";

const Users = () => {
    const [Users, setUsers] = useState<productModel[]>([]);
    const [IsLoading, setIsLoading] = useState(false);
    const [IsModalAddUsersOpen, setIsModalAddUsersOpen] = useState(false) //track for modal create Users
    //fetch users 
    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const response = await GetAllUsers();
            setIsLoading(false);
            const apiData = response.data.data;
            if (Array.isArray(apiData?.data)) {
                setUsers(apiData.data);

            } else {
                setUsers([]);
                console.error("Unexpected API response format:", apiData);
            }
        } catch (error) {
            console.error("Error fetching Users:", error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUser()
    }, [])

    //funCtion for add users
    const addUser = (newUser) => {
        // setUsers((previous)=> [...previous , newUser])
        fetchUser()
    }
    //handle for edite users
    const handleEditSuccess = (updatedProduct: productModel) => {
        setUsers((prevUsers) =>
            prevUsers.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    // Handle delete success
    const handleDeleteSuccess = (deletedUserId: number) => {
        setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== deletedUserId)
        );
    };

    const handleDeletePicture = (fileCode: any, productId: any) => {
        setUsers((preUsers) =>
            preUsers.map((product) =>
                product.id === productId
                    ? {
                        ...product,
                        productImages: product.productImages.filter((img: any) => img.fileCode !== fileCode),
                    }
                    : product
            )
        );
    };

    const handleAddImage = (fileCode: any, productId: any) => {
        setUsers((preUsers) =>
            preUsers.map((product) =>
                product.id === productId
                    ? {
                        ...product,
                        productImages: [...product.productImages, { fileCode: fileCode, isMain: false }],
                    }
                    : product
            )
        );
    };

    const columns = useMemo(() => getColumns(handleEditSuccess, handleDeleteSuccess, handleDeletePicture, handleAddImage,), []);
    const data = useMemo(() => Users, [Users]);

    //handle for modal add Users
    const handleOpenModalUsers = () => {
        setIsModalAddUsersOpen(!IsModalAddUsersOpen)
    }

    return (
        <div className="flex gap-4 justify-center items-center h-full    relative">

            {/* Right side: Table and profile info */}
            <div className="w-full h-full bg-white rounded-[15px] border">
                <div className="bg-content h-full flex flex-col gap-2 rounded-[15px] ">
                    <div
                        className='flex justify-between lg:flex-row gap-5 items-start lg:items-center pr-5 pl-2 flex-wrap pt-6'
                    >
                        <div className="grid grid-cols-2 gap-6 items-center justify-between w-full  ">
                            <div className="">
                                <p className="text-gray_45 text-[18px]">نام کاربری</p>
                            </div>
                            <div className="flex justify-end">
                                <Modal
                                    isOpen={IsModalAddUsersOpen}
                                    onClose={handleOpenModalUsers}
                                    trigger={
                                        <Button className=' ml-[8px] self-center w-[107px]  rounded-[5px] h-[41px] flex justify-center items-end flex-shrink-0 bg-blue_5 hover:bg-blue_5 '>
                                            <div >
                                                <span className='text-white text-[14px] font-[400] leading-[21px] h-[30px] w-[69px]'>+ کاربر جدید</span>
                                            </div>
                                        </Button>
                                    }
                                >
                                    <UserForm
                                        mode="add"
                                        onSubmit={CreateUser}
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


