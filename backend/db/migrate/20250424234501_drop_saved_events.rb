class DropSavedEvents < ActiveRecord::Migration[7.2]
  def change
    drop_table :saved_events
  end
end
