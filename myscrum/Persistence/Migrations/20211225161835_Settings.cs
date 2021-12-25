using Microsoft.EntityFrameworkCore.Migrations;

namespace myscrum.Persistence.Migrations
{
    public partial class Settings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserSprintSetting",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SprintId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CapacityPerDay = table.Column<int>(type: "int", nullable: false),
                    DaysOff = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSprintSetting", x => new { x.UserId, x.SprintId });
                    table.ForeignKey(
                        name: "FK_UserSprintSetting_Sprint_SprintId",
                        column: x => x.SprintId,
                        principalTable: "Sprint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSprintSetting_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserSprintSetting_SprintId",
                table: "UserSprintSetting",
                column: "SprintId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSprintSetting");
        }
    }
}
