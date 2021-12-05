using Microsoft.EntityFrameworkCore.Migrations;

namespace myscrum.Persistence.Migrations
{
    public partial class ProjectFkWorkItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "WorkItem",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_WorkItem_ProjectId",
                table: "WorkItem",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkItem_Project_ProjectId",
                table: "WorkItem",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkItem_Project_ProjectId",
                table: "WorkItem");

            migrationBuilder.DropIndex(
                name: "IX_WorkItem_ProjectId",
                table: "WorkItem");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "WorkItem");
        }
    }
}
