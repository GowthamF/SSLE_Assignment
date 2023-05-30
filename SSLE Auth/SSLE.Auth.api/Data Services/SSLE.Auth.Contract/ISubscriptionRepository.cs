namespace EM.InsurePlus.Repository.Contract
{
    using EM.InsurePlus.Services.Models;

    public interface ISubscriptionRepository
    {
        SubscriptionModel? GetSubscriptionByUserId(int userId);

        Task<SubscriptionModel?> CreateSubscription(int userid);

        Task<bool> UpdateSubscription(SubscriptionModel model);
    }
}