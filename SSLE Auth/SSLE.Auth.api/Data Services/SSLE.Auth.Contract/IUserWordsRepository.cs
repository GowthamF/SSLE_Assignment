namespace EM.InsurePlus.Repository.Contract
{
    using SO = EM.InsurePlus.Services.Models;

    public interface IUserWordsRepository
    {
        Task AddUserWord(SO.UserWordModel dataModel);

        Task UpdateUserWord(SO.UserWordModel dataModel);

        Task<SO.UserWordModel> GetUserWordByUserId(int userId);

        Task<SO.UserWordModel> GetUserWordInfo(SO.GetUserWordRequestModel dataModel);
    }
}