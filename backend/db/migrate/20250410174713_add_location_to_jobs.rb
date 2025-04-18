class AddLocationToJobs < ActiveRecord::Migration[7.2]
  def change
    add_column :jobs, :location, :string
  end
end
