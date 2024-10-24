class RemoveLogoFromJobs < ActiveRecord::Migration[7.2]
  def change
    remove_column :jobs, :logo, :string
  end
end
