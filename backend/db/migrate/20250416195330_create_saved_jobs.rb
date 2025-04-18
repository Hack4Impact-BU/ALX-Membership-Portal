class CreateSavedJobs < ActiveRecord::Migration[7.2]
  def change
    create_table :saved_jobs do |t|
      t.string :user_id, null: false
      t.references :job, null: false, foreign_key: true
      t.timestamps
      
      t.index [:user_id, :job_id], unique: true
    end
  end
end
