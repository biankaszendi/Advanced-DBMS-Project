using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers{

    [ApiController]
    [Route("api/auditlogs")]
    public class AuditLogController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuditLogController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetLogs() 
        {
            return Ok(await _context.AuditLogs.OrderByDescending(x => x.EventDate).Take(50).ToListAsync());
        }
    }
}