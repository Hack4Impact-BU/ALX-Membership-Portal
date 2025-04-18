class AddIsSavedToJobs < ActiveRecord::Migration[7.2]
  def change
    add_column :jobs, :is_saved, :boolean
  end
end
