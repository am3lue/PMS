using SearchLight

# Configure the database connection
SearchLight.Configuration.load() |> SearchLight.connect

# Create tables if they don't exist
if !SearchLight.table_exists("projects")
  SearchLight.Migration.create_table("projects", [
    SearchLight.Migration.column("id", :bigint, "PRIMARY KEY AUTO_INCREMENT"),
    SearchLight.Migration.column("name", :string),
    SearchLight.Migration.column("description", :text),
    SearchLight.Migration.column("start_date", :datetime),
    SearchLight.Migration.column("end_date", :datetime, "NULL"),
    SearchLight.Migration.column("created_at", :datetime),
    SearchLight.Migration.column("updated_at", :datetime)
  ])
end