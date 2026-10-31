"use server"
import { redirect, unstable_rethrow } from "next/navigation";
import db from "./db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cartAmountSchema, categorySchema, idSchema, imageSchema, productSchema, reviewSchema, validateFuctionSchema } from "./schema";
import { deleteImage, uploadImage } from "./supabase";
import { revalidatePath } from "next/cache";
import { links } from "./links";


//fetch all featured products
export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};


//fetch all  products
export async function fetchAllProducts({ search = '', categoryId }: { search?: string; categoryId?: string }) {
  const products = await db.product.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            name: { contains: search, mode: 'insensitive' },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return products;
}


//find product

export async function fetchSingleProduct(productID: string) {
  const product = await db.product.findUnique({
    where: {
      id: productID
    },
    include: {
      category: true
    }
  });
  if (!product) {
    redirect('/products')
  }

  return product
}

const getAuthUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/")
  }

  const user = await currentUser();
  if (!user) {
    return redirect("/")
  }
  return user;
}

const renderError = (error: unknown): { message: string } => { //check error mesage
  // let redirect() / notFound() thrown inside try/catch keep working
  unstable_rethrow(error);
  // never leak database internals (table/column names, query details) to the client
  if (error instanceof Error && !error.constructor.name.startsWith("Prisma")) {
    return { message: error.message };
  }
  console.error(error);
  return { message: "Something went wrong, please try again" };
}

//AdminUser
const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

// fuc connect with zod to make validate to info
export async function createProductAction(prevState: any, formData: FormData): Promise<{ message: string }> {
  const user = await getAdminUser();
  try {
    const rowData = Object.fromEntries(formData); // validate for all form input without image
    const fileImage = formData.get('image') as File;

    const validatedFields = validateFuctionSchema(productSchema, rowData)
    const validateImage = validateFuctionSchema(imageSchema, { image: fileImage })

    const categoryTitle = validatedFields.categoryId;
    const category = await db.category.findUnique({ where: { title: categoryTitle } });
    if (!category) throw new Error("Category not found");
    validatedFields.categoryId = category.id;

    const fullImagePath = await uploadImage(validateImage.image);


    await db.product.create({
      data: {
        ...validatedFields,
        image: fullImagePath,
        clerkId: user.id,
      }
    });
    return { message: 'Product Created' }

  } catch (error) {
    return renderError(error);

  }
};

//fetch admin posts
export const fetchAdminPosts = async () => {
  const user = await getAdminUser();
  const products = await db.product.findMany({
    where: {
      clerkId: user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return products;
}



export const deleteProductAction = async (prevState: { productId: string }) => {

  const { productId } = prevState

  await getAdminUser();

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    revalidatePath('/admin/products');

    return { message: 'product removed' };


  } catch (error) {
    return renderError(error);
  }

};

//edie product = update text data only 
export const updateProductAction = async (prevState: any, formData: FormData) => {

  await getAdminUser();
  try {
    const productId = formData.get('id') as string;

    const rawData = Object.fromEntries(formData);

    const validateData = validateFuctionSchema(productSchema, rawData);

    const categoryTitle = validateData.categoryId;
    const category = await db.category.findUnique({ where: { title: categoryTitle } });
    if (!category) throw new Error("Category not found");
    validateData.categoryId = category.id;

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        name: validateData.name,
        description: validateData.description,
        price: validateData.price,
        featured: validateData.featured,
        categoryId: validateData.categoryId,
      },
    });

    revalidatePath(`${links.AdminProducts.href}/${productId}/edit`);

    return { message: 'Product updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};



//image update action 
export const updateProductImageAction = async (prevState: any, formData: FormData) => {

  await getAdminUser();
  try {
    const image = formData.get('image') as File;
    const productId = validateFuctionSchema(idSchema, formData.get('id'));

    const validateImageFile = validateFuctionSchema(imageSchema, { image });

    // the old image comes from the database, never from the form,
    // so a crafted request can't delete arbitrary files from the bucket
    const product = await db.product.findUnique({ where: { id: productId }, select: { image: true } });
    if (!product) throw new Error("Product not found");

    const fullImagePath = await uploadImage(validateImageFile.image);

    await deleteImage(product.image);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullImagePath,
      }
    });

    revalidatePath(`${links.AdminProducts.href}/${productId}/edit`);

    return { message: 'Image updated successfully' };

  } catch (error) {
    return renderError(error);
  }
};


// fetch faveroit 

export const fetchFavoritID = async (productID: string) => {
  const { userId } = await auth();
  if (!userId) return null;
  const fav = await db.favorite.findFirst({

    where: {
      productId: productID,
      clerkId: userId,
    },
    select: {
      id: true,
    },
  });
  return fav?.id || null;
}


type toggleFavActionProps = {
  productID: string;
  FavoriteID: string | null;
}
//fetch add or Favorite using button
export const toggleFavAction = async (prevState: toggleFavActionProps) => {
  const user = await getAuthUser();

  const { productID, FavoriteID } = prevState;
  try {
    if (FavoriteID) {
      // scoped to the signed-in user: a user can only remove their own favorites
      await db.favorite.deleteMany({
        where: {
          id: FavoriteID,
          clerkId: user.id,
        }
      })
    }
    else {
      await db.favorite.create({
        data: {
          productId: validateFuctionSchema(idSchema, productID),
          clerkId: user.id,
        }
      })
    }
    revalidatePath("/", "layout");

    return { message: FavoriteID ? 'removed from favorite' : 'added to favorite' };

  } catch (error) {
    return renderError(error);
  }
}


// user -> product -> fav
export const fetchUserFav = async () => {
  const user = await getAuthUser();
  const fav = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });
  return fav;
}

//Reviews
export const creatReviewAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    // console.log(rawData,'input form info++++');
    const validatedFields = reviewSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const errors = validatedFields.error?.issues.map((error) => error.message)

      return { message: "Error" + errors?.join(",") };
    }

    // author identity comes from Clerk on the server, not from the form,
    // so nobody can post a review under someone else's name or avatar
    await db.review.create({
      data: {
        ...validatedFields.data,
        authorName: user.firstName || user.username || "Customer",
        authorImageUrl: user.imageUrl,
        clerkId: user.id,
      },
    });

    revalidatePath(`/products/${validatedFields.data.productId}`);
    return { message: 'review submitted successfully' };
  } catch (error) {
    return renderError(error);
  }
}



export const fetchProductReview = async (productId: string) => {
  // const user = await getAuthUser();

  const review = await db.review.findMany({
    where: {
      productId: productId
    },
    orderBy: {
      createdAt: 'desc'
    },
  })
  return review;
};

export const fetchAllReviews = async () => {
  return db.review.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};



// ================= Cart Actions =================

export const fetchCartItems = async () => {
  const { userId } = await auth();
  if (!userId) return 0;
  const cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart || 0;
};

const includeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
};

// internal helpers: NOT exported, because every export of a "use server" file
// becomes a public endpoint and these take a userId / cart from the caller
const fetchOrCreateCart = async ({ userId, errorOnFailure = false, }: { userId: string; errorOnFailure?: boolean; }) => {
  let cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: includeProductClause,
  });
  if (!cart && errorOnFailure) {
    throw new Error("Cart not found");
  }
  if (!cart) {
    cart = await db.cart.create({
      data: {
        clerkId: userId,
      },
      include: includeProductClause,
    });
  }
  return cart;
};

const updateOrCreateCartItem = async ({ productId, cartId, amount, }: { productId: string; cartId: string; amount: number; }) => {
  let cartItem = await db.cartItem.findFirst({
    where: {
      productId,
      cartId,
    },
  });
  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    cartItem = await db.cartItem.create({
      data: { amount, productId, cartId },
    });
  }
};

const updateCart = async (cart: { id: string }) => {

  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }
  const orderTotal = cartTotal;

  const currentCart = await db.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      orderTotal,
      cartTotal,

    },
    include: includeProductClause,
  });
  return { cartItems, currentCart };
};

// cart of the signed-in user, with totals recalculated from current prices
export const fetchUserCart = async () => {
  const user = await getAuthUser();
  const cart = await fetchOrCreateCart({ userId: user.id });
  return updateCart(cart);
};

export const addToCartAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const productId = validateFuctionSchema(idSchema, formData.get("productId"));
    const amount = validateFuctionSchema(cartAmountSchema, formData.get("amount"));
    await fetchSingleProduct(productId);
    const cart = await fetchOrCreateCart({ userId: user.id });
    await updateOrCreateCartItem({ productId, cartId: cart.id, amount });
    await updateCart(cart);
  } catch (error) {
    return renderError(error);
  }
  redirect("/cart");
};



export const removeCartItemAction = async (prevState: any, formData: FormData,) => {
  const user = await getAuthUser();
  try {
    const cartItemId = formData.get("id") as string;
    const cart = await fetchOrCreateCart({ userId: user.id, errorOnFailure: true, });

    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });
    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "Item removed from cart" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const user = await getAuthUser();
  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });

    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount: validateFuctionSchema(cartAmountSchema, amount),
      },
    });
    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "cart updated" };
  } catch (error) {
    return renderError(error);
  }
};


// ================= Orders Actions =================
export const createOrderAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();

  try {
    const productIdFromForm = formData.get("productId") as string | null;

    if (productIdFromForm) {
      const product = await db.product.findUnique({
        where: { id: productIdFromForm },
      });
      if (!product) {
        throw new Error("Product not found");
      }

      await db.order.create({
        data: {
          clerkId: user.id,
          productId: product.id,
          products: 1,
          orderTotal: product.price,
        },
      });
    } else {
      const cart = await fetchOrCreateCart({
        userId: user.id,
        errorOnFailure: true,
      });

      if (!cart.cartItems.length) {
        throw new Error("Cart is empty");
      }

      // atomic: orders are created and the cart is cleared together, or not at all
      await db.$transaction([
        db.order.createMany({
          data: cart.cartItems.map((item) => ({
            clerkId: user.id,
            productId: item.productId,
            products: item.amount,
            orderTotal: item.amount * item.product.price,
          })),
        }),
        db.cart.delete({
          where: { id: cart.id },
        }),
      ]);
    }
  } catch (error) {
    return renderError(error);
  }

  redirect("/orders");
};



export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const orders = await db.order.findMany({
    where: { clerkId: user.id },
    include: {
      product: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

export const fetchAdminOrders = async () => {
  await getAdminUser();

  const orders = await db.order.findMany({
    include: {
      product: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};


// ================= Categories Actions =================

// Fetch all categories 
export const fetchAllCategories = async () => {
  const categories = await db.category.findMany({
        include: { products: true },
    orderBy: {
      title: "asc",
    },
  });
  return categories;
};

// Fetch admin categories
export const fetchAdminCategories = async () => {
  await getAdminUser();
  const categories = await db.category.findMany({

    orderBy: {
      createdAt: "desc",
    },
  });
  return categories;
};

export async function createCategoryAction(prevState: any, formData: FormData): Promise<{ message: string }> {
  const user = await getAdminUser();
  try {
    const rowData = Object.fromEntries(formData); // validate for all form input without image
    const fileImage = formData.get('image') as File;

    const validatedFields = validateFuctionSchema(categorySchema, rowData)
    const validateImage = validateFuctionSchema(imageSchema, { image: fileImage })

    const fullImagePath = await uploadImage(validateImage.image);


    await db.category.create({
      data: {
        ...validatedFields,
        image: fullImagePath,
        clerkId: user.id,
      }
    });
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { message: 'Category Created successfully' };
  } catch (error) {
    return renderError(error);

  }
};
// Fetch Single category
export async function fetchSingleCategory(categoryId: string) {
  const category = await db.category.findUnique({
    where: { id: categoryId },
  });
    if (!category) {
    redirect('/categories')
  }
  return category;
}


// Delete category action with image removal from Supabase
export const deleteCategoryAction = async (prevState: { categoryId: string }) => {
  const { categoryId } = prevState;
  await getAdminUser();

  try {
    const category = await db.category.delete({
      where: {
        id: categoryId,
      },
    });
    if (category.image) {
      await deleteImage(category.image);
    }
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { message: 'Category removed successfully' };
  } catch (error) {
    return renderError(error);
  }
};

// Update category action
export const updateCategoryAction = async (prevState: any, formData: FormData) => {
  await getAdminUser();
  try {
    const categoryId = formData.get('id') as string;
    const rawData = Object.fromEntries(formData);
    const validateData = validateFuctionSchema(categorySchema, rawData);

    await db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        title: validateData.title,
        description: validateData.description || null,
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { message: 'Category updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};


//image update action 
export const updateCategoryImageAction = async (prevState: any, formData: FormData) => {

  await getAdminUser();
  try {
    const image = formData.get('image') as File;
    const categoryId = validateFuctionSchema(idSchema, formData.get('id'));

    const validateImageFile = validateFuctionSchema(imageSchema, { image });

    const category = await db.category.findUnique({ where: { id: categoryId }, select: { image: true } });
    if (!category) throw new Error("Category not found");

    const fullImagePath = await uploadImage(validateImageFile.image);

    if (category.image) await deleteImage(category.image);
    await db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        image: fullImagePath,
      }
    });

    revalidatePath(`${links.AdminCategories.href}/${categoryId}/edit`);

    return { message: 'Image updated successfully' };

  } catch (error) {
    return renderError(error);
  }
};


