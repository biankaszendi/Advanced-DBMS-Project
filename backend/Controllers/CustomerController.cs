using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/customers")]
    public class CustomerController : ControllerBase
    {
        private AppDbContext _context;
        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            return Ok(await _context.Customers.ToListAsync());
        }
    }
}