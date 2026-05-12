using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    public DashboardController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _context.Set<DashboardStats>()
            .FromSqlRaw("SELECT * FROM v_SalesDashboard")
            .FirstOrDefaultAsync();

        return Ok(stats);
    }
}