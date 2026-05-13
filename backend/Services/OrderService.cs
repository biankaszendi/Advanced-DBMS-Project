using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using Microsoft.Data.SqlClient;

namespace backend.Services
{
    public class OrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> PlaceOrderAsync(OrderRequest request)
        {
            string customerName = $"Unknown(ID:{request.CustomerID})";
            string productName = $"Unknown(ID:{request.ProductID})";

            try
            {
                var customer = await _context.Customers.FindAsync(request.CustomerID);
                var product = await _context.Products.FindAsync(request.ProductID);
                
                if (customer != null) customerName = customer.FullName;
                if (product != null) productName = product.ProductName;

                var p1 = new SqlParameter("@CustomerID", request.CustomerID);
                var p2 = new SqlParameter("@ProductID", request.ProductID);
                var p3 = new SqlParameter("@Quantity", request.Quantity);
                var p4 = new SqlParameter("@TotalAmount", request.TotalAmount);

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_PlaceOrder @CustomerID, @ProductID, @Quantity, @TotalAmount", 
                    p1, p2, p3, p4);

                _context.AuditLogs.Add(new AuditLogModel 
                { 
                    EventDescription = $"SUCCESS: {customerName} ordered {request.Quantity}x {productName}.", 
                    EventDate = DateTime.Now
                });
                
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _context.AuditLogs.Add(new AuditLogModel 
                { 
                    EventDescription = $"FAILED: Order by {customerName}. Reason: {ex.Message}", 
                    EventDate = DateTime.Now
                });
                
                await _context.SaveChangesAsync();
                throw;
            }
        }

        public async Task<List<OrderModel>> GetAllOrders() 
            => await _context.Orders.Include(o => o.Customer).ToListAsync();

        public async Task<OrderModel> GetOrderByIdAsync(int id)
        {
            return await _context.Orders.FindAsync(id);
        }

        public async Task ShipOrderAsync(OrderModel order)
        {
            order.Status = "Shipped";

            _context.AuditLogs.Add(new AuditLogModel 
            { 
                EventDescription = $"ORDER SHIPPED: Order ID {order.OrderID} status changed to Shipped.",
                EventDate = DateTime.Now
            });

            await _context.SaveChangesAsync();
        }
    }
}