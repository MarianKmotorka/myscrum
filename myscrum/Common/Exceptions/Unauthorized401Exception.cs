using System;

namespace myscrum.Common.Exceptions
{
    public class Unauthorized401Exception : Exception
    {
        public Unauthorized401Exception(string message = "") : base(message)
        {
        }
    }
}
