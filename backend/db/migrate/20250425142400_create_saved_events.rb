class CreateSavedEvents < ActiveRecord::Migration[7.2]
  def change
    create_table :saved_events do |t|
      t.string :user_id, null: false
      t.references :eventlist, null: false, foreign_key: true

      t.timestamps

      # Add unique index to prevent duplicate saves
      t.index [:user_id, :eventlist_id], unique: true
    end
  end
end
