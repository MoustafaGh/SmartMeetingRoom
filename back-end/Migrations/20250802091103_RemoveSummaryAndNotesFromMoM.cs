using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartMeetingRoomApi.Migrations
{
    public partial class RemoveSummaryAndNotesFromMoM : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "MoMs");

            migrationBuilder.RenameColumn(
                name: "Summary",
                table: "MoMs",
                newName: "FilePath");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FilePath",
                table: "MoMs",
                newName: "Summary");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "MoMs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
