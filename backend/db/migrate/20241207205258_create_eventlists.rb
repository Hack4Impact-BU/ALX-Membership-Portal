class CreateEventlists < ActiveRecord::Migration[7.2]
  def change
    create_table :eventlists do |t|
      t.string :eventType
      t.date :startDate
      t.date :endDate
      t.string :location
      t.string :org
      t.time :timeStart
      t.time :timeEnd
      t.string :eventName
      t.boolean :isSaved
      t.text :eventDesc
      t.text :instruct
      t.string :pic
      t.string :phone

      t.timestamps
    end
  end
end
