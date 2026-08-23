import { createClient } from '@supabase/supabase-js';

const bucket = 'default-bucket';

export const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);


export const uploadImage = async (image: File) => {

    const timeTamp = Date.now();
    const newName = `${timeTamp}-${image.name}`;  //crate a unique filename

    const { data, error } = await supabase
        .storage.from(bucket)
        .upload(newName, image, { cacheControl: '3600' });

    if (!data) throw new Error('Image upload failed');
    
    return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;

};


export const deleteImage = (url: string) => {
  const imageName =decodeURIComponent(url.split('/').pop() as string);   //decodeURIComponent to remove image from supabase storage

  if (!imageName) throw new Error('Invalid URL');
  return supabase.storage.from(bucket).remove([imageName]);
};
 