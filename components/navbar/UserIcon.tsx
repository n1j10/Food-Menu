"use client"
import { useUser } from '@clerk/nextjs';
import { LuUser } from 'react-icons/lu';

function UserIcon() {
  const { user } = useUser();
  const profile_image = user?.imageUrl;

  if (profile_image) {
    return (
      <img src={profile_image} className='w-6 h-6 rounded-full object-cover' alt="User profile" />
    );
  }

  return <LuUser className='w-6 h-6 bg-blue-500 rounded-full text-white' />;
}
export default UserIcon;