using Medicare_backend.Models;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task AddAsync(User user);
        Task SaveChangesAsync();
    }
}
