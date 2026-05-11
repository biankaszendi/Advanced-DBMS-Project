using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CustomerService
    {
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerModel>> GetAllCustomers() 
            => await _context.Customers.ToListAsync();

        public async Task<CustomerModel?> GetCustomerById(int id) 
            => await _context.Customers.FindAsync(id);

        public async Task<CustomerModel> CreateCustomer(CustomerModel customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> UpdateCustomer(int id, CustomerModel updatedCustomer)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return false;

            customer.FullName = updatedCustomer.FullName;
            customer.City = updatedCustomer.City;
            customer.Email = updatedCustomer.Email;
            customer.Country = updatedCustomer.Country;
            customer.CleanedCity = updatedCustomer.CleanedCity;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}