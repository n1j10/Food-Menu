"use client"

import { actionFunction } from "@/utils/type";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useState } from "react";
import FormContainer from "../../form/FormContainer";
import ImageInput from "../../form/ImageInput";
import SubmitButton from "../../form/Buttons";

type ImageInputEditContainerProps = {
    name: string;
    image: string;
    action: actionFunction,
    text: string,
    children?: React.ReactNode
}


function ImageInputEditContainer(props: ImageInputEditContainerProps) {

    const { name, image, action, text, children } = props;
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
    return (
        <div className="mb-8">

            <Image
                src={image}
                alt={name}
                width={200}
                height={200}
                className="rounded-md object-cover mb-4  w-[200px] h-[200px]"
            />
            <Button variant={'outline'} size={'sm'} className={' hover:cursor-pointer'}
                onClick={() => setIsUpdateFormVisible(!isUpdateFormVisible)}>
                {text}
            </Button>

            {
                isUpdateFormVisible && (
                    <div className="max-w-md mt-4">
                        <FormContainer action={action}>
                            {children}
                            {/* <input
                                type="hidden"
                                name="id"
                            // defaultValue={id}
                            /> */}
                            <ImageInput
                                name='image'
                            />
                            <SubmitButton />
                        </FormContainer>

                    </div>
                )
            }

        </div>
    )
}

export default ImageInputEditContainer