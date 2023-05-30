
namespace SSLE.Auth.Data.Contract
{
    using Microsoft.EntityFrameworkCore;
    public interface IModelRegistrar
    {
        /// <summary>
        /// Registers entities inside the SQL storage context.
        /// </summary>
        /// <param name="modelbuilder">The Entity Framework model builder.</param>
        void RegisterModels(ModelBuilder modelbuilder);
    }
}
