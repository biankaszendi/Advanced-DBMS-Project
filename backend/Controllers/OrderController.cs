using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequest request)
        {
            var success = await _orderService.PlaceOrderAsync(request);
            
            if (success)
                return Ok(new { message = "Order placed successfully!" });
            
            return BadRequest(new { message = "Error occurred while placing the order (possibly insufficient inventory)." });
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            return Ok(await _orderService.GetAllOrders());
        }
    }
}