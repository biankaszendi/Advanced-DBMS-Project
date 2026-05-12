using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ProductModel> Products { get; set; }
        public DbSet<CustomerModel> Customers { get; set; }
        public DbSet<OrderModel> Orders { get; set; }
        public DbSet<OrderDetailModel> OrderDetails { get; set; }
        public DbSet<AuditLogModel> AuditLogs { get; set; }
        public DbSet<DashboardStats> DashboardStats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); 

            modelBuilder.Entity<DashboardStats>(entity =>
            {
                entity.HasNoKey();
                entity.ToView("v_SalesDashboard"); 
            });
        }
    }
}