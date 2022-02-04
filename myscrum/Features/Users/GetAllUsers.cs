using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Mappings;
using myscrum.Domain.Users;
using myscrum.Persistence;

namespace myscrum.Features.Users
{
    public class GetAllUsers
    {
        public class Query : IRequest<IEnumerable<ResponseDto>>
        {
        }

        public class Handler : IRequestHandler<Query, IEnumerable<ResponseDto>>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<IEnumerable<ResponseDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Users.ProjectTo<ResponseDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
            }
        }

        public class ResponseDto : IMapFrom<User>
        {
            public string Id { get; set; }

            public string GivenName { get; set; }

            public string Surname { get; set; }

            public string FullName => $"{GivenName} {Surname}";

            public DateTime LastLogin { get; set; }
        }
    }
}