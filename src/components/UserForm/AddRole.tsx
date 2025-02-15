import React from 'react';
import { FormField } from '../FormField/FormField';
import { useForm } from 'react-hook-form';
import TooltipProvider from '../../assets/common/Tooltips';
import Icon from '../../lib/icon';
import { Button } from '../ui/button';
import { CreateRole, GetAllRole } from '../../lib/endPointes/role/createRolde';
import Toast from '../Toast/Toast';

const AddRole = ({ onClose, addRolde }: any) => {
    const {
        control,
        handleSubmit,
        trigger,
        reset,
        formState: { errors },
    } = useForm();

    const handleFormSubmitAddRole = async (data: any, event: React.FormEvent) => {
        event.stopPropagation(); // Stop event bubbling to parent form
        event.preventDefault(); // Prevent default form submission

        console.log('add role', data);
        const formData = {
            name: data.role,
            description: '',
        };

        try {
            const response = await CreateRole(formData);
            addRolde({id:1232 , name:data.role});
            onClose();
            reset();
            Toast({
                message: 'نقش اضافه شد',
                type: 'success',
            });
            if (response.data.isSuccessful) {
                response.data.message.forEach((item) => {
                    Toast({
                        message: item.messageText,
                        type: 'success',
                    });
                });
            } else {
                // Toast({
                //     message: 'افزودن نقش انجام نشد',
                //     type: 'error',
                // });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="text-gray_45 flex flex-col items-center justify-center md:flex-row md:justify-between h-[63px] pt-9 md:pt-3 pr-3 md:items-start mt-2">
                <div className="flex justify-between items-start gap-2">
                    <span className="truncate">افزودن نقش</span>
                    <TooltipProvider content={'کنید'} isShowTooltip={false}>
                        <Icon
                            icon="question"
                            className="w-6 h-6 border p-1 rounded-[50px] fill-white text-blue"
                        />
                    </TooltipProvider>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-[21px] h-[20px] md:hover:bg-MainColor rounded-[20px] px-[5px] py-[10px] order-2"
                        onClick={onClose}
                    >
                        <Icon icon="xmark" size={13} />
                    </Button>
                </div>
            </div>
            <div className="w-full border mt-4 md:mt-0"></div>
            <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent UserForm validation from running
                    handleSubmit((data) => handleFormSubmitAddRole(data, e))(e);
                }}
                className="gap-5 my-3"
            >
                <FormField
                    name="role"
                    control={control}
                    label="نقش"
                    errors={errors}
                    rules={{
                        required: 'وارد کردن نقش اجباری است',
                    }}
                    requrid={true}
                />
                <div className="justify-center lg:justify-end flex gap-2 mt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        انصراف
                    </Button>
                    <Button type="submit" className="bg-green_1 text-white">
                        افزودن نقش
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddRole;