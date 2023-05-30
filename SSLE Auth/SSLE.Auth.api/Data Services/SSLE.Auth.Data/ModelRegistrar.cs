
namespace SSLE.Auth.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using SSLE.Auth.Data.Contract;
    using SSLE.Auth.Data.Models;
    using SSLE.Auth.Data.Models.Identity;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    public class ModelRegistrar : IModelRegistrar
    {
        public void RegisterModels(ModelBuilder modelbuilder)
        {
            //Identity Tables
            modelbuilder.Entity<Role>(entity =>
            {
                entity.ToTable(name: "Role", schema: "Security");
                entity.HasKey(c => c.Id).HasName("PK_Role");
                entity.Property(e => e.Name).HasColumnName("Name").HasMaxLength(255);
                entity.Property(e => e.NormalizedName).HasColumnName("NormalizedName").HasMaxLength(255);               
                entity.Property(e => e.ConcurrencyStamp).HasColumnName("ConcurrencyStamp").HasMaxLength(36).IsConcurrencyToken();
            });

            modelbuilder.Entity<User>(entity =>
            {
                entity.ToTable(name: "User", schema: "Security");
                entity.HasKey(e => e.Id).HasName("PK_User");
                entity.Property(e => e.Email).HasColumnName("Email").HasMaxLength(255);
                entity.Property(e => e.NormalizedEmail).HasColumnName("NormalizedEmail").HasMaxLength(255);
                entity.Property(e => e.UserName).HasColumnName("UserName").IsRequired().HasMaxLength(255);
                entity.Property(e => e.NormalizedUserName).HasColumnName("NormalizedUserName").HasMaxLength(255);              
                entity.Property(e => e.PhoneNumber).HasColumnName("PhoneNumber").HasMaxLength(15);
                entity.Property(e => e.ConcurrencyStamp).HasColumnName("ConcurrencyStamp").HasMaxLength(36).IsConcurrencyToken();
                entity.Property(e => e.PasswordHash).HasColumnName("PasswordHash").HasMaxLength(255);
                entity.Property(e => e.SecurityStamp).HasColumnName("SecurityStamp").HasMaxLength(36);
                entity.Property(e => e.ProfileImage).HasColumnName("ProfileImage").HasMaxLength(255);
                entity.Property(e => e.CreatedDate).HasColumnName("CreatedDate");
            });

            modelbuilder.Entity<IdentityUserClaim<int>>(entity =>
            {
                entity.ToTable("UserClaim", "Security");
                entity.HasKey(e => e.Id).HasName("PK_UserClaim");
                entity.Property(e => e.ClaimType).HasColumnName("ClaimType").HasMaxLength(500);
                entity.Property(e => e.ClaimValue).HasColumnName("ClaimValue").HasMaxLength(500);               
            });

            modelbuilder.Entity<IdentityUserLogin<int>>(entity =>
            {
                entity.ToTable("UserLogin", "Security");
                entity.HasKey(c => new { c.LoginProvider, c.ProviderKey });
                entity.Property(e => e.ProviderKey).HasColumnName("ProviderKey").HasMaxLength(450);
                entity.Property(e => e.LoginProvider).HasColumnName("LoginProvider").HasMaxLength(450);
                entity.Property(e => e.ProviderDisplayName).HasColumnName("ProviderDisplayName").HasMaxLength(500);               
            });

            modelbuilder.Entity<IdentityRoleClaim<int>>(entity =>
            {
                entity.ToTable("RoleClaim", "Security");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ClaimType).HasColumnName("ClaimType").HasMaxLength(500);
                entity.Property(e => e.ClaimValue).HasColumnName("ClaimValue").HasMaxLength(500);               
            });

            modelbuilder.Entity<IdentityUserRole<int>>(entity =>
            {
                entity.ToTable("UserRole", "Security");
                entity.HasKey(c => new { c.UserId, c.RoleId });               
            });

            modelbuilder.Entity<IdentityUserToken<int>>(entity =>
            {
                entity.ToTable("UserToken", "Security");
                entity.HasKey(c => new { c.UserId, c.LoginProvider, c.Name });
                entity.Property(e => e.LoginProvider).HasColumnName("LoginProvider").HasMaxLength(450);
                entity.Property(e => e.Name).HasColumnName("Name").HasMaxLength(450);
                entity.Property(e => e.Value).HasColumnName("Value").HasMaxLength(1000);
                entity.Property(e => e.UserId).HasColumnName("UserId");
            });


        }
    }
}
