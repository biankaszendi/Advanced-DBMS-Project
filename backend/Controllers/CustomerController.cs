using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/customers")]
    public class CustomerController : ControllerBase
    {
        private AppDbContext _context;
        private readonly CustomerService _service;
        public CustomerController(AppDbContext context, CustomerService service)
        {
            _context = context;
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            return Ok(await _service.GetAllCustomers());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var customer = await _service.GetCustomerById(id);
            return customer != null ? Ok(customer) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer(CustomerModel model)
        {
            var created = await _service.CreateCustomer(model);
            return CreatedAtAction(nameof(GetCustomerById), new { id = created.CustomerId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, CustomerModel customer)
        {
            var success = await _service.UpdateCustomer(id, customer);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteCustomer(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}