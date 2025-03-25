class CreateTrainings < ActiveRecord::Migration[7.2]
  def change
    create_table :trainings do |t|
      t.string :trainingTitle
      t.text :trainingDesc
      t.string :link
      t.date :date

      t.timestamps
    end
  end
end
