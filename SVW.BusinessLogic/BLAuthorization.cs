using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SVW.Entities;

namespace SVW.BusinessLogic
{
    public class BLAuthorization
    {
        private DataAccess.DAAuthorization repository;

        public BLAuthorization()
        {
            repository = new DataAccess.DAAuthorization();
        }
        public async Task<Common.Response<Usuario>> Authorize(Usuario credential)
        {
            try
            {
                var result = await repository.Authorize(credential);

                if (result == null)
                {
                    return new Common.Response<Usuario>("Usuario o password incorrectos.");
                }

                return new Common.Response<Usuario>(result);
            }
            catch (Exception ex)
            {
                return new Common.Response<Usuario>(ex);
            }
        }
    }
}
