class CreateResearches < ActiveRecord::Migration[7.2]
  def change
    create_table :researches do |t|
      t.string :researchTitle
      t.text :researchDesc
      t.string :link
      t.date :date
      t.string :location

      t.timestamps
    end
  end
end
