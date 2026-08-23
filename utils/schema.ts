import * as zod from "zod";

//Input form Schema
export const productSchema = zod.object({

    name: zod.string().min(4,
        {
            message: "Name must be at least 4 characters long"
        }

    ).max(30,
        {
            message: "Name must be at most 10 characters long"
        }
    ),


    description: zod.string().refine((description) => {
        const wordCount = description.split(" ").length;
        return wordCount >= 10 && wordCount <= 500;
    },
        {
            message: "Description must be at between 10 and 500 words"
        }
    ),

    price: zod.coerce.number().int().min(0,
        {
            message: "Price must be a positive number ."
        }
    ),

    featured: zod.coerce.boolean().default(false),

    categoryId: zod.string().min(1, {
        message: "Please select a category"
    }),
})

//## validation of form data input

//T = Generic        Generic means input dynamic user can type string or number or any others types
export function validateFuctionSchema<T>(schema: zod.ZodSchema<T>, data: unknown): T {
    // export function validateFuctionSchema(schema:any, data: unknown) { method 222
    const result = schema.safeParse(data)
    if (!result.success) {
        const error = result.error.issues.map((e: any) => e.message);
        throw new Error(error.join(', '));
    }
    return result.data;
}

// +++++++ old code  change it to fuction  validateFuctionSchema    +++++  I used this code direct in action.ts
// const validateData =  productSchema.safeParse(rowData);
// if(!validateData.success){
//   const error = validateData.error.issues.map((e)=>e.message);
//   throw new Error(error.join(', '));
// }   


function validateImageFile() {
    const imageSize = 1024 * 1024;
    const acceptedFileType = ['image/']

    return zod.instanceof(File).refine((file) => {
        return !file || file.size <= imageSize
    }, 'File size must be less than 1 MB')

        .refine((file) => { //refine means custom validation
            return !file || acceptedFileType.some((type) => file.type.startsWith(type));
        }, 'File  must be an image')
}
//imageSchema
export const imageSchema = zod.object({
    image: validateImageFile()
})


//Review
export const reviewSchema = zod.object({
    rating: zod.coerce.number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),

    comment: zod.string()
        .min(10, 'Comment must be at least 10 characters long')
        .max(100, 'Comment must be at most 100 characters long'),

    productId: zod.string().refine((value) => value !== '', {
        message: "Product Id cannot be empty"
    }),
    authorName: zod.string().refine((value) => value !== '', {
        message: "Author name cannot be empty"
    }),
    authorImageUrl: zod.string().refine((value) => value !== '', {
        message: "Author image URL cannot be empty"
    }),
})



//Category Schema
export const categorySchema = zod.object({
    title: zod.string().min(2, {
        message: "Title must be at least 2 characters long"
    }).max(50, {
        message: "Title must be at most 50 characters long"
    }),
    description: zod.string().trim().max(300, {
        message: "Description must be at most 300 characters long"
    }).optional(),
})