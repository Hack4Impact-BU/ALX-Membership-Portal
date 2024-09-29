# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

users = [
  { name: "Alice Johnson", email: "alice.johnson@example.com" },
  { name: "Bob Smith", email: "bob.smith@example.com" },
  { name: "Charlie Brown", email: "charlie.brown@example.com" },
  { name: "Diana Prince", email: "diana.prince@example.com" },
  { name: "Edward Elric", email: "edward.elric@example.com" },
  { name: "Fiona Gallagher", email: "fiona.gallagher@example.com" },
  { name: "George Weasley", email: "george.weasley@example.com" },
  { name: "Hannah Abbott", email: "hannah.abbott@example.com" },
  { name: "Isaac Newton", email: "isaac.newton@example.com" },
  { name: "Jenny Smith", email: "jenny.smith@example.com" }
]

users.each do |user_data|
  User.find_or_create_by(email: user_data[:email]) do |user|
    user.name = user_data[:name]
  end
end
