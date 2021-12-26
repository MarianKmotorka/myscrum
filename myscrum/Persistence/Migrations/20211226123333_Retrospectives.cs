using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace myscrum.Persistence.Migrations
{
    public partial class Retrospectives : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RetrospectiveComment",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AuthorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    SprintId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsPositive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetrospectiveComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RetrospectiveComment_Sprint_SprintId",
                        column: x => x.SprintId,
                        principalTable: "Sprint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RetrospectiveComment_User_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RetrospectiveCommentVote",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RetrospectiveCommentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsUpvote = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetrospectiveCommentVote", x => new { x.UserId, x.RetrospectiveCommentId });
                    table.ForeignKey(
                        name: "FK_RetrospectiveCommentVote_RetrospectiveComment_RetrospectiveCommentId",
                        column: x => x.RetrospectiveCommentId,
                        principalTable: "RetrospectiveComment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RetrospectiveCommentVote_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RetrospectiveComment_AuthorId",
                table: "RetrospectiveComment",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_RetrospectiveComment_SprintId",
                table: "RetrospectiveComment",
                column: "SprintId");

            migrationBuilder.CreateIndex(
                name: "IX_RetrospectiveCommentVote_RetrospectiveCommentId",
                table: "RetrospectiveCommentVote",
                column: "RetrospectiveCommentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RetrospectiveCommentVote");

            migrationBuilder.DropTable(
                name: "RetrospectiveComment");
        }
    }
}
