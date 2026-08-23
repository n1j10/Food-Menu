"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { LuShare2 } from "react-icons/lu";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
} from "react-share";

function ShareButton({ id, name }: { id: string; name: string }) {
    const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
    const shareLink = `${url}/products/${id}`;

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button variant='outline' size='icon' className='p-2'>
                        <LuShare2 />
                    </Button>
                }
            />
            <PopoverContent
                side='right'
                align='end'
                sideOffset={10}
                className='flex items-center gap-x-2  w-full'
            >
                <FacebookShareButton url={shareLink} title={name} >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <LinkedinShareButton url={shareLink} title={name} >
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <EmailShareButton url={shareLink} title={name}>
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </PopoverContent>
        </Popover>
    )
}

export default ShareButton
