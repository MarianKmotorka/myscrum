using System;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Constants;
using myscrum.Domain.Projects;
using myscrum.Persistence;

namespace myscrum.Features.Projects
{
    public class CreateProject
    {
        public class Command : IRequest<ResponseDto>
        {
            public string Name { get; set; }

            [JsonIgnore]
            public string OwnerId { get; set; }
        }

        public class Handler : IRequestHandler<Command, ResponseDto>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<ResponseDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var owner = await _db.Users.SingleAsync(x => x.Id == request.OwnerId, cancellationToken);
                var newProject = new Project(request.Name, owner);

                _db.Add(newProject);
                await _db.SaveChangesAsync(cancellationToken);

                return new ResponseDto
                {
                    Id = newProject.Id,
                    Name = newProject.Name,
                    CreatedAtUtc = newProject.CreatedAtUtc,
                };
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.Name).NotEmpty().WithErrorCode(ErrorCodes.Required).WithMessage("Required");
            }
        }

        public class ResponseDto
        {
            public string Id { get; set; }

            public string Name { get; set; }

            public DateTime CreatedAtUtc { get; set; }
        }
    }
}
