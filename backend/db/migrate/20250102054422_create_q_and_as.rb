class CreateQAndAs < ActiveRecord::Migration[7.2]
  def change
    create_table :q_and_as do |t|
      t.string :question
      t.string :answer

      t.timestamps
    end
  end
end
