import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import SectionTitle from '@/components/global/SectionTitle';
import { fetchUserOrders } from '@/utils/actions';
import { formatCurrency, formatDate, formatTime } from '@/utils/format';

async function OrdersPage() {
    const orders = await fetchUserOrders();

    return (
        <>
            <SectionTitle text='Your Orders' />
            <Table>
                <TableCaption>Total Orders : {orders.length}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Order Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const { products, orderTotal, createdAt, product } = order;
                        return (
                            <TableRow key={order.id}>
                                <TableCell>{products}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                                <TableCell>{formatDate(createdAt)}</TableCell>
                                <TableCell>{formatTime(createdAt)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
export default OrdersPage;
