using AutoMapper;
using myscrum.Common.Mappings;
using myscrum.Domain.WorkItems.Discussion;
using myscrum.Features.Common;
using System;
using System.Linq;

namespace myscrum.Features.WorkItems.Discussion.Dto
{
    public class DiscussionMessageDto : IMapFrom<DiscussionMessage>
    {
        public string Id { get; set; }

        public string Text { get; set; }

        public UserDto Author { get; set; }

        public int LikeCount { get; set; }

        public bool IsLikedByMe { get; set; }

        public bool IsEdited { get; set; }

        public DateTime CreatedAt { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<DiscussionMessage, DiscussionMessageDto>()
                .ForMember(x => x.IsLikedByMe, act => act.Ignore())
                .ForMember(x => x.LikeCount, act => act.MapFrom(x => x.Likes.Count()));
        }
    }
}
