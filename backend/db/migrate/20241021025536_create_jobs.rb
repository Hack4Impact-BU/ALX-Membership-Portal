class CreateJobs < ActiveRecord::Migration[7.2]
  def change
    create_table :jobs do |t|
      t.string :title
      t.string :company
      t.text :description
      t.text :responsibilities
      t.text :requirements
      t.string :salary
      t.string :contact
      t.string :location
      t.timestamps
    end
  end
end