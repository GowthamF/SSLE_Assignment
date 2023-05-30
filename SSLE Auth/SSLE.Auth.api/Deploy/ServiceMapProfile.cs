using AutoMapper;
using SSLE.Auth.Api.Models;

namespace SSLE.Auth.Api
{
    using SO = SSLE.Auth.Services.Models;

    public class ServiceMapProfile : Profile
    {
        public ServiceMapProfile()
        {
            CreateMap<UserModel, SO.UserModel>(MemberList.None)
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName))
                .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName))
                .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email))              
                .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
                .ForMember(d => d.ProfileImage, opt => opt.MapFrom(s => s.ProfileImage))
                .ForMember(d => d.Roles, opt => opt.MapFrom(s => s.Roles))
                .ReverseMap();

            CreateMap<SO.UserModel, UserInfoModel>(MemberList.None)
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
                .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName))
                .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName))
                .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email))       
                .ForMember(d => d.ProfileImage, opt => opt.MapFrom(s => s.ProfileImage))
                .ReverseMap();
        }


    }
}
