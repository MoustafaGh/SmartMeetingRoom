using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartMeetingRoomApi.Migrations
{
    /// <inheritdoc />
    public partial class Fix_ScheduledMeetingMoMRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MoMs_ScheduledMeetingId",
                table: "MoMs");

            migrationBuilder.CreateIndex(
                name: "IX_MoMs_ScheduledMeetingId",
                table: "MoMs",
                column: "ScheduledMeetingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MoMs_ScheduledMeetingId",
                table: "MoMs");

            migrationBuilder.CreateIndex(
                name: "IX_MoMs_ScheduledMeetingId",
                table: "MoMs",
                column: "ScheduledMeetingId",
                unique: true);
        }
    }
}
