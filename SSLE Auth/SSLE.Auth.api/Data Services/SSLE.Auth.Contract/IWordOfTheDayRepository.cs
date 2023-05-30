namespace EM.InsurePlus.Repository.Contract
{
    using EM.InsurePlus.Services.Models.Enums;
    using SO = EM.InsurePlus.Services.Models;

    public interface IWordOfTheDayRepository
    {
        public Task AddItem(SO.WordOfTheDayModel dataModel);

        public Task<List<SO.WordOfTheDayModel>> GetAllItems();

        public Task<List<SO.WordOfTheDayModel>> GetItemsBySearchKey(string searchKey);

        public Task<SO.WordOfTheDayModel> GetItemByWordId(string wordId, string partitionKey);

        public Task<SO.WordOfTheDayModel> GetFirstItemByMode(WordRequestModes mode);

        public Task<SO.WordOfTheDayModel> GetUniqueItem(string particianKeys, WordRequestModes mode);

        public Task UpdateItem(SO.WordOfTheDayModel dataModel);

        public Task DeleteItem(string wordId, string partitionKeyVal);
    }
}