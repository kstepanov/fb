require_relative "db/dao"

task default: %w[migrate]

task :migrate do
  DAO.db.alter_table :users do
    add_column :address, String
    add_column :country, String
    add_column :city, String
    add_column :interests, String
  end
end