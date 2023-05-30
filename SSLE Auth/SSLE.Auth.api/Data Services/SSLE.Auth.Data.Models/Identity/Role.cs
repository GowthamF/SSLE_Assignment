using SSLE.Auth.Data.Contract;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SSLE.Auth.Data.Models.Identity
{
    public class Role : IdentityRole<int>, IEntity
    {

        public bool IsActivated { get; set; }

        public Role(string name) : base(name)
        {
            this.Name = name;
        }

    }
}
