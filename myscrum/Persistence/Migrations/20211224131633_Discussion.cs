using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace myscrum.Persistence.Migrations
{
    public partial class Discussion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DiscussionMessage",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AuthorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WorkItemId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsEdited = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscussionMessage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiscussionMessage_User_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiscussionMessage_WorkItem_WorkItemId",
                        column: x => x.WorkItemId,
                        principalTable: "WorkItem",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DiscussionMessageLike",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MessageId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscussionMessageLike", x => new { x.UserId, x.MessageId });
                    table.ForeignKey(
                        name: "FK_DiscussionMessageLike_DiscussionMessage_MessageId",
                        column: x => x.MessageId,
                        principalTable: "DiscussionMessage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiscussionMessageLike_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiscussionMessage_AuthorId",
                table: "DiscussionMessage",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscussionMessage_WorkItemId",
                table: "DiscussionMessage",
                column: "WorkItemId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscussionMessageLike_MessageId",
                table: "DiscussionMessageLike",
                column: "MessageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiscussionMessageLike");

            migrationBuilder.DropTable(
                name: "DiscussionMessage");
        }
    }
}
