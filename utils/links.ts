type NavBarLinks = {
  href: string;
  name: string;
};

export const dropDownMenuLinks: NavBarLinks[] = [
  { href: '/', name: 'home' },
  { href: '/products', name: 'products' },
  { href: '/cart', name: 'cart' },
  { href: '/orders', name: 'orders' },
  { href: '/admin/products/create', name: 'dashboard' },
  { href: '/favorites', name: 'favorites' },
  { href: '/reviews', name: 'reviews' },
 { href: '/about', name: 'about' },

];

export let links = {
  HOME: { href: '/', name: 'Home' },
  ABOUT: { href: '/about', name: 'About' },
  CART: { href: '/cart', name: 'Cart' },
  PRODUCTS: { href: '/products', name: 'Products' },
  AdminProducts: { href: '/admin/products', name: 'Products' },
  AdminCategories: { href: '/admin/category', name: 'Categories' },


} as const


export const adminLinks: NavBarLinks[] = [
  { href: '/admin/category/create', name: 'create category' },
  { href: '/admin/products/create', name: 'create product' },
    { href: '/admin/products', name: 'my products' },
    { href: '/admin/category', name: 'my categories' },


];
